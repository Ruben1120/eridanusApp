<?php
    $json = file_get_contents('php://input');
    $dados = json_decode($json, true);
    if(isset($dados["titulo"]) && isset($dados["codigo"]) && isset($dados["descricao"]) && isset($dados["chave"])){
        $banco = new mysqli("localhost", "id8224055_user_eridanus", "rjbcprojetoeridanusif","id8224055_eridanus");
        if(mysqli_connect_errno()){
            echo "erro banco";
            exit;
        }
        $codigo = $dados["codigo"];
        $titulo = $dados["titulo"];
        $descricao = $dados["descricao"];
        echo $codigo.$titulo.$descricao;
        $sql = "update objeto set nome = ?, descricao = ?, status_atual = 'em avaliacao' where id = ?";
        $prepare = $banco->prepare($sql);
        $prepare->bind_param("ssi", $titulo, $descricao, $codigo);
        $prepare->execute();
    }else{
        echo "teste";
    }
?>
