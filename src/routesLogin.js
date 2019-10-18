import {createAppContainer, createStackNavigator} from "react-navigation";

import TipoDeLogin from "./TipoDeLogin";
import LoginUsuario from "./LoginUsuario";
import Cadastrar from "./Cadastrar";
import SaibaMais from "./SaibaMais";
export default createAppContainer(
    createStackNavigator({
        TipoDeLogin,
        LoginUsuario,
        Cadastrar,
        SaibaMais
    })
);