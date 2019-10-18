import React, { Component } from 'react';

import { View, StyleSheet, Text } from 'react-native';
import MapView from 'react-native-maps';
import {Dropdown} from "react-native-material-dropdown";
import {Icon, Header} from "native-base";

export default class Descarte extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [{value: "Pilha ou bateria"}, {value: "Monitor"}, {value: "Gabinete"}, {value: "Placa Mãe"}]
        } 
    }
    static navigationOptions = {
        drawerIcon: ({tintColor}) => (
          <Icon name="map" style={{fontSize: 24 , color: tintColor}}/>
        )
    }
    render() {
        return (
                <View style={estilos.container}>
                    <Header style={{backgroundColor: "#64dd17", width: 400}}>
                            <Icon onPress={() => {this.props.navigation.openDrawer()}} name="menu" style={{marginTop: 14, marginRight: 60, color: "#fff"}}/>
                            <Text style={{color: "#fff", fontWeight: "bold", marginTop: 14, fontSize: 20, marginRight: 90}}>Locais para Descarte</Text>
                        </Header>
                    <View style={{flex: 2, alignItems: "center", justifyContent:"flex-end",backgroundColor: "#fff"}}>
                    <View style={{width: 300}}>
                        <Dropdown
                            onChangeText={(value) => {
                                console.log(value);
                                if(value == "Pilha ou bateria"){
                                    this.mapView.animateCamera({
                                        center: {
                                            latitude: -8.073638,
                                            longitude: -39.118830
                                        },
                                        zoom: 18
                                    }, 500)
                                }else if(value == "Monitor"){
                                    console.log(value);
                                    this.mapView.animateCamera({
                                        center: {
                                            latitude: -8.057924, 
                                            longitude: -39.094857
                                        },
                                        zoom: 18
                                    }, 500)
                                }else if(value == "Placa Mãe"){
                                    this.mapView.animateCamera({
                                        center: {
                                            latitude: -8.074420, 
                                            longitude: -39.119652
                                        },
                                        zoom: 18
                                    }, 500)
                                }else if(value == "Gabinete"){
                                    this.mapView.animateCamera({
                                        center: {
                                            latitude: -8.057924, 
                                            longitude: -39.094857
                                        },
                                        zoom: 18
                                    }, 500)
                                }
                            }}
                            label='Material para descarte'
                            data={this.state.data}
                        />
                    </View>
                    </View>
                    <View style={{flex: 8}}>
                        <MapView
                            ref={map => this.mapView = map}
                            initialRegion={{
                                latitude: -8.07554603,
                                longitude: -39.12231445,
                                latitudeDelta: 0.0400,
                                longitudeDelta: 0.0200,
                            }}
                            scrollEnabled={false}
                            style={{flex: 1}}
                            rotateEnabled={false}
                        >
                            <MapView.Marker
                                title="Única Ipatinga Polo Salgueiro"
                                description="Ponto de coleta de resíduos eletrônicos."
                                coordinate={{
                                    latitude: -8.074420, 
                                    longitude: -39.119652
                                }}
                            />
                            <MapView.Marker
                                title="Santader"
                                description="Recolhimento de pilhas e baterias."
                                coordinate={{
                                    latitude: -8.073638, 
                                    longitude: -39.118830
                                }}
                            />
                            <MapView.Marker
                                title="Instituto Federal do Sertão Pernambucano - Campus Salgueiro"
                                description="Ponto de coleta de resíduos eletrônicos."
                                coordinate={{
                                    latitude: -8.057924, 
                                    longitude: -39.094857
                                }}
                            />
                        </MapView>
                    </View>
                </View>
            );
    }
}

const estilos = StyleSheet.create({
    container: {
        flex: 1
    }
});