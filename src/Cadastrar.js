import React, { Component } from 'react';

import { View, StyleSheet, ActivityIndicator,ScrollView, TextInput, Text, TouchableOpacity} from 'react-native';
import { BarIndicator } from "react-native-indicators";
import axios from "axios"; 
export default class Cadastrar extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#64dd17",
    },
    headerTintColor: '#fff'
  };
  constructor(props){
    super(props);
    this.state = {
      nome: "",
      sobrenome: "",
      email: "",
      senha: "",
      cidade: "",
      confirmSenha: "",
      loading: false,
      erro: "",
      tela: "cadastro"
    }
  }
  cadastrar = () => {
    if(!this.state.loading){
      this.setState({loading: true});
      if(this.state.nome != 0 && this.state.sobrenome != 0 && this.state.cidade != 0 && this.state.email != 0 && this.state.senha != 0){
        var myRe = new RegExp("[a-z0-9.]+@[a-z0-9]+\.[a-z]+", "g");
        var emailValido = myRe.test(this.state.email);
        if(emailValido){
          if(this.state.senha == this.state.confirmSenha){
            this.setState({erro: ""});
            axios.post('http://projetoeridanus.000webhostapp.com/app/cadastrar.php', {
            nome: this.state.nome,
            sobrenome: this.state.sobrenome,
            email: this.state.email,
            cidade: this.state.cidade,
            senha: this.state.senha,
            confirmSenha: this.state.confirmSenha,
            chave: "",
            })
            .then(response => {
              if(response.data == "sucesso"){
                this.setState({tela: "sucessoNoCadastro", loading: false});
              }else if(response.data == "emailExiste"){
                this.setState({erro: "E-mail já cadastrado!", loading: false});
              }
              console.log(response);
            })
            .catch(error => {
              this.setState({tela: "erro"});
              console.log(error);
            });
          }else{
            this.setState({erro: "As senhas não conferem!", loading: false});
          }
        }
      }else{
        this.setState({erro: "Por favor preencha todos os dados!", loading: false});        
      }
    }
  }
  render() {
    if(this.state.tela == "cadastro"){
      return( 
        <ScrollView>
          <View style={Styles.container}>
            <View style={{marginTop: 30}}>
            <Text style={{fontSize: 33, marginBottom: 40, textAlign: "center", color: "#fff"}}>Cadastre-se!</Text>
              <Text style={Styles.rotulo}>Nome: </Text>
              <TextInput style={Styles.input} onChangeText={(text) => { this.setState({nome: text});}}/>
              <Text style={Styles.rotulo}>Sobrenome: </Text>
              <TextInput style={Styles.input} onChangeText={(text) => { this.setState({sobrenome: text});}}/>
              <Text style={Styles.rotulo}>Cidade: </Text>
              <TextInput style={Styles.input} onChangeText={(text) => { this.setState({cidade: text});}}/>
              <Text style={Styles.rotulo}>Email: </Text>
              <TextInput autoCapitalize="none" style={Styles.input} onChangeText={(text) => { this.setState({email: text});}}/>
              <Text style={Styles.rotulo}>Senha: </Text>
              <TextInput style={Styles.input} secureTextEntry={true} onChangeText={(text) => { this.setState({senha: text});}}/>
              <Text style={Styles.rotulo}>Confimação da senha: </Text>
              <TextInput style={Styles.input} secureTextEntry={true} onChangeText={(text) => { this.setState({confirmSenha: text});}}/>
              <Text style={{color: "red", fontWeight: "bold", fontSize: 17}}>{this.state.erro}</Text>
            </View>
            <TouchableOpacity style={Styles.button} onPress={this.cadastrar}> 
              {this.state.loading ?  <BarIndicator color="#64dd17"/> : <Text style={Styles.textButton}>Cadastrar</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }else if(this.state.tela == "sucessoNoCadastro"){
      return(
        <View style={Styles.container}>
          <Text style={{color: "#fff", fontSize: 20}}>Cadastro efetuado com sucesso!</Text>
          <TouchableOpacity style={Styles.button} onPress={() => {this.props.navigation.navigate("LoginUsuario");}}>
            <Text style={Styles.textButton}>Fazer Login</Text> 
          </TouchableOpacity>
        </View>
      );
    }else if(this.state.tela == "erro"){
      return(
        <View style={Styles.container}>
          <Text style={{fontSize: 14, fontWeight: "bold"}}>
            Não foi possivel fazer o cadastro, tente mais tarde!
          </Text>
          <TouchableOpacity style={Styles.button} onPress={() => { this.setState({tela: "cadastro"}) }}>
            <Text style={Styles.textButton}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
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
    marginTop: 19
  },
  textButton: {
    fontSize: 19,
    color: "#64dd17",
    fontWeight: "bold"
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#fff",
    width: 270,
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
