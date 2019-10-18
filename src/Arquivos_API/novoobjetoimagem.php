<?php
	$name = explode(".", $_FILES["image"]["name"]);
	$id = $name["0"];
	$banco = new mysqli("localhost", "id8224055_user_eridanus", "rjbcprojetoeridanusif","id8224055_eridanus");
    if(mysqli_connect_errno()){
		echo "Erro banco";
		exit;
    }
    $consulta = "select usuario.email, objeto.id from usuario inner join objeto on objeto.id_usuario = usuario.id where usuario.id = ? and objeto.imagem = '' and objeto.status_atual = 'em avaliacao'";
    $prepare = $banco->prepare($consulta);
    $prepare->bind_param("i", $id);
    $prepare->bind_result($email, $id_objeto);
    $prepare->execute();
    $prepare->store_result();	
    $prepare->fetch();
    $target_dir = "../imagens-objetos/".md5($email);
	if(!file_exists($target_dir)){
		mkdir($target_dir, 0777, true);
	}
	echo $id_objeto;
	$nomeImagem = rand()."_".time().".jpeg";
	$target_dir = $target_dir."/".$nomeImagem;	
	if(move_uploaded_file($_FILES['image']['tmp_name'], $target_dir)){
		$sql = "update objeto set imagem = ? where id = ?";
		$prepare = $banco->prepare($sql);
		$prepare->bind_param("si", $nomeImagem,$id_objeto);
		$prepare->execute();
		echo "sucesso";
	}
?>
