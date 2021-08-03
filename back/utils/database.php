<?php
//класс базы данных
class DataBase
{
    private $dbname = "jung563255_jungliki";
    private $login = "jung563255_admin";
    private $password = "StasStasStas3714222";
    public $db;
    public function __construct()
    {
        $this->db = new PDO("mysql:host=localhost;dbname=" . $this->dbname . ";charset=UTF8", $this->login, $this->password);
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    }

    public function genInsertQuery($ins, $t)
    {
        $res = array('INSERT INTO ' . $t . ' (', array());
        $q = '';
        for ($i = 0; $i < count(array_keys((array)$ins)); $i++) {
            $res[0] = $res[0] . array_keys((array)$ins)[$i] . ',';
            $res[1][] = $ins[array_keys((array)$ins)[$i]];
            $q = $q . '?,';
        }
        $res[0] = rtrim($res[0], ',');
        $res[0] = $res[0] . ') VALUES (' . rtrim($q, ',') . ');';

        return $res;
    }

    public function genUpdateQuery($data, $t, $id)
    {
        $data = (array) $data;
        $keys = array_keys($data);
        $values = array_values($data);
        $res = array('UPDATE ' . $t . ' SET ', array());
        for ($i = 0; $i < count($keys); $i++) {
            $res[0] = $res[0] . $keys[$i] . '=?, ';
            $res[1][] = $values[$i];
        }
        $res[0] = rtrim($res[0], ', ');
        $res[0] = $res[0] . ' WHERE Id = ' . $id;

        return $res;
    }

    public function stripAll($object)
    {
        for ($i = 0; $i < count(array_keys((array)$object)); $i++) {
            $key = array_keys((array)$object)[$i];

            $object[$key] = htmlspecialchars(strip_tags($object[$key]));
            if ($this->canStrip($object, $key)) {
                $object[$key] = json_encode($object[$key]);
            }
        }
        return $object;
    }

    public function canStrip($object, $key)
    {
        // echo json_encode(array($object[$key], !is_numeric($object[$key])
        // ,strpos($key, 'date') === false
        // ,$object[$key] != false
        // ,strpos($key, 'image') === false));
        return !is_numeric($object[$key])
            && strpos($key, 'date') === false
            && $object[$key] != false
            && strpos($key, 'image') === false;
    }

    public function decode($object)
    {
        for ($i = 0; $i < count(array_keys((array)$object)); $i++) {
            if (
                gettype($object[array_keys((array)$object)[$i]]) == 'string'
                && strpos(array_keys((array)$object)[$i], 'date') === false
            ) {
                $object[array_keys((array)$object)[$i]] = json_decode($object[array_keys((array)$object)[$i]]);
            }
        }
        return $object;
    }
}
