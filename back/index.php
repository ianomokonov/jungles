<?php

require_once 'vendor/autoload.php';
require_once './utils/database.php';
require_once './utils/token.php';
require_once './models/user.php';

use Psr\Http\Message\ResponseInterface as Response;
use Slim\Psr7\Response as ResponseClass;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;


$dataBase = new DataBase();
$token = new Token();
$app = AppFactory::create();
$app->setBasePath(rtrim($_SERVER['PHP_SELF'], '/index.php'));

// Add error middleware
$app->addErrorMiddleware(true, true, true);
// Add routes
$app->post('/login', function (Request $request, Response $response) use ($dataBase) {

    $user = new User($dataBase);
    $requestData = $request->getParsedBody();
    try {
        $response->getBody()->write(json_encode($user->login($requestData['email'], $requestData['password'])));
        return $response;
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(array("message" => "пользователь не найден")));
        return $response->withStatus(401);
    }
});

$app->post('/sign-up', function (Request $request, Response $response) use ($dataBase) {
    $user = new User($dataBase);
    $response->getBody()->write(json_encode($user->create((object) $request->getParsedBody())));
    return $response;
});

$app->group('/user', function (RouteCollectorProxy $group) {
    $group->get('/userinfo', function (Request $request, Response $response) {
        $userId = $request->getAttribute('userId');
        $response->getBody()->write(json_encode($userId));
        return $response;
    });
})->add(function (Request $request, RequestHandler $handler) use ($token) {
    try {
        $jwt = explode(' ', $request->getHeader('Authorization')[0])[1];
        $userId = $token->decode($jwt)->data->id;
        $request = $request->withAttribute('userId', $userId);
        $response = $handler->handle($request);

        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        echo json_encode($e->getMessage());
        $response->getBody()->write(json_encode(array("message" => $e->getMessage())));
        return $response->withStatus($e->getCode());
    }
    if (false) {
        $response = $handler->handle($request);
        return $response;
    } else {
    }
});

$app->run();
