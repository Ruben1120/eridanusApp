<?php
    $json = file_get_contents('php://input');
    $objetos = json_decode($json, true);
	    if(isset($objetos['senha']) && isset($objetos['email']) && isset($objetos["chave"])){
        $banco = new mysqli("localhost", "id8224055_user_eridanus", "rjbcprojetoeridanusif","id8224055_eridanus");
        if(mysqli_connect_errno()){
            echo "erro banco";
            exit;
        }
        $email = $objetos["email"];
        $senha = md5($objetos["senha"]);
        $sql = "select id from usuario where email = ? and senha = ?"; 
        $prepare = $banco->prepare($sql);
        $prepare->bind_param("ss", $email, $senha);
        $prepare->bind_result($id);
        $prepare->execute();
        $prepare->store_result();
        $prepare->fetch();
        if($prepare->num_rows() > 0){
            $dados = array("id" => $id);
            $json = json_encode($dados);
            echo $json;
        }else{
            echo "erroEmailOuSenha";
        }
        
    }else{
        echo "Você está no lugar errado!";
    }
?>