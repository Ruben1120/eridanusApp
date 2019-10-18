import React, { Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Routes from "./routesLogin";
import Rota from "./routes";
import { View } from "react-native";
import { BarIndicator } from "react-native-indicators";
export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      id: null,
      loading: true
    }
  }
  async componentDidMount(){
    AsyncStorage.getItem("userid").then(id => {
      console.log(id)
      this.setState({id: id, loading: false});
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
      if(this.state.id){
        return <Rota/>; 
      }else{
        return <Routes />;
      }
    }
  }
}
