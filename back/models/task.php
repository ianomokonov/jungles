<?php
require_once __DIR__ . '/../utils/database.php';
require_once __DIR__ . '/../utils/filesUpload.php';
require_once __DIR__ . '/child.php';
class Task
{
    private $dataBase;
    private $table = 'task';
    private $fileUploader;
    private Child $child;

    // конструктор класса Task 
    public function __construct(DataBase $dataBase)
    {
        $this->dataBase = $dataBase;
        $this->child = new Child($dataBase);
        $this->fileUploader = new FilesUpload();
    }

    // Получение информации о задач
    public function getTasksInfo($childId)
    {
        $child = $this->child->getChild($childId);
        $query = "SELECT
        ca.tryCount
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
                return $v['tryCount'] == '1';
            })),
            "cristals" => 0,
            "chests" => 0
        );

        if ($child) {
            $result['cristals'] = $child['cristalCount'];
            $result['chests'] = $child['chestCount'];
        }

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
            $question['tryCount'] = 0;
            if ($childId) {
                $question['childAnswers'] = $this->getChildAnswers($question['id'], $childId);
                if (isset($question['childAnswers'][0])) {
                    $question['tryCount'] = $question['childAnswers'][0]['tryCount'];
                }
            }

            $questions[] = $question;
        }

        return $questions;
    }

    public function checkAnswer($answer, $childId)
    {
        $tryCount = 0;
        if (isset($answer['childAnswerId']) && $answer['childAnswerId']) {
            $tryCount = $this->getChildAnswer($answer['childAnswerId'])['tryCount'] + 1;
            $updateQuery = "UPDATE childAnswer SET answerId=?, tryCount=? WHERE id=?";
            $updateStmt = $this->dataBase->db->prepare($updateQuery);
            $updateStmt->execute(array($answer['id'], $tryCount, $answer['childAnswerId']));
        } else {
            $insertQuery = "INSERT INTO childAnswer (childId, answerId) VALUES (?,?)";
            $insertStmt = $this->dataBase->db->prepare($insertQuery);
            $insertStmt->execute(array($childId, $answer['id']));
        }
        $query = "SELECT
        isCorrect
        FROM
            answer a
        WHERE 
            a.id = " . $answer['id'];
        $stmt = $this->dataBase->db->query($query);
        $isCorrect = $stmt->fetch()['isCorrect'] == '1';
        if ($isCorrect) {
            $cristalCount = $this->getQuestionByAnswerId($answer['id'])['cristalCount'];
            $this->child->addCristals($childId, $cristalCount);
        } else if ($tryCount !== 0 && $tryCount % 3 == 0) {
            $this->child->removeCristals($childId, 1);
        }
        return $isCorrect;
    }

    public function checkAnswerVariants($answers, $childId)
    {

        foreach ($answers as $answer) {
            $inserQuery = "INSERT INTO childAnswer (childId, answerId, variantId) VALUES (?,?,?)";
            $insertStmt = $this->dataBase->db->prepare($inserQuery);
            $insertStmt->execute(array($childId, $answer['id'], $answer['variantId']));
            $query = "SELECT
                correctVariantId
                FROM
                    answer a
                WHERE 
                    a.id = " . $answer['id'];
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
        ca.tryCount,
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
            $answer['tryCount'] = $answer['tryCount'] * 1;
            $answer['id'] = $answer['id'] * 1;
            $answer['answerId'] = $answer['answerId'] * 1;
            $answers[] = $answer;
        }

        return $answers;
    }

    public function getChildAnswer($id)
    {
        $query = "SELECT
        *
        FROM
            childAnswer
        WHERE 
            id = $id";
        $stmt = $this->dataBase->db->query($query);

        return $stmt->fetch();
    }

    public function getQuestionByAnswerId($id)
    {
        $query = "SELECT
        q.taskId, q.type, q.name, q.image, q.cristalCount
        FROM
            question q JOIN answer a ON q.id = a.questionId
        WHERE 
            a.id = $id";
        $stmt = $this->dataBase->db->query($query);

        return $stmt->fetch();
    }
}
