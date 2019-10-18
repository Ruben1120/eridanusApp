<?php
    $json = file_get_contents('php://input');
    $dados = json_decode($json, true);
    if(isset($dados["nome"]) && isset($dados["sobrenome"]) && isset($dados["cidade"]) && isset($dados["email"]) && isset($dados["senha"]) && isset($dados["chave"])){
        $banco = new mysqli("localhost", "id8224055_user_eridanus", "rjbcprojetoeridanusif","id8224055_eridanus");
        if(mysqli_connect_errno()){
            echo "erro banco";
            exit;
        }
        $email = $dados["email"];
        $sql = "select * from usuario where email = ?";
        $prepare = $banco->prepare($sql);
        $prepare->bind_param("s", $email);
        $prepare->execute();
        $prepare->store_result();
        if($prepare->num_rows == 0){
            $nome = $dados["nome"];
            $sobrenome = $dados["sobrenome"];
            $cidade = $dados["cidade"];
            $senha = md5($dados["senha"]);   
            $sql =  "insert into usuario(nome, sobrenome, cidade, email, senha) value(?, ?, ?, ?, ?)";
            $prepare = $banco->prepare($sql);
            $prepare->bind_param("sssss", $nome, $sobrenome, $cidade, $email, $senha);
            $prepare->execute();
            mkdir("../imagens-projetos/".md5($email), 0777);
			mkdir("../imagens-objetos/".md5($email), 0777);
			echo "sucesso";
        }else{
            echo "emailExiste";
        }
    }else{
        echo "teste";
    }
?>