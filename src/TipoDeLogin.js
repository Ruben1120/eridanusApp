import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
class TipoDeLogin extends Component{
  static navigationOptions = {
    header: null
  }
  render(){
    return(
      <View style={Styles.container}>
       <Image style={{width: 220, height: 80, resizeMode: "stretch", marginBottom: 90}}source={require("./imagens/logo.png")}/>
       <TouchableOpacity style={Styles.button} onPress={() => { this.props.navigation.navigate("LoginUsuario")} }>
        <Text style={Styles.textButton}>Entrar</Text>
       </TouchableOpacity> 
       <TouchableOpacity style={Styles.button} onPress={() => { this.props.navigation.navigate("Cadastrar")} }>
        <Text style={Styles.textButton}>Cadastrar</Text>
       </TouchableOpacity>
       <TouchableOpacity style={Styles.button} onPress={() => { this.props.navigation.navigate("SaibaMais")} }>
        <Text style={Styles.textButton}>Saiba Mais</Text>
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
      backgroundColor: "#fff"
    },
    button: {
      width: 200,
      height: 70,
      backgroundColor: "#64dd17",
      padding: 6,
      borderRadius: 4,
      margin: 10,
      alignItems: "center",
      justifyContent: "center"
    },
    textButton: {
      fontSize: 17,
      color: "#fff",
      fontWeight: "bold"
    }
  });

export default TipoDeLogin;
