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
        $todayAnswers = $this->dataBase->db->query($query)->fetchAll();
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
            $task['questions'] = $this->getQuestions($task['id'], $childId);
            $tasks[] = $tasks;
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
            $question['answers'] = $this->getAnswers($question['id']);
            $question['childAnswers'] = $this->getChildAnswers($question['id'], $childId);
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

        return $stmt->fetchAll();
    }

    public function getChildAnswers($questionId, $childId)
    {
        $query = "SELECT
        ca.Id,
        a.isCorrect,
        (a.correctVariantId = ca.variantId) as isCorrectVariant
        FROM
            childAnswer ca
            JOIN answer a ON a.id = ca.answerId
        WHERE 
            a.questionId = $questionId AND ca.childId = $childId";
        $stmt = $this->dataBase->db->query($query);

        return $stmt->fetchAll();
    }
}