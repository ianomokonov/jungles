<?php
header("Access-Control-Allow-Origin: https://info-ecology.com/back/controller.php");
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization");

require_once 'vendor/autoload.php';
require_once './utils/database.php';
require_once './utils/token.php';
require_once './models/user.php';
require_once './models/child.php';
require_once './models/task.php';

use Psr\Http\Message\ResponseInterface as Response;
use Slim\Psr7\Response as ResponseClass;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;
use Slim\Routing\RouteContext;

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
        $response->getBody()->write(json_encode(array("message" => "Пользователь не найден")));
        return $response->withStatus(401);
    }
});

$app->post('/sign-up', function (Request $request, Response $response) use ($dataBase) {
    $user = new User($dataBase);
    try {
        $response->getBody()->write(json_encode($user->create((object) $request->getParsedBody())));
        return $response;
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(array("message" => "Пользователь уже существует")));
        return $response->withStatus(401);
    }
});

$app->post('/create-task', function (Request $request, Response $response) use ($dataBase) {
    $task = new Task($dataBase);
    try {
        $response->getBody()->write(json_encode($task->create($request->getParsedBody())));
        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        $response->getBody()->write(json_encode(array("message" => $e->getMessage())));
        return $response->withStatus(500);
    }
});

$app->get('/tasks', function (Request $request, Response $response) use ($dataBase) {
    $task = new Task($dataBase);
    try {
        $response->getBody()->write(json_encode($task->getTasks(null, 0, 20)));
        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        $response->getBody()->write(json_encode($e));
        return $response->withStatus(500);
    }
});

$app->get('/tasks/{taskId}', function (Request $request, Response $response) use ($dataBase) {
    $task = new Task($dataBase);
    
    try {
        
        $routeContext = RouteContext::fromRequest($request);
        $route = $routeContext->getRoute();
        $taskId = $route->getArgument('taskId');
        $response->getBody()->write(json_encode($task->getTask(null, $taskId)));
        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        $response->getBody()->write(json_encode(array("message" => $e->getMessage())));
        return $response->withStatus(500);
    }
});

$app->post('/check-answer', function (Request $request, Response $response) use ($dataBase) {
    $task = new Task($dataBase);
    try {
        $response->getBody()->write(json_encode($task->isCorrectAnswer($request->getParsedBody()['id'])));
        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        $response->getBody()->write(json_encode(array("message" => $e->getMessage())));
        return $response->withStatus(500);
    }
});

$app->post('/check-answer-variants', function (Request $request, Response $response) use ($dataBase) {
    $task = new Task($dataBase);
    try {
        $result = [];
        foreach ($request->getParsedBody() as $answer) {
            $answer['isCorrect'] = $task->isCorrectAnswer($answer['id'], $answer['variantId']);
            $result[] = $answer;
        }
        $response->getBody()->write(json_encode($result));
        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        $response->getBody()->write(json_encode(array("message" => $e->getMessage())));
        return $response->withStatus(500);
    }
});

$app->post('/refresh-token', function (Request $request, Response $response) use ($dataBase) {
    try {
        $user = new User($dataBase);
        $response->getBody()->write(json_encode($user->refreshToken($request->getParsedBody()['token'])));
        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        $response->getBody()->write(json_encode(array("message" => $e->getMessage())));
        return $response->withStatus(401);
    }
});

$app->post('/update-password', function (Request $request, Response $response) use ($dataBase) {
    try {
        $user = new User($dataBase);
        $response->getBody()->write(json_encode($user->getUpdateLink($request->getParsedBody()['email'])));
        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        $response->getBody()->write(json_encode(array("message" => $e->getMessage())));
        return $response->withStatus(500);
    }
});

