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
    
    public function create($data)
    {
        $questions = $data['questions'];
        unset($data['questions']);
        $data = $this->dataBase->stripAll($data);
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

    public function delete($id)
    {
        $query = "DELETE FROM task WHERE id=$id";
        $stmt = $this->dataBase->db->query($query);
        if (!$stmt) {
            return false;
        }
        return true;
    }

    public function insertTaskQuestions($data, $taskId)
    {
        foreach ($data as $question) {
            // if ($data['image'] != '') {
            //     $data['image'] = $this->fileUploader->upload($data['image'], 'QuestionImages', uniqid());
            // } else {
            //     unset($data['image']);
            // }
            if (isset($question['variants'])) {
                $isVariant = true;
                $q_data = $question['variants'];
                unset($question['variants']);
            } else {
                $isVariant = false;
                $q_data = $question['answers'];
                unset($question['answers']);
            }
            $question = $this->dataBase->stripAll($question);
            $question['taskId'] = $taskId;
            $query = $this->dataBase->genInsertQuery(
                $question,
                'question'
            );
            $stmt = $this->dataBase->db->prepare($query[0]);
            if ($query[1][0] != null) {
                $stmt->execute($query[1]);
            }
            $id = $this->dataBase->db->lastInsertId() * 1;
            if ($isVariant) {
                $this->insertQuestionVariants($q_data, $id);
            } else {
                $this->insertQuestionAnswers($q_data, $id);
            }
        }
    }

    public function insertQuestionVariants($data, $questionId)
    {
        foreach ($data as $variant) {
            $answers = $variant['answers'];
            unset($variant['answers']);
            $variant = $this->dataBase->stripAll($variant);
            $variant['questionId'] = $questionId;
            $query = $this->dataBase->genInsertQuery(
                $variant,
                'variant'
            );
            $stmt = $this->dataBase->db->prepare($query[0]);
            if ($query[1][0] != null) {
                $stmt->execute($query[1]);
            }
            $id = $this->dataBase->db->lastInsertId() * 1;
            $this->insertQuestionAnswers($answers, $questionId, $id);
        }
    }

    public function insertQuestionAnswers($data, $questionId, $variantId = 0)
    {
        foreach ($data as $answer) {
            // if ($data['image'] != '') {
            //     $data['image'] = $this->fileUploader->upload($data['image'], 'AnswerImages', uniqid());
            // } else {
            //     unset($data['image']);
            // }
            $answer = $this->dataBase->stripAll($answer);
            if ($variantId != 0) {
                $answer['correctVariantId'] = $variantId;
            }
            $answer['questionId'] = $questionId;
            $query = $this->dataBase->genInsertQuery(
                $answer,
                'answer'
            );
            $stmt = $this->dataBase->db->prepare($query[0]);
            if ($query[1][0] != null) {
                $stmt->execute($query[1]);
            }
        }
    }

    // Получение информации о задач
    public function getTasksInfo($childId, $dateFrom = null, $dateTo = null)
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
            )";

        if ($dateFrom) {
            $query = $query . " AND ca.lastUpdateDate >= '$dateFrom'";
        }
        if ($dateTo) {
            $query = $query . " AND ca.lastUpdateDate <= '$dateTo'";
        }
        $query = $query . " GROUP BY q.id";
        $todayAnswers = [];
        $stmt = $this->dataBase->db->query($query);
        while ($todayAnswer = $stmt->fetch()) {
            $todayAnswers[] = $this->dataBase->decode($todayAnswer);
        }
        $result = array(
            "answersCount" => count($todayAnswers),
            "blocksCount" => intdiv(count($todayAnswers), 3),
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

    public function getTask($childId, $taskId)
    {
        $query = "SELECT
            *
            FROM
                task
            WHERE id = $taskId";
        $stmt = $this->dataBase->db->query($query);
        $tasks = [];
        while ($task = $stmt->fetch()) {
            $task = $this->dataBase->decode($task);
            $task['id'] = $task['id'] * 1;
            $task['type'] = $task['type'] * 1;
            $task['questions'] = $this->getQuestions($task['id'], $childId);
            $tasks[] = $task;
        }
        return $tasks[0];
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
            $task['allSolved'] = false;
            if ($childId) {
                $task['allSolved'] = $this->isAllSolved($task['id'], $childId);
            } else {
                $task['questions'] = $this->getQuestions($task['id']);
            }

            $tasks[] = $task;
        }
        return $tasks;
    }

    private function isAllSolved($taskId, $childId = null)
    {
        if (!$childId) {
            return false;
        }
        $query = "SELECT
        *
        FROM
            question q
        WHERE 
            q.taskId = $taskId";
        $stmt = $this->dataBase->db->query($query);
        $result = true;
        while ($question = $stmt->fetch()) {
            $answersCount = count($this->getCorrectAnswers($question['id']));
            $childAnswers = $this->getChildAnswers($question['id'], $childId);
            $isCorrect = count($childAnswers) == $answersCount &&  count(array_filter($childAnswers, function ($v) {
                return !$v['isCorrect'];
            })) == 0;
            $result = $result && $isCorrect;
        }

        return $result;
    }
    
    public function getFullTasks()
    {
        $query = "SELECT
        *
        FROM
            task t";
        $stmt = $this->dataBase->db->query($query);
        $tasks = [];
        while ($task = $stmt->fetch()) {
            $tasks[] = $this->getTask(null, $task['id']);
        }
        return $tasks;
    }


    public function getQuestions($taskId, $childId = null)
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
            $question['variants'] = $this->getVariants($question['id']);
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

    public function isCorrectAnswer($id, $variantId = null)
    {
        $query = "SELECT
        isCorrect, correctVariantId
        FROM
            answer a
        WHERE 
            a.id = " . $id;
        $stmt = $this->dataBase->db->query($query);
        $answer =  $stmt->fetch();
        if ($variantId) {
            return $answer['correctVariantId'] == $variantId;
        }
        return $answer['isCorrect'] == '1';
    }

    public function checkAnswer($answer, $childId)
    {
        $tryCount = 0;
        if (isset($answer['childAnswerId']) && $answer['childAnswerId']) {
            $tryCount = $this->getChildAnswer($answer['childAnswerId'])['tryCount'] + 1;
            $updateQuery = "UPDATE childAnswer SET answerId=?, tryCount=?, lastUpdateDate=now() WHERE id=?";
            $updateStmt = $this->dataBase->db->prepare($updateQuery);
            $updateStmt->execute(array($answer['id'], $tryCount, $answer['childAnswerId']));
        } else {
            $insertQuery = "INSERT INTO childAnswer (childId, answerId) VALUES (?,?)";
            $insertStmt = $this->dataBase->db->prepare($insertQuery);
            $insertStmt->execute(array($childId, $answer['id']));
        }

        $isCorrect = $this->isCorrectAnswer($answer['id']);
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
        $tryCount = 0;
        $result = [];
        foreach ($answers as $answer) {
            if (isset($answer['childAnswerId']) && $answer['childAnswerId']) {
                $tryCount = $this->getChildAnswer($answer['childAnswerId'])['tryCount'] + 1;
                $updateQuery = "UPDATE childAnswer SET answerId=?, tryCount=?, variantId=?, lastUpdateDate=now() WHERE id=?";
                $updateStmt = $this->dataBase->db->prepare($updateQuery);
                $updateStmt->execute(array($answer['id'], $tryCount, $answer['variantId'], $answer['childAnswerId']));
            } else {
                $inserQuery = "INSERT INTO childAnswer (childId, answerId, variantId) VALUES (?,?,?)";
                $insertStmt = $this->dataBase->db->prepare($inserQuery);
                $insertStmt->execute(array($childId, $answer['id'], $answer['variantId']));
            }

            $answer['isCorrect'] = $this->isCorrectAnswer($answer['id'], $answer['variantId']);
            $result[] = $answer;
        }

        $isCorrect = count(array_filter($result, function ($v) {
            return !$v['isCorrect'];
        })) == 0;

        if ($isCorrect) {
            $cristalCount = $this->getQuestionByAnswerId($answers[0]['id'])['cristalCount'];
            $this->child->addCristals($childId, $cristalCount);
        } else if ($tryCount !== 0 && $tryCount % 3 == 0) {
            $this->child->removeCristals($childId, 1);
        }
        return $result;
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

    public function getCorrectAnswers($questionId)
    {
        $query = "SELECT
        id, isCorrect, correctVariantId
        FROM
            answer a
        WHERE 
            a.questionId = $questionId";
        $stmt = $this->dataBase->db->query($query);

        $answers = [];
        while ($answer = $stmt->fetch()) {
            if ($answer['isCorrect'] || $answer['correctVariantId'] != null) {
                $answer = $this->dataBase->decode($answer);
                $answer['id'] = $answer['id'] * 1;
                $answers[] = $answer;
            }
        }

        return $answers;
    }

    public function getVariants($questionId)
    {
        $query = "SELECT
        id, name
        FROM
            variant v
        WHERE 
            v.questionId = $questionId";
        $stmt = $this->dataBase->db->query($query);

        $variants = [];
        while ($variant = $stmt->fetch()) {
            $variant = $this->dataBase->decode($variant);
            $variant['id'] = $variant['id'] * 1;
            $variants[] = $variant;
        }

        return $variants;
    }

    public function getChildAnswers($questionId, $childId)
    {
        $query = "SELECT
        ca.id,
        ca.tryCount,
        a.isCorrect,
        a.id as answerId,
        a.correctVariantId,
        ca.variantId
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
            $answer['variantId'] = $answer['variantId'] * 1;
            $answer['id'] = $answer['id'] * 1;
            if ($answer['correctVariantId']) {
                $answer['isCorrect'] = $answer['correctVariantId'] == $answer['variantId'];
            }

            unset($answer['correctVariantId']);
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
