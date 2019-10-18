<?php
    $json = file_get_contents('php://input');
    $dados = json_decode($json, true);
    if(isset($dados["chave"]) && $dados["id"]){
        $banco = new mysqli("localhost", "id8224055_user_eridanus", "rjbcprojetoeridanusif","id8224055_eridanus");
        if(mysqli_connect_errno()){
            echo "Erro banco";
            exit;
        }
        
        $sql = "SELECT objeto.nome, objeto.id, objeto.status_atual, objeto.descricao, objeto.imagem, usuario.nome, usuario.email, usuario.cidade, usuario.sobrenome FROM objeto INNER JOIN usuario ON objeto.id_usuario = usuario.id where usuario.id = ? and status_atual != 'excluido'";
        $prepare = $banco->prepare($sql);
        $prepare->bind_result($nome, $codigo, $status, $descricao, $imagem, $autor, $email, $cidade, $sobrenome);
        $prepare->bind_param("i", $dados["id"]);
        $prepare->execute();
        $prepare->store_result();
        $dados = array();
        $cont = 0;
        while($prepare->fetch()){
            if($status == "aprovado"){
                $dados[] = array("key" => $cont, "codigo" => $codigo,"status" => "Aprovado" ,"nome" => $nome, "descricao" => $descricao, "imagem" => $imagem, "autor" => $autor, "email" => md5($email), "sobrenome" => $sobrenome, "cor" => "green");
                $cont++;   
            }else if($status == "reprovado"){
                $dados[] = array("key" => $cont, "codigo" => $codigo,"status" => "Reprovado" ,"nome" => $nome, "descricao" => $descricao, "imagem" => $imagem, "autor" => $autor, "email" => md5($email), "sobrenome" => $sobrenome, "cor" => "red");
                $cont++;   
            }else{
                $dados[] = array("key" => $cont, "codigo" => $codigo,"status" => "Em Avaliação" ,"nome" => $nome, "descricao" => $descricao, "imagem" => $imagem, "autor" => $autor, "email" => md5($email), "sobrenome" => $sobrenome, "cor" => "#cccc00");
                $cont++;   
            }
        }
        
        if($prepare->num_rows > 0){
			echo json_encode($dados);
		}else{
			echo "nenhumObjeto";
        }
    }else{
        echo "Erro";
    }
?>
