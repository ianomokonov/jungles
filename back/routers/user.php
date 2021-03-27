<?php

function route($method, $urlData, $queryData, $formData) {
     
    // Получение информации о товаре
    // GET /user/{goodId}
    if ($method === 'GET' && count($urlData) === 1) {
        // Получаем id товара
        $goodId = $urlData[0];
 
        // Вытаскиваем товар из базы...
 
        // Выводим ответ клиенту
        echo json_encode(array(
            'method' => 'GET',
            'id' => $goodId,
            'good' => 'phone',
            'price' => 10000
        ));
 
        return;
    }
 
}