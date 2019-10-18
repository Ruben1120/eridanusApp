import React, { Component } from 'react';

import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {BarIndicator} from "react-native-indicators";
import AsyncStorage from "@react-native-community/async-storage";
import {Icon, Header} from "native-base";;
import axios from "axios";

export default class MeusProjetos extends Component {
  static navigationOptions = {
    drawerIcon: ({tintColor}) => (
      <Icon name="home" style={{fontSize: 24 , color: tintColor}}/>
    )
  }
  
  constructor(props){
      super(props);
      this.state= {
        id: null,
        dados: "",
        loading: true,
        conexao: false,
     }
  }
  async componentDidMount(){
    await AsyncStorage.getItem("userid").then(id => {
      console.log(id);
      this.setState({id: parseInt(id)});
    });
    axios.post('http://projetoeridanus.000webhostapp.com/app/inicio.php', {
      chave: "",
      id: this.state.id
    }).then(response => {
        this.setState({loading: false, conexao: true});
        if(response.data.indexOf("Erro") > -1){
            console.log(response.data);
            this.setState({conexao: false});    
        }else{
            this.setState({dados: response.data});
            console.log(response.data);
        }
    }).catch(erro => {
      console.log(erro);
      this.setState({conexao: false, loading: false});
    });
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
          return(
            <View style={{flex: 1}}>
              <Header style={{backgroundColor: "#64dd17", width: 400}}>
                <Icon onPress={() => {this.props.navigation.openDrawer()}} name="menu" style={{marginTop: 14, marginRight: 330, color: "#fff"}}/>
              </Header>
              <View style={estilos.container}>
                <Text style={[estilos.titulo, {marginTop: 100}]}>Olá {this.state.dados} ;)</Text>
                <Text style={{fontSize: 17}}>Já ajudou o meio ambiente hoje?</Text>
                <ScrollView style={{marginTop: 40}} horizontal={true}>
                  <View style={estilos.card}>
                    <Text style={[estilos.textoCard, {fontWeight: "bold", fontSize: 18, marginBottom: 30}]}>Daniel Carvalho</Text>  
                    <Text style={[estilos.textoCard]}>"Mudanças são necessárias. Reciclagem não é só no meio ambiente, mas também no ambiente do nosso ser."</Text>
                  </View>
                  <View style={estilos.card}>
                    <Text style={[estilos.textoCard, {fontWeight: "bold", fontSize: 18, marginBottom: 30}]}>Dijalma A. Moura</Text>  
                    <Text style={[estilos.textoCard]}>"O luxo vem do lixo. A lixeira está cheia de luxo."</Text>
                  </View>
                  <View style={[estilos.card, {marginRight: 10}]}>
                    <Text style={[estilos.textoCard, {fontWeight: "bold", fontSize: 18, marginBottom: 30}]}>João de Paula</Text>  
                    <Text style={[estilos.textoCard]}>"Lixo eletrônico é tudo aquilo e você vê, lê e acha que não serve para nada, então outros reciclam, selecionam e constroi o seu pensamento."</Text>
                  </View>
                </ScrollView>
              </View>
            </View>
          );
      }
    }
  }
}
const estilos = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fafafa",
        justifyContent: "center"
    },
    titulo: {
        fontSize: 25, 
        fontWeight: "bold", 
        margin: 10,        
    },
    icone: {
        fontSize: 19,
        color: "#fff"
    },
    card: {
        backgroundColor: "#67dd17",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        width: 300,
        height: 200,
        marginLeft: 15,
        borderRadius: 4,
        marginTop: 50
    },
    textoCard:{
      color: "#fff"
    }
});