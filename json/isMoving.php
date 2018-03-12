<?php

session_start();

require 'connect.php';

$resultat = new stdClass();
$resultat->result = true; // How is it going ?
$resultat->message = " "; // Error displaying
$resultat->pos = array();

$pdo = getDb();

$sqlMove = "SELECT POS_X, POS_Y, TIME_START, TIME_LENGTH FROM PATH WHERE ID_PLAYER = :id";

$stmtMove = $pdo->prepare($sqlMove);
$stmtMove->bindValue('id', 1, PDO::PARAM_INT);

try
{
    $stmtMove->execute();

    if($stmtMove->rowCount() == 1){ //Si un trajet est en cours
        $stmtMove->setFetchMode(PDO::FETCH_ASSOC);
        $tmp = $stmtMove->fetch();
        $resultat->pos['POS_X_DEST'] = $tmp['POS_X']; $resultat->pos['POS_Y_DEST'] = $tmp['POS_Y'];
        $timeStart = $tmp['TIME_START'];
        $timeLength = $tmp['TIME_LENGTH'];

        if ($timeStart + $timeLength < $_POST['TIME']){ //Si trajet terminé

            $sqlDelete = "DELETE FROM PATH WHERE ID_PLAYER = :id";
            $stmtDelete = $pdo->prepare($sqlDelete);
            $stmtDelete->bindValue('id', 1, PDO::PARAM_INT);

            $stmtDelete->execute();

            $sqlInit = "SELECT POS_X, POS_Y FROM POSITION WHERE ID_PLAYER = :id";
            $stmtInit = $pdo->prepare($sqlInit);
            $stmtInit->bindValue('id', 1, PDO::PARAM_INT);

            $stmtInit->execute();
            $stmtInit->setFetchMode(PDO::FETCH_ASSOC);
            $tmpInit = $stmtInit->fetch();
            $resultat->pos['POS_X_INIT'] = $tmpInit['POS_X']; $resultat->pos['POS_Y_INIT'] = $tmpInit['POS_Y'];

            $sqlUpdate = "UPDATE POSITION SET POS_X = :pos_x, POS_Y =:pos_y WHERE ID_PLAYER = :id";
            $stmtUpdate = $pdo->prepare($sqlUpdate);
            $stmtUpdate->bindValue('id', 1, PDO::PARAM_INT);

            $stmtUpdate->bindValue('pos_x', $tmp['POS_X'], PDO::PARAM_INT);
            $stmtUpdate->bindValue('pos_y', $tmp['POS_Y'], PDO::PARAM_INT);

            $stmtUpdate->execute();
            $resultat->result = false;
            $resultat->message = "Travel finished";

        } else { //Trajet non terminé
            $resultat->result = true;
            $resultat->message = "Still moving";
            $resultat->timeLeft = $timeStart + $timeLength - $_POST['TIME'];
        }
    } else { //Aucun trajet en cours
        $resultat->result = false;
        $resultat->message ="No travel yet";
    }



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