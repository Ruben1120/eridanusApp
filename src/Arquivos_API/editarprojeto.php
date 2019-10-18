<?php
    $json = file_get_contents('php://input');
    $dados = json_decode($json, true);
    if(isset($dados["titulo"]) && isset($dados["codigo"]) && isset($dados["descricao"]) && isset($dados["materiais"]) && isset($dados["chave"])){
        $banco = new mysqli("localhost", "id8224055_user_eridanus", "rjbcprojetoeridanusif","id8224055_eridanus");
        if(mysqli_connect_errno()){
            echo "erro banco";
            exit;
        }
        $codigo = $dados["codigo"];
        $titulo = $dados["titulo"];
        $descricao = $dados["descricao"];
        $materiais = $dados["materiais"];
        $sql = "update projeto set titulo = ?, descricao = ?, materiais = ?, status_atual='em avaliacao' where codigo = ?";
        $prepare = $banco->prepare($sql);
        $prepare->bind_param("sssi", $titulo, $descricao, $materiais, $codigo);
        $prepare->execute();
    }else{
        echo "teste";
    }
?>
