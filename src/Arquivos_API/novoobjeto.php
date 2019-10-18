<?php
	$json = file_get_contents('php://input');
    $dados = json_decode($json, true);
    if(isset($dados["chave"]) && isset($dados["nome"]) && isset($dados["descricao"]) && isset($dados["id"])){
        $banco = new mysqli("localhost", "id8224055_user_eridanus", "rjbcprojetoeridanusif","id8224055_eridanus");
        if(mysqli_connect_errno()){
            echo "Erro banco";
            exit;
        }
		$sql = "insert into objeto(nome, descricao, status_atual, imagem, id_usuario) value(?, ?, 'em avaliacao', '', ?)";
        $prepare = $banco->prepare($sql);
        $prepare->bind_param("ssi", $dados["nome"], $dados["descricao"], $dados["id"]);
        $prepare->execute();
        $banco->close();
        echo "sucesso";
    }else{
        echo "Erro";
    }
?>

