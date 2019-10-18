<?php
	$json = file_get_contents('php://input');
    $dados = json_decode($json, true);
    if(isset($dados["chave"]) && isset($dados["titulo"]) && isset($dados["descricao"]) && isset($dados["id"]) && isset($dados["materiais"]) && isset($dados["video"])){
        $banco = new mysqli("localhost", "id8224055_user_eridanus", "rjbcprojetoeridanusif","id8224055_eridanus");
        if(mysqli_connect_errno()){
            echo "Erro banco";
            exit;
        }
        $consulta = "select nome from usuario where id = ?";
        $prepare = $banco->prepare($consulta);
        $prepare->bind_param("i", $dados["id"]);
        $prepare->bind_result($nome);
        $prepare->execute();
        $prepare->store_result();
        $prepare->fetch();
        
		$sql = "insert into projeto(titulo, descricao, status_atual, imagem, id_usuario, materiais, autor, video) value(?, ?, 'em avaliacao', '', ?, ?, ?, ?)";
        $prepare = $banco->prepare($sql);
        $prepare->bind_param("ssisss", $dados["titulo"], $dados["descricao"], $dados["id"], $dados["materiais"], $nome,$dados["video"]);
        $prepare->execute();
        $banco->close();
        echo "sucesso";
    }else{
        echo "Erro";
    }
?>
