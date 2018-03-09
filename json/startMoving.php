<?php

session_start();

require 'connect.php';

$resultat = new stdClass();
$resultat->result = true; // How is it going ?
$resultat->message = " "; // Error displaying

$pdo = getDb();

$sqlTimeLength = "SELECT POS_X, POS_Y FROM POSITION WHERE ID_PLAYER = :id";

$stmtTimeLength = $pdo->prepare($sqlTimeLength);
$stmtTimeLength->bindValue('id', 1, PDO::PARAM_INT); // _SESSION['ID']
try
{
    $stmtTimeLength->execute();
    $stmtTimeLength->setFetchMode(PDO::FETCH_ASSOC);
    $tmp = $stmtTimeLength->fetch();

}
catch (PDOException $e)
{
    $resultat->result = false;
    $resultat->message = "Database connexion error";
    exit();
}

$distX = abs($tmp['POS_X']-$_POST['POS_X_DEST']);
$distY = abs($tmp['POS_Y']-$_POST['POS_Y_DEST']);

$timeLength = $distX + $distY;

$sqlInsert = "INSERT INTO PATH(ID_PLAYER, POS_X, POS_Y, TIME_START, TIME_LENGTH) VALUES (:id, :pos_x, :pos_y, :time_start, :time_length)";

$stmtInsert = $pdo->prepare($sqlInsert);


$stmtInsert->bindValue('id', 1, PDO::PARAM_INT); // _SESSION['ID']
$stmtInsert->bindValue('pos_x',$_POST['POS_X_DEST'] , PDO::PARAM_INT); // arrival position (x)
$stmtInsert->bindValue('pos_y',$_POST['POS_Y_DEST'], PDO::PARAM_INT); // arrival position (y)

$timeStart = date("Y-m-d H:i:s");
$stmtInsert->bindValue('time_start', $timeStart,PDO::PARAM_STR); // time it started

$stmtInsert->bindValue('time_length', $timeLength, PDO::PARAM_INT); // length of the moving

try
{
    $stmtInsert->execute();
}
catch (PDOException $e)
{
    $resultat->result = false;
    $resultat->message = "Database connexion error";
    exit();
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');


echo json_encode($resultat);