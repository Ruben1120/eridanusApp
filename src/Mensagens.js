import React, { Component } from 'react';

import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList} from 'react-native';
import {BarIndicator} from "react-native-indicators";
import AsyncStorage from "@react-native-community/async-storage";
import {Icon, Header} from "native-base";
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
        dados: [{key: 0, nome: "Teste", destinatario: "Teste"}],
        destinatario: null,
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
            // this.setState({dados: response.data});
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
          if(this.state.destinatario == null){
            return(
                <View style={{flex: 1}}>
                  <Header style={{backgroundColor: "#64dd17", width: 400}}>
                        <Icon onPress={() => {this.props.navigation.openDrawer()}} name="menu" style={{marginTop: 14, marginRight: 96, color: "#fff"}}/>
                        <Text style={{color: "#fff", fontWeight: "bold", marginTop: 14, fontSize: 20, marginRight: 158}}>Mensagens</Text>
                  </Header>
                  <View style={estilos.container}>
                    <View style={{padding: 20, flex: 6, width: "100%"}}>
                    <FlatList
                        data={this.state.dados}
                        keyExtractor={(item) => item.key.toString()}
                        renderItem={({item}) => { 
                            return(
                                    <TouchableOpacity style={{flexDirection: "row", alignItems: "center",height: 80,borderBottomWidth: StyleSheet.hairlineWidth, borderTopWidth: StyleSheet.hairlineWidth}}>          
                                        <View style={{width: 60, marginRight: 10,height: 60,backgroundColor: "red", borderRadius: 100}}/>
                                        <View>
                                            <Text style={{fontWeight: "bold", fontSize: 19}}>{item.nome}</Text>
                                            <Text style={{ fontSize: 19}}>{item.destinatario}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ); 
                            }
                        }
                    />
                    </View>
                  </View>
                </View>
              );
          }else{
            return(
                <View style={{flex: 1}}>
                  <Header style={{backgroundColor: "#64dd17", width: 400}}>
                    <Icon onPress={() => {this.props.navigation.openDrawer()}} name="menu" style={{marginTop: 14, marginRight: 330, color: "#fff"}}/>
                  </Header>
                  <View style={estilos.container}>
                    <View style={{backgroundColor: "green", flex: 1, width: "100%"}}>
    
                    </View>
                    <View style={{padding: 20, flex: 6, width: "100%"}}>
                    <FlatList
                                data={this.state.dados}
                                keyExtractor={(item) => item.key.toString()}
                                renderItem={({item}) => { 
                                    return(
                                            <View style={{}}>
                                            
                                            </View>
                                        ); 
                                    }
                                }
                            />
                    </View>
                    <View style={{backgroundColor: "red", flex: 1, width: "100%"}}>
    
                    </View>
                  </View>
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
    }
});