$app->group('/', function (RouteCollectorProxy $group) use ($dataBase) {
    $group->group('user',  function (RouteCollectorProxy $userGroup) use ($dataBase) {

        $userGroup->get('/user-info', function (Request $request, Response $response) use ($dataBase) {
            $userId = $request->getAttribute('userId');
            $user = new User($dataBase);
            $response->getBody()->write(json_encode($user->read($userId)));
            return $response;
        });
        
        $userGroup->get('/check-admin', function (Request $request, Response $response) use ($dataBase) {
            $userId = $request->getAttribute('userId');
            $user = new User($dataBase);
            $response->getBody()->write(json_encode($user->checkAdmin($userId)));
            return $response;
        });

        $userGroup->post('/update-user-info', function (Request $request, Response $response) use ($dataBase) {
            $userId = $request->getAttribute('userId');
            $user = new User($dataBase);
            if (isset($_FILES['image'])) {
                $response->getBody()->write(json_encode($user->update($userId, $request->getParsedBody(), $_FILES['image'])));
            } else {
                $response->getBody()->write(json_encode($user->update($userId, $request->getParsedBody())));
            }

            return $response;
        });

        $userGroup->post('/create-child', function (Request $request, Response $response) use ($dataBase) {
            $userId = $request->getAttribute('userId');
            $child = new Child($dataBase);
            if (isset($_FILES['image'])) {
                $response->getBody()->write(json_encode($child->create($userId, $request->getParsedBody(), $_FILES['image'])));
            } else {
                $response->getBody()->write(json_encode($child->create($userId, $request->getParsedBody())));
            }

            return $response;
        });

        $userGroup->post('/send-message', function (Request $request, Response $response) use ($dataBase) {
            $userId = $request->getAttribute('userId');
            $user = new User($dataBase);
            $response->getBody()->write(json_encode($user->sendMessage($userId, $request->getParsedBody())));
            return $response;
        });

        $userGroup->post('/update-password', function (Request $request, Response $response) use ($dataBase) {
            $userId = $request->getAttribute('userId');
            $user = new User($dataBase);
            $response->getBody()->write(json_encode($user->updatePassword($userId, $request->getParsedBody()['password'])));
            return $response;
        });

        $userGroup->post('/delete-token', function (Request $request, Response $response) use ($dataBase) {
            $userId = $request->getAttribute('userId');
            $user = new User($dataBase);
            $response->getBody()->write(json_encode($user->removeRefreshToken($userId)));
            return $response;
        });
    });

    $group->group('child/{id}',  function (RouteCollectorProxy $childGroup) use ($dataBase) {

        $childGroup->get('/progress', function (Request $request, Response $response) use ($dataBase) {
            $childId = $request->getAttribute('childId');
            $child = new Child($dataBase);
            $query = $request->getQueryParams();
            $result = $child->getProgress($childId, isset($query['dateFrom']) ? $query['dateFrom'] : null, isset($query['dateTo']) ? $query['dateTo'] : null);
            $response->getBody()->write(json_encode($result));
            return $response;
        });

        $childGroup->get('/payments', function (Request $request, Response $response) use ($dataBase) {
            $childId = $request->getAttribute('childId');
            $child = new Child($dataBase);
            $result = $child->getPayments($childId, isset($query['dateFrom']) ? $query['dateFrom'] : null, isset($query['dateTo']) ? $query['dateTo'] : null);
            $response->getBody()->write(json_encode($result));
            return $response;
        });

        $childGroup->post('/update', function (Request $request, Response $response) use ($dataBase) {
            $childId = $request->getAttribute('childId');
            $child = new Child($dataBase);
            if (isset($_FILES['image'])) {
                $response->getBody()->write(json_encode($child->update($childId, $request->getParsedBody(), $_FILES['image'])));
            } else {
                $response->getBody()->write(json_encode($child->update($childId, $request->getParsedBody())));
            }
            return $response->withStatus(200);
        });

        $childGroup->delete('/delete', function (Request $request, Response $response) use ($dataBase) {
            $childId = $request->getAttribute('childId');
            $child = new Child($dataBase);
            $response->getBody()->write(json_encode($child->delete($childId)));
            return $response->withStatus(200);
        });

        $childGroup->put('/set-alerts-seen', function (Request $request, Response $response) use ($dataBase) {
            $child = new Child($dataBase);
            $response->getBody()->write(json_encode($child->setAlertsSeen($request->getParsedBody()['alertIds'])));
            return $response->withStatus(200);
        });

        $childGroup->group('/tasks',  function (RouteCollectorProxy $taskGroup) use ($dataBase) {
            $taskGroup->get('/get-tasks-info', function (Request $request, Response $response) use ($dataBase) {
                $childId = $request->getAttribute('childId');
                $task = new Task($dataBase);
                $response->getBody()->write(json_encode($task->getTasksInfo($childId, date("Y-m-d"))));
                return $response;
            });

            $taskGroup->get('/get-tasks', function (Request $request, Response $response) use ($dataBase) {
                $childId = $request->getAttribute('childId');
                $task = new Task($dataBase);
                $response->getBody()->write(json_encode($task->getTasks($childId, $request->getQueryParams()['offset'], $request->getQueryParams()['count'])));
                return $response;
            });
            $taskGroup->get('/{taskId}', function (Request $request, Response $response) use ($dataBase) {
                $routeContext = RouteContext::fromRequest($request);
                $childId = $request->getAttribute('childId');
                $route = $routeContext->getRoute();
                $taskId = $route->getArgument('taskId');
                $task = new Task($dataBase);
                $response->getBody()->write(json_encode($task->getTask($childId, $taskId)));
                return $response;
            });
            $taskGroup->post('/check-answer', function (Request $request, Response $response) use ($dataBase) {
                $task = new Task($dataBase);
                $childId = $request->getAttribute('childId');
                $response->getBody()->write(json_encode($task->checkAnswer($request->getParsedBody(), $childId)));
                return $response;
            });
            $taskGroup->post('/check-answer-variants', function (Request $request, Response $response) use ($dataBase) {
                $task = new Task($dataBase);
                $childId = $request->getAttribute('childId');
                $response->getBody()->write(json_encode($task->checkAnswerVariants($request->getParsedBody(), $childId)));
                return $response;
            });
        });
    })->add(function (Request $request, RequestHandler $handler) use ($dataBase) {
        $userId = $request->getAttribute('userId');
        $routeContext = RouteContext::fromRequest($request);
        $route = $routeContext->getRoute();
        $childId = $route->getArgument('id');

        $user = new User($dataBase);

        if ($user->canUserViewChild($userId, $childId)) {
            $request = $request->withAttribute('childId', $childId);
            return $handler->handle($request);
        }

        $response = new ResponseClass();
        $response->getBody()->write(json_encode(array("message" => "Отказано в просмотре ребенка")));
        return $response->withStatus(403);
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
        $response->getBody()->write(json_encode($e));
        if ($e->getCode() && $e->getCode() != 0) {
            return $response->withStatus($e->getCode());
        }
        return $response->withStatus(500);
    }
});

$app->run();
