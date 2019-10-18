<?php
    $json = file_get_contents('php://input');
    $dados = json_decode($json, true);
    if(isset($dados["chave"]) && isset($dados["id"])){
        $banco = new mysqli("localhost", "id8224055_user_eridanus", "rjbcprojetoeridanusif","id8224055_eridanus");
        if(mysqli_connect_errno()){
            echo "erro banco";
            exit;
        }
        
        // verifica os projeto de o usuario já deu o like
        $jaDeuLike = array();
        $sql = "select id_projeto from likes where id_usuario = ?";
        $prepare = $banco->prepare($sql);
        $prepare->bind_param("i", $dados["id"]);
        $prepare->bind_result($codigoProjeto);
        $prepare->execute();
        $prepare->store_result();
        while($prepare->fetch()){
            array_push($jaDeuLike,$codigoProjeto);
        }
        
        //pega todos os projetos aprovados
        $sql = "SELECT projeto.titulo, projeto.codigo , projeto.descricao, projeto.imagem, projeto.materiais,usuario.nome, usuario.email, usuario.sobrenome FROM projeto INNER JOIN usuario ON  status_atual = 'aprovado' and projeto.id_usuario = usuario.id";
        $prepare = $banco->prepare($sql);
        $prepare->bind_result($nome, $codigo,$descricao, $imagem, $materiais, $autor, $email, $sobrenome);
        $prepare->execute();
        $prepare->store_result();
        $info = array();
        $cont = 0;
        while($prepare->fetch()){
            $info[$codigo] = array("key" => $cont, "codigo" => $codigo,"nome" => $nome, "descricao" => $descricao, "imagem" => $imagem, "materiais" => $materiais, "autor" => $autor, "email" => md5($email), "sobrenome" => $sobrenome, "qtdLikes" => 0, "like" => false);
            $cont++;
        }
        
        //verifica quantos likes oo projeto tem
        $sql = "select id_projeto from likes";
        $prepare = $banco->prepare($sql);
        $prepare->bind_result($codigoProj);
        $prepare->execute();
        $prepare->store_result();
        while($prepare->fetch()){
            $info[$codigoProj]["qtdLikes"]++;
        }
        $banco->close();
        $infoCertas = array();
        
        foreach($info as $chave => $valor){
            if(in_array($chave, $jaDeuLike)){
                $info[$chave]["like"] = true;
            }
        }
        foreach($info as $chave => $valor){
            array_push($infoCertas, $valor);
        }
        echo json_encode($infoCertas);
    }else{
        echo "erro";
    }
?>