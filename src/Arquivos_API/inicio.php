<?php
	$json = file_get_contents('php://input');
    $dados = json_decode($json, true);
    if(isset($dados["chave"]) && $dados["id"]){
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
        echo $nome;
    }else{
		echo "Erro";
	}
?>
