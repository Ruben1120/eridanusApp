import React, { Component } from 'react';

import { ScrollView,  StyleSheet, Text} from 'react-native';

export default class SaibaMais extends Component {
    static navigationOptions = {
        title: "Saiba Mais"
    }
    render() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.titulo}>O que é o Eridanus?</Text>
            <Text style={styles.texto}>O Eridanus tem por finalidade ajudar o usuário a gerenciar seu lixo eletrônico, expondo projetos feitos pelo administradores ou pelos usuários da aplicação para que outros usuários possam fazê-los com os objetos que seriam jogados no lixo, e também mostrando qual o local que possui lixeiras apropriadas para do descarte de resíduos eletrônicos específicos se o material não poder ser reciclado. </Text>
            <Text style={styles.titulo}>O que é um projeto?</Text>
            <Text style={styles.texto}>Um projeto é um exemplo de como um ou mais tipos de lixos eletrônicos podem ser reciclados e transformados em coisas que podem ser uteis, ele contem titulo, descrição, imagem, materiais e um video explicativo opcional.</Text>
            <Text style={styles.titulo}>O que é um objeto?</Text>
            <Text style={styles.texto}>O objeto pode ser um qualquer aparelho eletroeletrônico ou parte dele que não tem mais utilidade para um usuário que pode ser de serventia de outro, onde no aplicativo é possível colocá-lo a amostra para que seja possível que haja uma troca, venda ou doação desse objeto.</Text>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#ddd",
    },
    titulo: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: "bold",
    },
    texto: {
        fontSize: 17,
        marginBottom: 20,
    }
});