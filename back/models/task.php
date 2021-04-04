<?php
require_once __DIR__ . '/../utils/database.php';
require_once __DIR__ . '/../utils/filesUpload.php';
class Task
{
    private $dataBase;
    private $table = 'task';
    private $fileUploader;

    // конструктор класса Task 
    public function __construct(DataBase $dataBase)
    {
        $this->dataBase = $dataBase;
        $this->fileUploader = new FilesUpload();
    }

    // Получение информации о задач
    public function getTasksInfo($childId)
    {
        $query = "SELECT
        ca.isFirstTime,
        q.cristalCount
        FROM
            childAnswer ca
            JOIN answer a ON ca.answerId = a.id
            JOIN question q ON a.questionId = q.id
        WHERE
            ca.childId = $childId
            AND (
                a.isCorrect
                OR (
                    a.correctVariantId IS NOT NULL
                    AND a.correctVariantId = ca.variantId
                )
            )
            AND ca.lastUpdateDate >= CURDATE()";
        $todayAnswers = [];
        $stmt = $this->dataBase->db->query($query);
        while ($todayAnswer = $stmt->fetch()) {
            $todayAnswers[] = $this->dataBase->decode($todayAnswer);
        }
        $result = array(
            "todayAnswersCount" => count($todayAnswers),
            "firstTryCount" => count(array_filter($todayAnswers, function ($v) {
                return $v['isFirstTime'] == '1';
            })),
            "cristals" => array_sum(array_map(function ($value) {
                return $value['cristalCount'] * 1;
            }, $todayAnswers)),
            "chests" => 0
        );

        return $result;
    }

    public function getTasks($childId, $offset, $count, $taskId = null)
    {

        $query = "SELECT
        *
        FROM
            task t
        LIMIT $offset, $count";
        if ($taskId) {
            $query = "SELECT
            *
            FROM
                task
            WHERE id = $taskId";
        }
        $stmt = $this->dataBase->db->query($query);
        $tasks = [];
        while ($task = $stmt->fetch()) {
            $task = $this->dataBase->decode($task);
            $task['id'] = $task['id'] * 1;
            $task['type'] = $task['type'] * 1;
            $task['questions'] = $this->getQuestions($task['id'], $childId);
            $tasks[] = $task;
        }
        return $tasks;
    }

    public function getQuestions($taskId, $childId)
    {
        $query = "SELECT
        *
        FROM
            question q
        WHERE 
            q.taskId = $taskId";
        $stmt = $this->dataBase->db->query($query);
        $questions = [];
        while ($question = $stmt->fetch()) {
            $question = $this->dataBase->decode($question);
            $question['id'] = $question['id'] * 1;
            $question['type'] = $question['type'] * 1;
            $question['cristalCount'] = $question['cristalCount'] * 1;
            $question['answers'] = $this->getAnswers($question['id']);
            if ($childId) {
                $question['childAnswers'] = $this->getChildAnswers($question['id'], $childId);
            }
            $questions[] = $question;
        }

        return $questions;
    }

    public function checkAnswer($answer, $childId)
    {
        $inserQuery = "INSERT INTO childAnswer (childId, answerId) VALUES (?,?)";
        $insertStmt = $this->dataBase->db->prepare($inserQuery);
        $insertStmt->execute(array($childId, $answer['id']));
        $query = "SELECT
        isCorrect
        FROM
            answer a
        WHERE 
            a.id = ".$answer['id'];
        $stmt = $this->dataBase->db->query($query);
        return $stmt->fetch()['isCorrect'] == '1';
    }

    public function checkAnswerVariants($answers, $childId)
    {

        foreach ($answers as $answer){
            $inserQuery = "INSERT INTO childAnswer (childId, answerId, variantId) VALUES (?,?,?)";
            $insertStmt = $this->dataBase->db->prepare($inserQuery);
            $insertStmt->execute(array($childId, $answer['id'], $answer['variantId']));
            $query = "SELECT
                correctVariantId
                FROM
                    answer a
                WHERE 
                    a.id = ".$answer['id'];
            $stmt = $this->dataBase->db->query($query);
            $answer->isCorrect = $stmt->fetch()['correctVariantId'] == $answer['variantId'];
        }

        return $answers;
    }

    public function getAnswers($questionId)
    {
        $query = "SELECT
        id, name, image
        FROM
            answer a
        WHERE 
            a.questionId = $questionId";
        $stmt = $this->dataBase->db->query($query);

        $answers = [];
        while ($answer = $stmt->fetch()) {
            $answer = $this->dataBase->decode($answer);
            $answer['id'] = $answer['id'] * 1;
            $answers[] = $answer;
        }

        return $answers;
    }

    public function getChildAnswers($questionId, $childId)
    {
        $query = "SELECT
        ca.id,
        a.isCorrect,
        a.id as answerId,
        (a.correctVariantId = ca.variantId) as isCorrectVariant
        FROM
            childAnswer ca
            JOIN answer a ON a.id = ca.answerId
        WHERE 
            a.questionId = $questionId AND ca.childId = $childId";
        $stmt = $this->dataBase->db->query($query);
        $answers = [];
        while ($answer = $stmt->fetch()) {
            $answer = $this->dataBase->decode($answer);
            $answer['isCorrect'] = $answer['isCorrect'] == '1';
            $answer['id'] = $answer['id'] * 1;
            $answer['answerId'] = $answer['answerId'] * 1;
            $answers[] = $answer;
        }

        return $answers;
    }
}
