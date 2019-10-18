<?php
	$name = explode(".", $_FILES["image"]["name"]);
	$id = $name["0"];
	echo $id;
	$banco = new mysqli("localhost", "id8224055_user_eridanus", "rjbcprojetoeridanusif","id8224055_eridanus");
    if(mysqli_connect_errno()){
		echo "Erro banco";
		exit;
    }
    $consulta = "select usuario.email, projeto.codigo from usuario inner join projeto on projeto.id_usuario = usuario.id where usuario.id = ? and projeto.imagem = '' and projeto.status_atual = 'em avaliacao'";
    $prepare = $banco->prepare($consulta);
    $prepare->bind_param("i", $id);
    $prepare->bind_result($email, $id_projeto);
    $prepare->execute();
    $prepare->store_result();	
    $prepare->fetch();
    echo $email;
    $target_dir = "../imagens-projetos/".md5($email);
	if(!file_exists($target_dir)){
		mkdir($target_dir, 0777, true);
	}
	$nomeImagem = rand()."_".time().".jpeg";
	$target_dir = $target_dir."/".$nomeImagem;	
	if(move_uploaded_file($_FILES['image']['tmp_name'], $target_dir)){
		$sql = "update projeto set imagem = ? where codigo = ?";
		$prepare = $banco->prepare($sql);
		$prepare->bind_param("si", $nomeImagem,$id_projeto);
		$prepare->execute();
		echo "sucesso";
	}
?>
