import React, { Component } from 'react';
import axios from "axios";
import { View, Text, FlatList, TouchableOpacity, Linking,Image, StyleSheet} from 'react-native';
import { Icon, Header} from "native-base";
import {BarIndicator} from "react-native-indicators";
export default class Objetos extends Component {
  static navigationOptions = {
    drawerIcon: ({tintColor}) => (
      <Icon name="cube" style={{fontSize: 24 , color: tintColor}}/>
    )
  }
  constructor(props){
    super(props);
    this.state = {
      dados: [],
      loading: true,
      conexao: null
    }
  }
  componentDidMount(){
    axios.post('http://projetoeridanus.000webhostapp.com/app/objetos.php', {
      chave: "",
    }).then(response => {
      this.setState({dados: response.data, loading: false, conexao: true});
      console.log(this.state.dados);
    }).catch(erro => {
      this.setState({conexao: false, loading: false});
      console.log(erro);
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
      if(this.state.conexao){
        return (
          <View style={estilos.container}>
            <Header style={{backgroundColor: "#64dd17", width: 400}}>
              <Icon onPress={() => {this.props.navigation.openDrawer()}} name="menu" style={{marginTop: 14, marginRight: 90, color: "#fff"}}/>
              <Text style={{color: "#fff", fontWeight: "bold", marginTop: 14, fontSize: 20, marginRight: 145}}>Objetos</Text>
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
                      <Image source={{uri: "http://projetoeridanus.000webhostapp.com/imagens-objetos/"+item.email+"/"+item.imagem}} style={{width: 330, height: 330, marginBottom: 10}}/>
                      <Text style={{fontSize: 17, margin: 10, textAlign: "justify", marginBottom: 10}}>Cidade: {item.cidade}</Text>
                      <Text style={{fontSize: 17, margin: 10, textAlign: "justify"}}>{item.descricao}</Text>
                      <TouchableOpacity onPress={() => {Linking.openURL("http://projetoeridanus.000webhostapp.com/trocas.php")}}style={{backgroundColor: "#64dd17", width: 330, alignItems: "center", justifyContent: "center", height: 50, borderBottomLeftRadius: 7, borderBottomRightRadius: 7}}>
                        <Text style={{fontSize: 18, color: "#fff", fontWeight: "bold"}}>Negociar</Text>
                      </TouchableOpacity>
                  </View>); 
                }
              }
            />
          </View>
        );
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
      fontSize: 19,
  }
});