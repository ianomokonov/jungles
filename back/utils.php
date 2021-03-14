<?php


function genInsertQuery($ins, $t)
{
    $res = array('INSERT INTO ' . $t . ' (', array());
    $q = '';
    for ($i = 0; $i < count(array_keys($ins)); $i++) {
        $res[0] = $res[0] . array_keys($ins)[$i] . ',';
        $res[1][] = $ins[array_keys($ins)[$i]];
        $q = $q . '?,';
    }
    $res[0] = rtrim($res[0], ',');
    $res[0] = $res[0] . ') VALUES (' . rtrim($q, ',') . ');';

    return $res;
}


function genUpdateQuery($keys, $values, $t, $id)
{
    $res = array('UPDATE ' . $t . ' SET ', array());
    $q = '';
    for ($i = 0; $i < count($keys); $i++) {
        $res[0] = $res[0] . $keys[$i] . '=?, ';
        $res[1][] = $values[$i];
    }
    $res[0] = rtrim($res[0], ', ');
    $res[0] = $res[0] . ' WHERE Id = ' . $id;

    return $res;
}

function stripAll($object)
{
    for ($i = 0; $i < count(array_keys($object)); $i++) {
        $object[array_keys($object)[$i]] = htmlspecialchars(strip_tags($object[array_keys($object)[$i]]));
    }

    return $object;
}
