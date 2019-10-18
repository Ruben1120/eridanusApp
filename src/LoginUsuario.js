import React, { Component } from 'react';
import axios from "axios";
import { BarIndicator } from "react-native-indicators";
import AsyncStorage from "@react-native-community/async-storage";
import { StyleSheet, View, TouchableOpacity, TextInput, ActivityIndicator,  Text} from 'react-native';
import RNRestart from "react-native-restart";
import {Icon} from "native-base";
export default class LoginUsuario extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#64dd17",
    },
    headerTintColor: '#fff'
  };
  constructor(props){
    super(props);
    this.state = {
      email: "",
      senha: "",
      loading: false,
      erro: "",
      erroFatal: false,
      id: null
    }
  }
  logar = async() => {
    if(!this.state.loading){
      var myRe = new RegExp("[a-z0-9.]+@[a-z0-9]+\.[a-z]+", "g");
      var emailValido = myRe.test(this.state.email);
      if(emailValido){
        this.setState({loading: true, erro: ""});
        axios.post('http://projetoeridanus.000webhostapp.com/app/loginUsuario.php', {
          email: this.state.email,
          senha: this.state.senha,
          chave: ""
        })
        .then(async response => {
          console.log(response);
          if(response.data == "erroEmailOuSenha"){
            this.setState({erro: "E-mail e/ou senha inválido(s)!", loading: false});  
          }else{
            this.setState({id: response.data.id, loading: false});    
            await AsyncStorage.setItem("userid", response.data.id.toString());
            console.log(this.state.id); 
            RNRestart.Restart(); 
          }
        })
        .catch(error => {
          console.log(error);
          this.setState({erroFatal: true, loading: false});
        });
        
      }else{
        this.setState({erro: "E-mail inválido!"});
      }
    }
  }
  render() {
    if(this.state.erroFatal){
      return(
        <View style={Styles.container}>
          <Text style={{fontSize: 14, fontWeight: "bold"}}>
            Não foi possivel fazer o login, tente mais tarde!
          </Text>
          <TouchableOpacity style={Styles.button} onPress={() => { this.setState({erroFatal: false}) }}>
            <Text style={Styles.textButton}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={Styles.container}>
        <View>
          <Text style={{fontSize: 33, marginBottom: 50, textAlign: "center", color: "#fff"}}>Entrar</Text>
          <Text style={Styles.rotulo}>Email: </Text>
          <View style={{flexDirection: "row", backgroundColor: "white", height: 50, paddingLeft: 10, borderRadius: 4}}>
            <Icon name="contact" style={{backgroundColor: "white", width: 30, height: 30, marginTop: 10, borderRightWidth: StyleSheet.hairlineWidth}}/><TextInput autoCapitalize="none" style={Styles.input} onChangeText={(text) => { this.setState({email: text}) }} value={this.state.email}/>
          </View>
          <Text style={Styles.rotulo}>Senha: </Text>
          <View style={{flexDirection: "row", backgroundColor: "white", height: 50, paddingLeft: 10, borderRadius: 4}}>
            <Icon name="key" style={{backgroundColor: "white", width: 30,height: 30, marginTop: 10, borderRightWidth: StyleSheet.hairlineWidth}}/><TextInput secureTextEntry={true} style={Styles.input} onChangeText={(text) => { this.setState({senha: text}) }} value={this.state.senha}/>
          </View>
        </View> 
        <Text style={{color: "red", fontWeight: "bold", fontSize: 17}}>{this.state.erro}</Text>
        <TouchableOpacity style={Styles.button} onPress={this.logar}> 
          {this.state.loading ?  <BarIndicator color="#64dd17"/> : <Text style={Styles.textButton}>Login</Text>}
        </TouchableOpacity>
      </View>
    );  
  }
}
const Styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#64dd17"
    },
    button: {
      width: 200,
      height: 70,
      backgroundColor: "#fff",
      padding: 6,
      borderRadius: 4,
      margin: 10,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40
    },
    textButton: {
      fontSize: 19,
      color: "#64dd17",
      fontWeight: "bold",
    },
    input: {
      borderWidth: 1,
      borderColor: "#fff",
      backgroundColor: "#fff",
      width: 230,
      height: 50,
      borderRadius: 4,
      marginBottom: 20
    },
    rotulo: {
      color: "#fff",
      fontSize: 16,
      marginRight: 10,
      marginBottom: 10 
    }
  });
