<?php
    $json = file_get_contents('php://input');
    $dados = json_decode($json, true);
   // if(isset($dados["chave"])){
        $banco = new mysqli("localhost", "id8224055_user_eridanus", "rjbcprojetoeridanusif","id8224055_eridanus");
        if(mysqli_connect_errno()){
            echo "erro banco";
            exit;
        }
        $sql = "SELECT objeto.nome, objeto.id, objeto.descricao, objeto.imagem, usuario.nome, usuario.email, usuario.cidade, usuario.sobrenome FROM objeto INNER JOIN usuario ON  status_atual = 'aprovado' and objeto.id_usuario = usuario.id";
        $prepare = $banco->prepare($sql);
        $prepare->bind_result($nome, $codigo, $descricao, $imagem, $autor, $email, $cidade, $sobrenome);
        $prepare->execute();
        $prepare->store_result();
        $dados = array();
        $cont = 0;
        while($prepare->fetch()){
            $dados[] = array("key" => $cont, "nome" => $nome, "codigo" => $codigo, "descricao" => $descricao, "imagem" => $imagem, "email" => md5($email), "cidade" => $cidade, "sobrenome" => $sobrenome);
            $cont++;
        }
        echo json_encode($dados);
    //}else{
        //echo "erro";
    //}
?>
