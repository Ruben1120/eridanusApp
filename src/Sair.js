import React, { Component } from 'react';

import { View, Text, Alert, TouchableOpacity} from 'react-native';
import RNRestart from "react-native-restart";
import {Icon} from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
export default class Sair extends Component {
    static navigationOptions = {
        drawerIcon: ({tintColor}) => (
          <Icon name="power" style={{fontSize: 24 , color: tintColor}}/>
        )
    }
    sair = async () => {
        await AsyncStorage.removeItem("userid");
        RNRestart.Restart();
    }
    componentDidMount(){
        Alert.alert(
            "Deseja realmente sair?",
            "",
            [
                {
                text: 'Não',
                onPress: () => this.props.navigation.navigate("Inicio"),
                style: 'cancel',
                },
                {text: 'Sim', onPress: this.sair.bind(this)},
            ],
            {cancelable: false},
        );
    }
    render() {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fafafa"}}>
                <TouchableOpacity onPress={this.componentDidMount.bind(this)} style={{width: 200, height: 70,backgroundColor: "#ec2300",padding: 6,borderRadius: 4,margin: 10,alignItems: "center",justifyContent: "center",marginTop: 19}}>
                    <Text style={{fontSize: 19, color: "#fff", fontWeight: "bold"}}>Sair</Text>
                </TouchableOpacity>
            </View>
        );
  }
}
