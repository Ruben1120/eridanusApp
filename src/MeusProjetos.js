import React, { Component } from 'react';

import { View, Text, TextInput,StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {BarIndicator} from "react-native-indicators";
import AsyncStorage from "@react-native-community/async-storage";
import {Icon, Header} from "native-base";
import ActionButton from "react-native-action-button";
import axios from "axios";
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';

const options = {
    title: 'Selecione uma imagem',
    takePhotoButtonTitle: 'Tirar uma foto',
    chooseFromLibraryButtonTitle: 'Selecionar imagem na galeria',
    quality: 1
  };
export default class MeusProjetos extends Component {
  static navigationOptions = {
    drawerIcon: ({tintColor}) => (
      <Icon name="clipboard" style={{fontSize: 24 , color: tintColor}}/>
    )
  }
  
  constructor(props){
      super(props);
      this.state= {
        id: null,
        dados: [],
        loading: true,
        conexao: false,
        projeto: -1,
        criar: false,
        codigo: -1,
        titulo: "",
        descricao: "",
        materiais: "",
        novoProjetoTitulo: "",
        novoProjetoDescricao: "",
        novoProjetoMateriais: "",
        novoProjetoDadosImagem: null,
        novoProjetoNomeDaImagem: "",
        novoProjetoVideo: "",
        alterando: false,
        excluindo: false,
        enviando: false
      }
  }
  async componentDidMount(){
    await AsyncStorage.getItem("userid").then(id => {
      console.log(id);
      this.setState({id: parseInt(id)});
    });
    this.setState({criar: false, projeto: -1, codigo: -1, nome: "", descricao: "", materiais: ""});
    axios.post('http://projetoeridanus.000webhostapp.com/app/meusprojetos.php', {
      chave: "",
      id: this.state.id
    }).then(response => {
        this.setState({loading: false, conexao: true});
        if(response.data == "nenhumProjeto"){
            this.setState({nenhumProjeto: true});    
        }else{
            this.setState({dados: response.data});
            console.log(response.data);
        }
    }).catch(erro => {
      console.log(erro);
      this.setState({conexao: false, loading: false});
    });
  }
  selecionarImagem = () => {
    ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          const source = { uri: response.uri };
          this.setState({novoProjetoNomeDaImagem: response.fileName, novoProjetoDadosImagem: response.data});
        }
    });
  }
  uploadImagem = () => {
    console.log("entrou");
    RNFetchBlob.fetch('POST', 'http://projetoeridanus.000webhostapp.com/app/novoprojetoimagem.php', {
    Authorization : "Bearer access-token",
    otherHeader : "foo",
    'Content-Type' : 'multipart/form-data',
    }, [
        { name : 'image', filename : this.state.id+'.png', type:'image/png', data: this.state.novoProjetoDadosImagem},
    ]).then((resp) => {
        console.log(resp.data);
        this.componentDidMount();
        Alert.alert("Projeto enviado com sucesso!");
        this.setState({enviando: false, modal: false, nenhumProjeto: false});
    }).catch((err) => {
        // ...
    })
  }
  enviarProjeto = () => {  
    if(!this.state.enviando){
        if(this.state.novoProjetoMateriais == "" || this.state.novoProjetoDescricao == "" || this.state.novoProjetoTitulo == "" || this.state.novoProjetoNomeDaImagem == ""){
            this.setState({erro: "Apenas o campo Link do Vídeo pode ficar em branco!"});
        }else{ 
            this.setState({enviando: true, erro: ""});
            axios.post("http://projetoeridanus.000webhostapp.com/app/novoprojeto.php", {
                titulo: this.state.novoProjetoTitulo,
                descricao: this.state.novoProjetoDescricao,
                materiais: this.state.novoProjetoMateriais,
                video: this.state.novoProjetoVideo,
                chave: "",
                id: this.state.id
            }).then(response => {
            console.log(response.data);
            if(response.data.indexOf("sucesso") > -1){
                this.uploadImagem();
            }else{
                this.setState({enviando: false});
                Alert.alert("Não foi possivel enviar o projeto!");
            }
            console.log(response);
            }).catch(erro => {
            console.log(erro);
            });
        }  
    }    
  }
  alterarProjeto = () => {
      if(!this.state.alterando){
        this.setState({alterando: true});
        axios.post("http://projetoeridanus.000webhostapp.com/app/editarprojeto.php",{
            titulo: this.state.nome,
            descricao: this.state.descricao,
            materiais: this.state.materiais,
            codigo: this.state.codigo,
            erro: "",
            chave: ""
        }).then(response => {
            Alert.alert("Projeto Alterado com Sucesso!");
            console.log(response.data);
            this.setState({alterando: false});
        }).catch(erro => {
            this.setState({alterando: false, projeto: -1, conexao: false});
            console.log(erro);
        });
      }
  }
  excluirProjeto = (codigo) => {
    if(!this.state.excluindo){
        this.setState({excluindo: true});
        axios.post("http://projetoeridanus.000webhostapp.com/app/excluirprojeto.php",{
            codigo: codigo,
            chave: ""
        }).then(response => {
            Alert.alert("Projeto Excluido com Sucesso!");
            this.componentDidMount();
            console.log(response.data);
            this.setState({excluindo: false});
        }).catch(erro => {
            Alert.alert("Não foi possivel excluir o projeto!");
            console.log(erro);
        });
    }
  }
  render() {
    if(this.state.loading){  
        return(
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white"}}>
              <BarIndicator color="#64dd17"/>
            </View>
        );
    }else{
        if(!this.state.conexao){
            return(
                <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fafafa"}}>
                    <Text style={{fontSize: 19}}>Você está sem conexão :(</Text>
                    <TouchableOpacity onPress={this.componentDidMount.bind(this)} style={{width: 200, height: 70,backgroundColor: "#64dd17",padding: 6,borderRadius: 4,margin: 10,alignItems: "center",justifyContent: "center",marginTop: 19}}>
                        <Text style={{fontSize: 19, color: "#fff", fontWeight: "bold"}}>Tentar Novamente</Text>
                    </TouchableOpacity>
                </View>
            );
        }else{
            if(this.state.projeto >= 0){
                return (
                    <ScrollView style={{flex: 1, backgroundColor: "#fafafa"}}>
                        <Header style={{backgroundColor: "#64dd17", width: 400}}>
                            <Icon onPress={this.componentDidMount.bind(this)} name="arrow-back" style={{marginTop: 14, marginRight: 350, color: "#fff"}}/>
                        </Header>  
                        <View style={[estilos.container, {alignItems: "center"}]}> 
                            <Text style={[estilos.titulo, {marginRight: 140}]}>Titulo: </Text>
                            <TextInput
                                value={this.state.nome}
                                onChangeText={(text) => { this.setState({nome: text})}}
                                placeholder="Titulo do projeto"
                                style={estilos.input}
                            />
                            <Text style={[estilos.titulo, {marginRight: 110}]}>Descrição: </Text>
                            <TextInput
                                value={this.state.descricao}
                                onChangeText={(text) => { this.setState({descricao: text})}}
                                placeholder="Descrição"
                                style={estilos.input}
                                multiline={true}
                            />
                            <Text style={[estilos.titulo, {marginRight: 110}]}>Materiais: </Text>
                            <TextInput
                                value={this.state.materiais}
                                onChangeText={(text) => { this.setState({materiais: text})}}
                                placeholder="Materiais"
                                style={estilos.input}
                            />
                            <TouchableOpacity onPress={() => { Alert.alert(
                                                this.state.nome,
                                                "Ao alterar o projeto seu status mudará para 'Em avalição'. Proseguir?",
                                                [
                                                    {
                                                    text: 'Não',
                                                    onPress: () => console.log('Cancel Pressed'),
                                                    style: 'cancel',
                                                    },
                                                    {text: 'Sim', onPress: this.alterarProjeto.bind(this)},
                                                ],
                                                {cancelable: false},
                                                ); }} style={[estilos.botao, {backgroundColor: "orange", width: 230, height: 60}]}>
                                {this.state.alterando ? <BarIndicator color="#fff"/> :<Text style={estilos.textButton}>Alterar</Text>}
                            </TouchableOpacity>
                        </View> 
                    </ScrollView>
                );
            }
            if(this.state.nenhumProjeto){
                return(
                    <View style={estilos.container}>
                        <Header style={{backgroundColor: "#64dd17", width: 400}}>
                            <Icon onPress={() => {this.props.navigation.openDrawer()}} name="menu" style={{marginTop: 14, marginRight: 90, color: "#fff"}}/>
                            <Text style={{color: "#fff", fontWeight: "bold", marginTop: 14, fontSize: 20, marginRight: 96}}>Meus Projetos</Text>
                        </Header>
                        <Text style={{fontWeight: "bold", fontSize: 20, marginTop: 50}}> Nenhum Projeto Encontrado </Text>   
                        <Modal isVisible={this.state.modal} style={estilos.modal}>
                            <ScrollView>
                                <View style={{ flex: 1, borderRadius: 3, padding: 25,backgroundColor: "#64dd17"}}>
                                    <Text style={{color:"#fff", fontSize: 20, marginBottom: 17}}>Criar Projeto</Text>
                                    <Text style={[estilos.rotulo, {marginLeft: 0}]}>Titulo: </Text>
                                    <TextInput style={[estilos.input, {marginLeft: 0}]} value={this.state.novoProjetoTitulo} onChangeText={(text) => {this.setState({novoProjetoTitulo: text})}}/>
                                    <Text style={[estilos.rotulo, {marginLeft: 0}]}>Descrição: </Text>
                                    <TextInput multiline={true} style={[estilos.input, {marginLeft: 0, height: 100}]} value={this.state.novoProjetoDescricao} onChangeText={(text) => {this.setState({novoProjetoDescricao: text});}}/>
                                    <Text style={[estilos.rotulo, {marginLeft: 0}]}>Materiais: </Text>
                                    <TextInput multiline={true} style={[estilos.input, {marginLeft: 0, height: 100}]} value={this.state.novoProjetoMateriais} onChangeText={(text) => {this.setState({novoProjetoMateriais: text});}}/>
                                    <Text style={[estilos.rotulo, {marginLeft: 0}]}>Link do Vídeo: </Text>
                                    <TextInput style={[estilos.input, {marginLeft: 0}]} value={this.state.novoProjetoVideo} onChangeText={(text) => {this.setState({novoProjetoVideo: text});}}/>
                                    <Text style={[estilos.rotulo, {marginLeft: 0}]}>Imagem: </Text>
                                    
                                    <View style={{flexDirection: "row", backgroundColor: "white", height: 50, paddingLeft: 10, borderRadius: 4}}>
                                        <Icon name="image" style={{backgroundColor: "white", width: 30,height: 30, marginTop: 10, borderRightWidth: StyleSheet.hairlineWidth}}/><TouchableOpacity style={[estilos.input, {width: 200}]} onPress={this.selecionarImagem.bind(this)}><Text>{this.state.novoProjetoNomeDaImagem}</Text></TouchableOpacity>
                                    </View>
                                    <Text style={{color: "red", fontWeight: "bold", fontSize: 17}}>{this.state.erro}</Text>
                                    <View style={{flexDirection: "row", marginTop: 6}}>
                                        <TouchableOpacity style={[estilos.botao, {backgroundColor: "#ec2300", marginRight: 10}]} onPress={() => { this.setState({modal: false}) }}>
                                            <Text style={estilos.textButton}>Cancelar   <Icon name="close" style={{color: "#fff", fontSize: 19, margin: 9}}/></Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={estilos.botao} onPress={this.enviarProjeto.bind(this)}>
                                            {this.state.enviando ? <BarIndicator color="#67dd17"/> : <Text style={[estilos.textButton,{color: "#64dd17"}]}>Enviar   <Icon name="send" style={{color: "#64dd17", fontSize: 19, margin: 9}}/></Text>}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </Modal>
                        <ActionButton buttonColor="#64dd17" onPress={() => {this.setState({modal: !this.state.modal});}}>
                            <Icon name="add"/>
                        </ActionButton>
                    </View>
                );
            }else{
                return(
                    <View style={estilos.container}>
                        <Header style={{backgroundColor: "#64dd17", width: 400}}>
                            <Icon onPress={() => {this.props.navigation.openDrawer()}} name="menu" style={{marginTop: 14, marginRight: 90, color: "#fff"}}/>
                            <Text style={{color: "#fff", fontWeight: "bold", marginTop: 14, fontSize: 20, marginRight: 96}}>Meus Projetos</Text>
                        </Header>  
                        <FlatList
                            data={this.state.dados}
                            keyExtractor={(item) => item.key.toString()}
                            renderItem={({item}) => { 
                                return(
                                <View style={{justifyContent: "center", borderWidth: 1, borderColor: "#ddd", backgroundColor: "#fff", paddingBottom: 0,alignItems: "center", width: 350, padding: 10, margin: 15, marginLeft: 6, alignItems: "center", borderRadius: 7}}>
                                    <View style={{flexDirection: "row", marginLeft: 10}}>
                                        <View style={{width: 210, alignItems: "flex-start"}}>
                                            <Text style={estilos.titulo}>{item.nome}</Text>
                                            <Text numberOfLines={4} style={estilos.textoSimples}>{item.descricao}</Text>
                                            <Text style={estilos.textoSimples}>Status: <Text style={[estilos.textoSimples, {fontWeight: "bold", color: item.cor}]}>{item.status}</Text></Text>
                                        </View>
                                        <View style={{width: 120}}>
                                        <Image source={{uri: "http://projetoeridanus.000webhostapp.com/imagens-projetos/"+item.email+"/"+item.imagem}} style={{width: 116, height: 116, marginBottom: 10}}/>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: "row", width: 300, alignItems:"flex-start"}}>
                                        <TouchableOpacity style={[estilos.botao, {backgroundColor: "orange"}]} onPress={() => { this.setState({projeto: item.key, nome: item.nome, descricao: item.descricao, codigo: item.codigo, materiais: item.materiais}) }}>
                                            <Text style={estilos.textButton}>Editar  <Icon name="create" style={estilos.icone}/></Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { Alert.alert(
                                                item.nome,
                                                "Deseja realmente excluir esse projeto?",
                                                [
                                                    {
                                                    text: 'Não',
                                                    onPress: () => console.log('Cancel Pressed'),
                                                    style: 'cancel',
                                                    },
                                                    {text: 'Sim', onPress: this.excluirProjeto.bind(this, item.codigo)},
                                                ],
                                                {cancelable: false},
                                                ); }
                                            } 
                                            style={[estilos.botao, {backgroundColor: "#ec2300", marginLeft: 10}]}>
                                            <Text style={estilos.textButton}>Excluir  <Icon name="close" style={estilos.icone}/></Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>); 
                                }
                            }
                        />
                        <Modal isVisible={this.state.modal} style={estilos.modal}>
                            <ScrollView>
                                <View style={{ flex: 1, borderRadius: 3, padding: 25,backgroundColor: "#64dd17"}}>
                                    <Text style={{color:"#fff", fontSize: 20, marginBottom: 17}}>Criar Projeto</Text>
                                    <Text style={[estilos.rotulo, {marginLeft: 0}]}>Titulo: </Text>
                                    <TextInput style={[estilos.input, {marginLeft: 0}]} value={this.state.novoProjetoTitulo} onChangeText={(text) => {this.setState({novoProjetoTitulo: text})}}/>
                                    <Text style={[estilos.rotulo, {marginLeft: 0}]}>Descrição: </Text>
                                    <TextInput multiline={true} style={[estilos.input, {marginLeft: 0, height: 100}]} value={this.state.novoProjetoDescricao} onChangeText={(text) => {this.setState({novoProjetoDescricao: text});}}/>
                                    <Text style={[estilos.rotulo, {marginLeft: 0}]}>Materiais: </Text>
                                    <TextInput multiline={true} style={[estilos.input, {marginLeft: 0, height: 100}]} value={this.state.novoProjetoMateriais} onChangeText={(text) => {this.setState({novoProjetoMateriais: text});}}/>
                                    <Text style={[estilos.rotulo, {marginLeft: 0}]}>Link do Vídeo: </Text>
                                    <TextInput style={[estilos.input, {marginLeft: 0}]} value={this.state.novoProjetoVideo} onChangeText={(text) => {this.setState({novoProjetoVideo: text});}}/>
                                    <Text style={[estilos.rotulo, {marginLeft: 0}]}>Imagem: </Text>
                                    
                                    <View style={{flexDirection: "row", backgroundColor: "white", height: 50, paddingLeft: 10, borderRadius: 4}}>
                                        <Icon name="image" style={{backgroundColor: "white", width: 30,height: 30, marginTop: 10, borderRightWidth: StyleSheet.hairlineWidth}}/><TouchableOpacity style={[estilos.input, {width: 200}]} onPress={this.selecionarImagem.bind(this)}><Text>{this.state.novoProjetoNomeDaImagem}</Text></TouchableOpacity>
                                    </View>
                                    <Text style={{color: "red", fontWeight: "bold", fontSize: 17}}>{this.state.erro}</Text>
                                    <View style={{flexDirection: "row", marginTop: 6}}>
                                        <TouchableOpacity style={[estilos.botao, {backgroundColor: "#ec2300", marginRight: 10}]} onPress={() => { this.setState({modal: false}) }}>
                                            <Text style={estilos.textButton}>Cancelar   <Icon name="close" style={{color: "#fff", fontSize: 19, margin: 9}}/></Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={estilos.botao} onPress={this.enviarProjeto.bind(this)}>
                                            {this.state.enviando ? <BarIndicator color="#67dd17"/> : <Text style={[estilos.textButton,{color: "#64dd17"}]}>Enviar   <Icon name="send" style={{color: "#64dd17", fontSize: 19, margin: 9}}/></Text>}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </Modal>
                        <ActionButton buttonColor="#64dd17" onPress={() => {this.setState({modal: !this.state.modal});}}>
                            <Icon name="add"/>
                        </ActionButton>
                    </View>
                );
            }
        }
    }
  }
}
const estilos = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fafafa"
    },
    titulo: {
        fontSize: 18, 
        fontWeight: "bold", 
        margin: 10,
    },
    rotulo: {
        color: "#fff",
        fontSize: 16,
        marginRight: 10,
        marginBottom: 10 
      },

    textButton: {
        fontSize: 19,
        color: "#fff",
        fontWeight: "bold"
    }, modal: {
        borderRadius: 3,
        padding: 10
    },
    textoSimples:{
        fontSize: 17, 
        margin: 9,
    },
    input: {
        borderRadius: 3,
        backgroundColor: "#fff",
        margin: 10,
        width: 250
    },
    botao:{
        width: 120,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 3,
        marginBottom: 10,
        marginTop: 8,
        backgroundColor: "#fff"
    },
    icone: {
        fontSize: 19,
        color: "#fff"
    }
});