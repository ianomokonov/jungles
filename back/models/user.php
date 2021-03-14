<?php
require_once __DIR__.'/../utils/database.php';
require_once __DIR__.'/../utils/token.php';
class User
{
    private $dataBase;
    private $table = 'jungleUser';
    private $token;

    // конструктор класса User 
    public function __construct(DataBase $dataBase)
    {
        $this->dataBase = $dataBase;
        $this->token = new Token();
    }

    public function create($userData)
    {
        $userData = $this->dataBase->stripAll((array)$userData);
        $userData['password'] = password_hash($userData['password'], PASSWORD_BCRYPT);
        // Вставляем запрос 
        $query = $this->dataBase->genInsertQuery(
            $userData,
            $this->table
        );

        // подготовка запроса 
        $stmt = $this->dataBase->db->prepare($query[0]);
        if ($query[1][0] != null) {
            $stmt->execute($query[1]);
        }
        $userId = $this->dataBase->db->lastInsertId();
        if($userId != 0){
            return $this->token->encode(array("id" => $userId));
        }
        return null;
    }

    public function login($email, $password)
    {
        if ($email != null) {
            $sth = $this->dataBase->db->prepare("SELECT id, password FROM " . $this->table . " WHERE email = ? LIMIT 1");
            $sth->execute(array($email));
            $fullUser = $sth->fetch();

            if ($fullUser) {
                if (!password_verify($password, $fullUser['password'])) {
                    return false;
                }
                return $this->token->encode(array("id" => $fullUser['id']));
            } else {
                return false;
            }
        } else {
            return array("message" => "Введите данные для регистрации");
        }
    }

    private function EmailExists(string $email)
    {
        $query = "SELECT id FROM " . $this->table . "WHERE email = ?";

        // подготовка запроса 
        $stmt = $this->dataBase->db->prepare($query);
        // инъекция 
        $email = htmlspecialchars(strip_tags($email));
        // выполняем запрос 
        $stmt->execute(array($email));

        // получаем количество строк 
        $num = $stmt->rowCount();

        if ($num > 0) {
            return $stmt->fetch()['id'];
        }

        return $num > 0;
    }
}
