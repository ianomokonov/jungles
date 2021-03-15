<?php
require_once __DIR__ . '/../utils/database.php';
require_once __DIR__ . '/../utils/token.php';
class Child
{
    private $dataBase;
    private $table = 'child';
    private $token;

    // конструктор класса User 
    public function __construct(DataBase $dataBase)
    {
        $this->dataBase = $dataBase;
        $this->token = new Token();
    }

    public function create($userId, $data)
    {
        $data = $this->dataBase->stripAll((array)$data);
        $data['userId'] = $userId;
        // Вставляем запрос 
        $query = $this->dataBase->genInsertQuery(
            $data,
            $this->table
        );

        // подготовка запроса 
        $stmt = $this->dataBase->db->prepare($query[0]);
        if ($query[1][0] != null) {
            $stmt->execute($query[1]);
        }
        $id = $this->dataBase->db->lastInsertId();
        return $id;
    }

    public function getProgress($id, $dateFrom = null, $dateTo = null)
    {

        // TODO: переделать, когда будут упражнения
        $result = array(
            "tasks" => array(
                "blocksCompleted" => 1,
                "tasksCompleted" => 20,
                "onFirstTry" => 9,
            ),
            "rewards" => array(
                "cristals" => 10,
                "chests" => 0
            )
        );

        return $result;
    }

    public function getPayments($id, $dateFrom = null, $dateTo = null)
    {

        // TODO: переделать, когда будет оплата
        $result = array(
            array(
                "date" => date(DATE_ATOM, mktime(0, 0, 0, 3, 15, 2021)),
                "sum" => 1000,
                "comment" => "Тариф продлен на 60 дней",
            ),
            array(
                "date" => date(DATE_ATOM, mktime(0, 0, 0, 3, 15, 2021)),
                "sum" => 1000,
                "comment" => "Тариф продлен на 60 дней",
            ),
            array(
                "date" => date(DATE_ATOM, mktime(0, 0, 0, 3, 15, 2021)),
                "sum" => 1000,
                "comment" => "Тариф продлен на 60 дней",
            ),
        );

        return $result;
    }

    public function update($id, $data)
    {
        $data = $this->dataBase->stripAll((array)$data);
        $query = $this->dataBase->genUpdateQuery($data, $this->table, $id);
        $stmt = $this->dataBase->db->prepare($query[0]);
        if ($query[1][0] != null) {
            $stmt->execute($query[1]);
        }
    }

    public function getUserChildren($userId)
    {
        $query = "SELECT id, name, surname, dateOfBirth FROM $this->table WHERE userId = $userId";
        $children = [];
        $stmt = $this->dataBase->db->query($query);
        while ($child = $stmt->fetch()) {
            $child["leftDays"] = 28;
            // $start = DateTime::createFromFormat('')
            $child["alerts"] = $this->getAlerts($child['id']);
            $children[] = $child;
        }

        return $children;
    }

    public function setAlertsSeen($alertIds)
    {
        $query = "UPDATE alerts SET isSeen = true WHERE id IN (" . implode(", ", $alertIds) . ")";
        $this->dataBase->db->query($query);
    }

    private function getAlerts($childId)
    {
        $query = "SELECT id, text, isSeen, createdDate FROM alerts WHERE childId = $childId LIMIT 20";
        $alerts = [];
        $stmt = $this->dataBase->db->query($query);
        while ($alert = $stmt->fetch()) {
            $alert["isSeen"] = $alert["isSeen"] == "1";
            $alert["createdDate"] = date("Y/m/d H:00:00", strtotime($alert["createdDate"]));
            $alerts[] = $alert;
        }
        return $alerts;
    }
}
