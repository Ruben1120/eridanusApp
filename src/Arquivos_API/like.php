<?php
    $json = file_get_contents('php://input');
    $dados = json_decode($json, true);
    if(isset($dados["chave"]) && isset($dados["id_usuario"]) && isset($dados["id_projeto"])){
        $banco = new mysqli("localhost", "id8224055_user_eridanus", "rjbcprojetoeridanusif","id8224055_eridanus");
        if(mysqli_connect_errno()){
            echo "erro banco";
            exit;
        }
        
        $consulta = "select * from projeto where codigo = ? and status_atual != 'excluido'";
        $prepare = $banco->prepare($consulta);
        $prepare->bind_param("i", $dados["id_projeto"]);
        $prepare->execute();
        $prepare->store_result();
        
        if($prepare->num_rows > 0){
			$sql = "select id_projeto from likes where id_usuario = ? and id_projeto = ?";
			$prepare = $banco->prepare($sql);
			$prepare->bind_param("ii", $dados["id_usuario"], $dados["id_projeto"]);
			$prepare->bind_result($codigoProjeto);
			$prepare->execute();
			$prepare->store_result();
			if($prepare->num_rows == 0){
				$sql = "insert into likes(id_usuario, id_projeto) value(?, ?)";
				$prepare = $banco->prepare($sql);
				$prepare->bind_param("ii", $dados["id_usuario"] ,$dados["id_projeto"]);
				$prepare->execute();
			}else{
				echo "já deu o like";
			}
		}      
        $banco->close();
    }else{
        echo "erro";
    }
?>
