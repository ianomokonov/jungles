<?php
// Определяем метод запроса
$method = $_SERVER['REQUEST_METHOD'];
// Получаем данные из тела запроса
$formData = getFormData($method);
$url = (isset($_GET['q'])) ? $_GET['q'] : '';
$url = rtrim($url, '/');
$urls = explode('/', $url);


// Определяем роутер и url data
$router = $urls[0];
$urlData = array_slice($urls, 1);

// Подключаем файл-роутер и запускаем главную функцию
include_once 'routers/' . $router . '.php';
route($method, $urlData, $_GET, $formData);


function getFormData($method)
{

    // GET или POST: данные возвращаем как есть
    if ($method === 'GET') return $_GET;

    $data = json_decode(file_get_contents('php://input'), true);
    return $data;
}
