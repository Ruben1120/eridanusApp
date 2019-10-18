<?php
    $json = file_get_contents('php://input');
    $dados = json_decode($json, true);
    if(isset($dados["codigo"]) && isset($dados["chave"])){
        $banco = new mysqli("localhost", "id8224055_user_eridanus", "rjbcprojetoeridanusif","id8224055_eridanus");
        if(mysqli_connect_errno()){
            echo "Erro banco";
            exit;
        }
        
        $codigo = $dados["codigo"];
        
        $consulta = "select * from objeto where id = ? and status_atual != 'excluido'";
        $prepare = $banco->prepare($consulta);
        $prepare->bind_param("i", $codigo);
        $prepare->execute();
        $prepare->store_result();
        
        if($prepare->num_rows > 0){
			$sql = "update objeto set status_atual = 'excluido' where id = ?";
			$prepare = $banco->prepare($sql);
			$prepare->bind_param("i", $codigo);
			$prepare->execute();
			$banco->close();
        }
        echo "sucesso";
    }else{
        echo "Erro";
    }
?>
