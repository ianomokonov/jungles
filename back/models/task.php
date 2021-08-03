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
        $this->setOrder($data['number']);
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
        $resultIds = array();
        $this->insertTaskQuestions($questions, $id, $resultIds);
        return $resultIds;
    }

    private function setOrder($newNumber, $curNumber = null, $remove = false)
    {
        $newNumber = $newNumber * 1;
        $curNumber = !$curNumber ? null : $curNumber * 1;
        $tasks = $this->getShortTasks();
        if ($remove) {
            $query = "UPDATE task SET number = task.number - 1 WHERE task.number > $curNumber";
            $this->dataBase->db->query($query);
            return;
        }
        if (!$curNumber && $newNumber < count($tasks)) {
            $query = "UPDATE task SET number = task.number + 1 WHERE task.number >= $newNumber";
            $this->dataBase->db->query($query);
        }
        if ($newNumber < count($tasks) && $curNumber) {
            if ($curNumber < $newNumber) {
                $query = "UPDATE task SET number = task.number - 1 WHERE task.number > $curNumber AND task.number <= $newNumber";
                $this->dataBase->db->query($query);
            }

            if ($curNumber > $newNumber) {
                $query = "UPDATE task SET number = task.number + 1 WHERE task.number >= $newNumber AND task.number < $curNumber";
                $this->dataBase->db->query($query);
            }
        }

        if ($curNumber && $newNumber == count($tasks)) {
            $query = "UPDATE task SET number = task.number - 1 WHERE task.number > $curNumber";
            $this->dataBase->db->query($query);
        }
    }

    public function delete($id)
    {
        $task = $this->getShortTask($id);
        $this->setOrder(0, $task['number'], true);
        $this->removeTaskFiles($id);
        $query = "DELETE FROM task WHERE id=$id";
        $stmt = $this->dataBase->db->query($query);
        if (!$stmt) {
            return false;
        }
        return true;
    }

    public function addQuestionImage($questionId, $image)
    {
        $imagePath = json_encode($this->fileUploader->upload($image, 'QuestionImages', uniqid()));
        $query = "UPDATE question SET image='$imagePath' WHERE id=$questionId";
        $stmt = $this->dataBase->db->query($query);
        return json_decode($imagePath);
    }
    public function addQuestionSound($questionId, $sound)
    {
        $soundPath = json_encode($this->fileUploader->upload($sound, 'QuestionSounds', uniqid()));
        $query = "UPDATE question SET sound=? WHERE id=$questionId";
        $stmt = $this->dataBase->db->prepare($query);
        $stmt->execute(array($soundPath));
        return json_decode($soundPath);
    }
    public function updateTask($id, $data)
    {
        $task = $this->getShortTask($id);
        $this->setOrder($data['number'], $task['number']);
        $data = $this->dataBase->stripAll((array)$data);
        $query = $this->dataBase->genUpdateQuery($data, $this->table, $id);
        $stmt = $this->dataBase->db->prepare($query[0]);
        if ($query[1][0] != null) {
            $stmt->execute($query[1]);
        }
        return true;
    }

    public function updateVariant($id, $data)
    {
        $data = $this->dataBase->stripAll((array)$data);
        $query = $this->dataBase->genUpdateQuery($data, 'variant', $id);
        $stmt = $this->dataBase->db->prepare($query[0]);
        if ($query[1][0] != null) {
            $stmt->execute($query[1]);
        }
        return true;
    }
    public function updateQuestion($id, $data)
    {
        if (isset($data['removeImg'])) {
            $this->fileUploader->removeFile($data['removeImg']);
            $data['image'] = null;
            unset($data['removeImg']);
        }

        if (isset($data['removeSound'])) {
            $this->fileUploader->removeFile($data['removeSound']);
            $data['sound'] = null;
            unset($data['removeSound']);
        }

        $data = $this->dataBase->stripAll((array)$data);
        $query = $this->dataBase->genUpdateQuery($data, 'question', $id);
        $stmt = $this->dataBase->db->prepare($query[0]);
        if ($query[1][0] != null) {
            $stmt->execute($query[1]);
        }
        return true;
    }
    public function updateAnswer($id, $data)
    {
        if (isset($data['removeImg'])) {
            $this->fileUploader->removeFile($data['removeImg']);
            $data['image'] = null;
            unset($data['removeImg']);
        }
        unset($data['removeImg']);
        $data = $this->dataBase->stripAll((array)$data);
        $query = $this->dataBase->genUpdateQuery($data, 'answer', $id);
        $stmt = $this->dataBase->db->prepare($query[0]);
        $stmt->execute($query[1]);
        return true;
    }
    public function addAnswerImage($answerId, $image)
    {
        $imagePath = json_encode($this->fileUploader->upload($image, 'AnswerImages', uniqid()));
        $query = "UPDATE answer SET image='$imagePath' WHERE id=$answerId";
        $stmt = $this->dataBase->db->query($query);
        return json_decode($imagePath);
    }

    public function removeTaskFiles($taskId)
    {
        $query = "SELECT q.image as questionImage, 
        q.sound as questionSound, 
        a.image as answerImage 
        FROM `question` q RIGHT JOIN answer a ON a.questionId = q.id 
        WHERE q.taskId = $taskId AND (a.image IS NOT NULL OR q.image IS NOT NULL OR q.sound IS NOT NULL)";
        $stmt = $this->dataBase->db->query($query);
        while ($question = $stmt->fetch()) {;
            if ($question['questionImage']) {
                $this->fileUploader->removeFile($question['questionImage']);
            }
            if ($question['questionSound']) {
                $this->fileUploader->removeFile(json_decode($question['questionSound']));
            }
            if ($question['answerImage']) {
                $this->fileUploader->removeFile($question['answerImage']);
            }
        }
    }

    public function insertTaskQuestions($data, $taskId, &$resultIds)
    {
        foreach ($data as $question) {
            if (isset($question['variants']) && count($question['variants']) > 0) {
                $isVariant = true;
                if (isset($question['answers'])) {
                    unset($question['answers']);
                }
                $q_data = $question['variants'];
                unset($question['variants']);
            } else {
                $isVariant = false;
                $q_data = $question['answers'];
                unset($question['answers']);
                if (isset($question['variants'])) {
                    unset($question['variants']);
                }
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
            $questionIds = array('id' => $id);
            if ($isVariant) {
                $this->insertQuestionVariants($q_data, $id, $questionIds);
            } else {
                $this->insertQuestionAnswers($q_data, $id, 0, $questionIds);
            }
            $resultIds[] = $questionIds;
        }
    }

    public function insertQuestionVariants($data, $questionId, &$resultIds)
    {
        $resultIds['variants'] = [];
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
            $variantIds = array('id' => $id);

            $this->insertQuestionAnswers($answers, $questionId, $id, $variantIds);
            $resultIds['variants'][] = $variantIds;
        }
    }

    public function insertQuestionAnswers($data, $questionId, $variantId, &$resultIds)
    {
        $resultIds['answers'] = [];
        foreach ($data as $answer) {
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

            $stmt->execute($query[1]);
            $id = $this->dataBase->db->lastInsertId() * 1;
            $resultIds['answers'][] = $id;
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

    public function getShortTasks()
    {
        $query = "SELECT
        id, number
        FROM
            task
        ORDER BY number";
        $stmt = $this->dataBase->db->query($query);
        $tasks = [];
        while ($task = $stmt->fetch()) {
            $task = $this->dataBase->decode($task);

            $tasks[] = $task;
        }
        return $tasks;
    }

    public function getShortTask($id)
    {
        $query = "SELECT
        id, number
        FROM
            task
        WHERE id=$id";
        $stmt = $this->dataBase->db->query($query);
        $tasks = [];
        while ($task = $stmt->fetch()) {
            $task = $this->dataBase->decode($task);

            $tasks[] = $task;
        }
        return $tasks[0];
    }

    public function getTasks($childId, $offset = null, $count = null)
    {
        if ($childId && $offset * 1 == 0) {
            $child = $this->child->getChild($childId);
            if ($child) {
                $count = 20 + $child['chestCount'] * 1;
            }
        }
        $query = "SELECT
        *
        FROM
            task t
        ORDER BY number";
        if ($offset != null && $count != null) {
            $query = $query . " LIMIT $offset, $count";
        }
        $stmt = $this->dataBase->db->query($query);
        $tasks = [];
        while ($task = $stmt->fetch()) {
            $task = $this->dataBase->decode($task);
            $task['id'] = $task['id'] * 1;
            $task['type'] = $task['type'] * 1;
            $task['allSolved'] = false;
            $task['questionsCount'] = $this->getQuestionsCount($task['id']);
            if ($childId) {
                $task['allSolved'] = $this->isAllSolved($task['id'], $childId);
            } else {
                $task['questions'] = $this->getQuestions($task['id']);
            }

            $tasks[] = $task;
        }
        return $tasks;
    }

    // private function getActiveTask($childId){
    //     $query = "
    //         SELECT t.id, t.number, q.id as questionId FROM task t JOIN question q ON q.taskId=t.id JOIN answer a ON a.questionId=q.id
    //         LEFT JOIN (select ca.answerId FROM childAnswer ca WHERE ca.childId=?) caa ON caa.answerId=a.id
    //         WHERE a.isCorrect=1 AND caa.answerId IS NULL
    //         ORDER BY t.number
    //         LIMIT 1
    //     ";
    //     $stmt = $this->dataBase->db->prepare($query);
    //     return $stmt->execute(array($childId))->fetch();
    // }

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
            $childAnswer = $this->getQuestionChildAnswer($question['id'], $childId);
            if (!$childAnswer) {
                return false;
            }
            $result = $result && $childAnswer['isSolved'] == '1';
        }

        return $result;
    }

    public function getFullTasks()
    {
        $query = "SELECT
        *
        FROM
            task t
        ORDER BY number";
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
            q.taskId = $taskId
        ORDER BY number";
        $stmt = $this->dataBase->db->query($query);
        $questions = [];
        while ($question = $stmt->fetch()) {
            $question = $this->dataBase->decode($question);
            $question['id'] = $question['id'] * 1;
            $question['type'] = $question['type'] * 1;
            $question['cristalCount'] = $question['cristalCount'] * 1;
            $question['answers'] = $this->getAnswers($question['id']);
            $question['variants'] = $this->getVariants($question['id']);
            if ($childId) {
                $question['childAnswer'] = $this->getQuestionChildAnswer($question['id'], $childId);
            }

            $questions[] = $question;
        }

        return $questions;
    }

    public function getQuestionsCount($taskId)
    {
        $query = "SELECT
        *
        FROM
            question q
        WHERE 
            q.taskId = $taskId
        ORDER BY number";
        $stmt = $this->dataBase->db->query($query);


        return count($stmt->fetchAll());
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
        return array("isCorrect" => $answer['isCorrect'] == '1', "childAnswerId" => null);
    }

    public function checkAnswer($answer, $childId)
    {
        $tryCount = 0;
        $childAnswerId = 0;

        $isCorrect = $this->isCorrectAnswer($answer['id'])['isCorrect'];
        $isSolved = false;

        if (isset($answer['childAnswerId']) && $answer['childAnswerId']) {
            $childAnswerId = $answer['childAnswerId'];
            $childAnswer = $this->getChildAnswer($answer['childAnswerId']);
            $isSolved = $childAnswer['isSolved'] == '1';
            $tryCount = $isCorrect ? 0 : $childAnswer['tryCount'] + 1;
            $nextIsSolved = $isSolved || $isCorrect;
            $updateQuery = "UPDATE childAnswer SET answerId=?, tryCount=?, isSolved=?, lastUpdateDate=now() WHERE id=?";
            $updateStmt = $this->dataBase->db->prepare($updateQuery);
            $updateStmt->execute(array($answer['id'], $tryCount, $nextIsSolved, $answer['childAnswerId']));
        } else {
            $insertQuery = "INSERT INTO childAnswer (childId, answerId, isSolved) VALUES (?,?,?)";
            $insertStmt = $this->dataBase->db->prepare($insertQuery);
            $insertStmt->execute(array($childId, $answer['id'], $isCorrect));
            $childAnswerId = $this->dataBase->db->lastInsertId() * 1;
        }

        if ($isCorrect) {
            if (!$isSolved) {
                $cristalCount = $this->getQuestionByAnswerId($answer['id'])['cristalCount'];
                $this->child->addCristals($childId, $cristalCount);
            }
        } else if ($tryCount !== 0 && $tryCount % 3 == 0) {
            $this->child->removeCristals($childId, 1);
        }

        return array("isCorrect" => $isCorrect, "childAnswerId" => $childAnswerId);
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

    public function getQuestionChildAnswer($questionId, $childId)
    {
        $query = "SELECT
        ca.id,
        ca.tryCount,
        ca.isSolved,
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
        $answer = $stmt->fetch();
        if (!$answer) {
            return null;
        }
        $answer = $this->dataBase->decode($answer);
        $answer['isCorrect'] = $answer['isCorrect'] == '1';
        $answer['isSolved'] = $answer['isSolved'] == '1';
        $answer['tryCount'] = $answer['tryCount'] * 1;
        $answer['variantId'] = $answer['variantId'] * 1;
        $answer['id'] = $answer['id'] * 1;
        if ($answer['correctVariantId']) {
            $answer['isCorrect'] = $answer['correctVariantId'] == $answer['variantId'];
        }

        unset($answer['correctVariantId']);
        $answer['answerId'] = $answer['answerId'] * 1;

        return $answer;
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
