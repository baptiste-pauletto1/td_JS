<?php

session_start();

require 'connect.php';

$resultat = new stdClass();
$resultat->result = true; // How is it going ?
$resultat->message = " "; // Error displaying
$resultat->pos = array();

$pdo = getDb();

$sqlCheck = "SELECT POS_X, POS_Y FROM POSITION WHERE ID_PLAYER = :id";

$stmtC = $pdo->prepare($sqlCheck);
$stmtC->bindValue('id', 1, PDO::PARAM_INT); // _SESSION['ID']

$stmtC->execute();
$stmtC->setFetchMode(PDO::FETCH_ASSOC);
$tmp = $stmtC->fetch();

if($tmp['POS_X'] == 0) {  // Verifying that he isn't on a border map (only for a 5*5 map).

    $resultat->result = false;
    $resultat->message = "Map border reached";
    $resultat->pos['POS_X']=0;

} else {

    $resultat->pos['POS_X']= $tmp['POS_X']-1; //Updating the actual position
    $resultat->pos['POS_Y']= $tmp['POS_Y'];
    $sqlUpdate = "UPDATE POSITION SET POS_X = POS_X - 1 WHERE ID_PLAYER = :id";
    $stmt = $pdo->prepare($sqlUpdate);
    $stmt->bindValue('id', 1, PDO::PARAM_INT); // _SESSION['ID']
    try
    {
        $stmt->execute();
    }
    catch (PDOException $e)
    {
        $resultat->result = false;
        $resultat->message = "Database connexion error";
        exit();
    }
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');


echo json_encode($resultat);