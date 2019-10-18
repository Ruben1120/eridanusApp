import React, { Component } from 'react';
import axios from "axios";
import { View, Text, FlatList, TouchableOpacity,Alert, Image, StyleSheet, ScrollView, StatusBar} from 'react-native';
import { Icon, Header, Left} from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import {BarIndicator} from "react-native-indicators";
export default class Projetos extends Component {
  static navigationOptions = {
    drawerIcon: ({tintColor}) => (
      <Icon name="clipboard" style={{fontSize: 24 , color: tintColor}}/>
    )
  }
  constructor(props){
    super(props);
    this.state = {
      dados: [],
      projeto: -1,
      loading: true,
      conexao: null,
      id: null
    }
  }
  async componentDidMount(){
    await AsyncStorage.getItem("userid").then(id => {
      console.log(id);
      this.setState({id: parseInt(id)});
    });
    axios.post('http://projetoeridanus.000webhostapp.com/app/projetos.php', {
      chave: "",
      id: this.state.id
    }).then(response => {
      this.setState({dados: response.data, loading: false, conexao: true});
      console.log(response.data);
    }).catch(erro => {
      console.log(erro);
      this.setState({conexao: false, loading: false});
    });
  }
  liked = (like, id_projeto) => {
    if(!like){
      axios.post("http://projetoeridanus.000webhostapp.com/app/like.php", {
        id_usuario: this.state.id,
        id_projeto: id_projeto,
        chave: ""
      }).then(response => {
        this.componentDidMount();
        console.log(response.data);
      }).catch(erro => {
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
      if(this.state.conexao){
        if(this.state.projeto < 0){
          return (
            <View style={estilos.container}>
              <Header style={{backgroundColor: "#64dd17", width: 400}}>
                <Icon onPress={() => {this.props.navigation.openDrawer()}} name="menu" style={{marginTop: 14, marginRight: 90, color: "#fff"}}/>
                <Text style={{color: "#fff", fontWeight: "bold", marginTop: 14, fontSize: 20, marginRight: 145}}>Projetos</Text>
              </Header>  
              <FlatList
                data={this.state.dados}
                keyExtractor={(item) => item.key.toString()}
                renderItem={({item}) => { 
                  return(
                    <View style={{justifyContent: "center", borderWidth: 1, borderColor: "#ddd", backgroundColor: "#fff", paddingBottom: 0,alignItems: "center", width: 330, padding: 10, margin: 15, alignItems: "center", borderRadius: 7}}>
                        <View style={{borderBottomWidth: StyleSheet.hairlineWidth, width: 330, marginBottom: 20}}>
                          <Text style={{fontSize: 22, fontWeight: "bold", margin: 10, flex: 1, textAlign: "center"}}>{item.nome}</Text>
                        </View> 
                        <Image source={{uri: "http://projetoeridanus.000webhostapp.com/imagens-projetos/"+item.email+"/"+item.imagem}} style={{width: 330, height: 330, marginBottom: 10}}/>
                        <Text style={{fontSize: 17, margin: 10, textAlign: "justify"}}>{item.descricao}</Text>
                        <View style={{flexDirection: "row"}}>
                          <TouchableOpacity onPress={this.liked.bind(this, item.like, item.codigo)} style={{backgroundColor: "#fff", borderLeftColor: "#ddd", width: 165, alignItems: "center", borderLeftWidth: 1, borderTopColor: "#ddd", borderTopWidth: 1, justifyContent: "center", height: 50, borderBottomLeftRadius: 7, borderBottomRightRadius: 7}}>                       
                            {item.like ? <Text style={{fontSize: 18, fontWeight: "bold", color: "blue"}}>({item.qtdLikes})  <Icon name="thumbs-up" style={{color: "blue"}}/></Text> : <Text style={{fontSize: 18, fontWeight: "bold"}}>({item.qtdLikes})  <Icon name="thumbs-up"/></Text>}
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => { this.setState({projeto: item.key}) }} style={{backgroundColor: "#64dd17", width: 165, alignItems: "center", justifyContent: "center", height: 50, borderBottomRightRadius: 7}}>
                            <Text style={{fontSize: 18, color: "#fff", fontWeight: "bold"}}>Ver Mais</Text>
                          </TouchableOpacity>
                        </View>
                    </View>); 
                  }
                }
              />
            </View>
          );
        }else{
          return (
            <ScrollView style={{flex: 1, backgroundColor: "#fafafa"}}>
              <View style={estilos.container}> 
              <Header style={{backgroundColor: "#64dd17", width: 400}}>
                <Icon onPress={() => { this.setState({projeto: -1}); }} name="arrow-back" style={{marginTop: 14, marginRight: 300, color: "#fff"}}/>
              </Header>  
              <StatusBar backgroundColor="#64dd17" barStyle="light-content" />
                <Text style={{fontSize: 24, fontWeight: "bold", margin: 20, color: "#64dd17"}}>{this.state.dados[this.state.projeto].nome}</Text>
                <Image source={{uri: "http://projetoeridanus.000webhostapp.com/imagens-projetos/"+this.state.dados[this.state.projeto].email+"/"+this.state.dados[this.state.projeto].imagem}} style={{width: 330, borderRadius: 3,height: 330, marginBottom: 10}}/>
                <Text style={{margin: 15, fontSize: 15, textAlign: "justify"}}>{this.state.dados[this.state.projeto].descricao}</Text>
                <View style={{alignItems: "flex-start", width: 330}}>
                  <Text style={{fontSize: 18, fontWeight: "bold", margin: 3, textAlign: "left"}}>Autor:</Text>
                  <Text style={{fontSize: 15, margin: 3}}>{this.state.dados[this.state.projeto].autor}</Text>
                  <Text style={{fontSize: 18, fontWeight: "bold", margin: 3, textAlign: "left"}}>Materiais:</Text>
                  <Text style={{fontSize: 15, margin: 3, marginBottom: 20}}>{this.state.dados[this.state.projeto].materiais}</Text>
                </View>
              </View> 
            </ScrollView> 
          );    
        }
      }else{
        return(
          <View style={estilos.container}>
              <Text style={estilos.texto}>Você está sem conexão :(</Text>
              <TouchableOpacity style={estilos.button}>
                  <Text style={estilos.textButton}>Tentar Novamente</Text>
              </TouchableOpacity>
          </View>
        );
      }
    }
  }  
}
const estilos = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fafafa"
  },
  button: {
      width: 200,
      height: 70,
      backgroundColor: "#64dd17",
      padding: 6,
      borderRadius: 4,
      margin: 10,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 19
  },
  textButton: {
      fontSize: 19,
      color: "#fff",
      fontWeight: "bold"
  },
  texto: {
      fontSize: 19
  }
});