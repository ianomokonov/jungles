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

    public function create($data)
    {
        $data = $this->dataBase->stripAll((array)$data);
        $questions = $data['questions'];
        unset($data['questions']);
        $query = $this->dataBase->genInsertQuery(
            $data,
            $this->table
        );
        $stmt = $this->dataBase->db->prepare($query[0]);
        if ($query[1][0] != null) {
            $stmt->execute($query[1]);
        }
        $id = $this->dataBase->db->lastInsertId();
        $this->insertTaskQuestions($questions, $id);
        return $id;
    }

    public function insertTaskQuestions($data, $taskId)
    {
        foreach ($data as $question) {
            if ($data['image'] != '') {
                $data['image'] = $this->fileUploader->upload($data['image'], 'QuestionImages', uniqid());
            } else {
                unset($data['image']);
            }
            $answers = $question['answers'];
            unset($question['answers']);
            $question['taskId'] = $taskId;
            $query = $this->dataBase->genInsertQuery(
                $question,
                'questions'
            );
            $stmt = $this->dataBase->db->prepare($query[0]);
            if ($query[1][0] != null) {
                $stmt->execute($query[1]);
            }
            $id = $this->dataBase->db->lastInsertId();
            $this->insertQuestionAnswers($answers, $id);
        }
    }

    public function insertQuestionAnswers($data, $questionId)
    {
        foreach ($data as $answer) {
            if ($data['image'] != '') {
                $data['image'] = $this->fileUploader->upload($data['image'], 'AnswerImages', uniqid());
            } else {
                unset($data['image']);
            }
            $answer['taskId'] = $questionId;
            $query = $this->dataBase->genInsertQuery(
                $answer,
                'answers'
            );
            $stmt = $this->dataBase->db->prepare($query[0]);
            if ($query[1][0] != null) {
                $stmt->execute($query[1]);
            }
        }
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

    public function getTasks($childId, $offset, $count)
    {
        $query = "SELECT
        *
        FROM
            task t
        LIMIT $offset, $count";
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
            $answers[] = $answer;
        }

        return $answers;
    }
}
