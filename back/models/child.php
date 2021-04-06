<?php
require_once __DIR__ . '/../utils/database.php';
require_once __DIR__ . '/../utils/token.php';
require_once __DIR__ . '/../utils/filesUpload.php';
class Child
{
    private $dataBase;
    private $table = 'child';
    private $token;
    private $fileUploader;

    // конструктор класса User 
    public function __construct(DataBase $dataBase)
    {
        $this->dataBase = $dataBase;
        $this->fileUploader = new FilesUpload();
        $this->token = new Token();
    }

    public function create($userId, $data, $image = '')
    {

        $data = $this->dataBase->stripAll((array)$data);
        if ($image != '') {
            $data['image'] = $this->fileUploader->upload($image, 'ChildrenImages', uniqid());
        } else {
            unset($data['image']);
        }
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
            "blocksDone" => 1,
            "tasksDone" => 20,
            "onFirstTry" => 9,
            "cristals" => 10,
            "chests" => 0
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

    public function update($id, $data, $image = null)
    {
        $data = $this->dataBase->stripAll((array)$data);
        if ($image != null) {
            $childImage = $this->getChildImage($id);
            if ($childImage) {
                $this->fileUploader->removeFile($childImage);
            }
            $data['image'] = json_encode($this->fileUploader->upload($image, 'ChildrenImages', uniqid()));
        }
        if (isset($data['image']) && $data['image'] == 'null') {
            $data['image'] = '';
        }
        $query = $this->dataBase->genUpdateQuery($data, $this->table, $id);
        $stmt = $this->dataBase->db->prepare($query[0]);
        if ($query[1][0] != null) {
            $stmt->execute($query[1]);
        }
        return true;
    }

    public function addCristals($id, $cristals)
    {
        $query = "UPDATE child SET cristalCount=cristalCount + $cristals WHERE id=$id";
        $this->dataBase->db->query($query);
        return true;
    }

    public function removeCristals($id, $cristals)
    {
        $query = "UPDATE child SET cristalCount=cristalCount - $cristals WHERE id=$id";
        $this->dataBase->db->query($query);
        return true;
    }

    public function addChest($id, $chests)
    {
        $query = "UPDATE child SET chestCount=chestCount + $chests WHERE id=$id";
        $this->dataBase->db->query($query);
        return true;
    }

    public function delete($id)
    {
        $childImage = $this->getChildImage($id);
        if ($childImage) {
            $this->fileUploader->removeFile($childImage);
        }
        $this->dataBase->db->query("DELETE FROM $this->table WHERE id = $id");
        return true;
    }

    public function getChildImage($childId)
    {
        $query = "SELECT image FROM $this->table WHERE id = $childId";
        $stmt = $this->dataBase->db->query($query);

        return $stmt->fetch()['image'];
    }

    public function getUserChildren($userId)
    {
        $now = new DateTime();
        $query = "SELECT id, name, surname, dateOfBirth, image FROM $this->table WHERE userId = $userId";
        $children = [];
        $stmt = $this->dataBase->db->query($query);
        while ($child = $stmt->fetch()) {
            $child = $this->dataBase->decode($child);
            $child["id"] = $child["id"] * 1;
            $date = DateTime::createFromFormat('Y-m-d', $child["dateOfBirth"]);
            $child["age"] = $now->diff($date)->y;
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

    public function getChild($id)
    {
        $query = "SELECT
        *
        FROM
            child
        WHERE 
            id = $id";
        $stmt = $this->dataBase->db->query($query);
        $child = $stmt->fetch();
        $child['cristalCount'] = $child['cristalCount'] * 1;
        $child['chestCount'] = $child['chestCount'] * 1;
        return $child;
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
