<?php
    $json = file_get_contents('php://input');
    $dados = json_decode($json, true);
    if(isset($dados["chave"]) && isset($dados["id"])){
        $banco = new mysqli("localhost", "id8224055_user_eridanus", "rjbcprojetoeridanusif","id8224055_eridanus");
        if(mysqli_connect_errno()){
            echo "erro banco";
            exit;
        }

        $sql = "SELECT projeto.titulo, projeto.codigo, projeto.status_atual , projeto.descricao, projeto.imagem, projeto.materiais,usuario.nome, usuario.email, usuario.sobrenome FROM projeto INNER JOIN usuario ON projeto.id_usuario = usuario.id where usuario.id = ? and status_atual != 'excluido'";
        $prepare = $banco->prepare($sql);
        $prepare->bind_param("i", $dados["id"]);
        $prepare->bind_result($nome, $codigo, $status,$descricao, $imagem, $materiais, $autor, $email, $sobrenome);
        $prepare->execute();
        $prepare->store_result();
        $info = array();
        $cont = 0;
        if($prepare->num_rows == 0){
            $banco->close();
            echo "nenhumProjeto";
            exit;
        }
        while($prepare->fetch()){
            if($status == "aprovado"){
                $info[$codigo] = array("key" => $cont, "codigo" => $codigo,"status" => "Aprovado" ,"nome" => $nome, "descricao" => $descricao, "imagem" => $imagem, "materiais" => $materiais, "autor" => $autor, "email" => md5($email), "sobrenome" => $sobrenome, "qtdLikes" => 0, "cor" => "green");
                $cont++;   
            }else if($status == "reprovado"){
                $info[$codigo] = array("key" => $cont, "codigo" => $codigo,"status" => "Reprovado" ,"nome" => $nome, "descricao" => $descricao, "imagem" => $imagem, "materiais" => $materiais, "autor" => $autor, "email" => md5($email), "sobrenome" => $sobrenome, "qtdLikes" => 0, "cor" => "red");
                $cont++;   
            }else{
                $info[$codigo] = array("key" => $cont, "codigo" => $codigo,"status" => "Em Avaliação" ,"nome" => $nome, "descricao" => $descricao, "imagem" => $imagem, "materiais" => $materiais, "autor" => $autor, "email" => md5($email), "sobrenome" => $sobrenome, "qtdLikes" => 0, "cor" => "#cccc00");
                $cont++;   
            }
        }
        //verifica quantos likes o projeto tem
        $sql = "select likes.id_projeto from likes inner join projeto on projeto.codigo = likes.id_projeto where projeto.id_usuario = ?";
        $prepare = $banco->prepare($sql);
        $prepare->bind_param("i", $dados["id"]);
        $prepare->bind_result($codigoProj);
        $prepare->execute();
        $prepare->store_result();
        while($prepare->fetch()){
            $info[$codigoProj]["qtdLikes"]++;
        }
        $banco->close();
        $infoCertas = array();
        foreach($info as $chave => $valor){
            array_push($infoCertas, $valor);
        }
        echo json_encode($infoCertas);
    }else{
        echo "erro";
    }
?>
