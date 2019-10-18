import {createAppContainer, createDrawerNavigator, DrawerItems} from "react-navigation";
import React from "react";
import { ScrollView, SafeAreaView, Image} from "react-native";

import Inicio from "./Inicio";
import Projetos from "./Pojetos";
import Objetos from "./Objetos";
import MeusProjetos from "./MeusProjetos";
import MeusObjetos from "./MeusObjetos";
import Descarte from "./Descarte";
import Sair from "./Sair";
const componenteDrawer = props => (
  <ScrollView>
    <SafeAreaView>
      <Image style={{width: 170, height: 50, resizeMode: "stretch", margin: 30}}source={require("./imagens/logo.png")}/>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

export default createAppContainer(
    createDrawerNavigator({
        Inicio,
        Projetos,
        Objetos,
        "Meus Projetos": MeusProjetos,
        "Meus Objetos": MeusObjetos,
        Descarte,
        Sair
    },
    {
      contentComponent: componenteDrawer,
      drawerBackgroundColor: 'rgba(255,255,255,.9)',
      overlayColor: '#64dd17',
      contentOptions: {
        activeTintColor: '#fff',
        activeBackgroundColor: '#64dd17',
      },
    }
    )
)