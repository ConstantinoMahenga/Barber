import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TelaInicial from './telas/TelaInicial';
import TelaLogin from './telas/login';
import TelaCadastro from './telas/cadastro';
import TelaMinhaConta from './telas/minhaconta';
import TelaProdutos from './telas/servico';
import TelaPrincipal from './principal';
import { View, StyleSheet } from 'react-native';
import ProdutoDetalhes from './telas/descricao';
import CadastroProduto from './admin/CadastroProduto';
import Telacortes from './admin/cortes';
import TelaClientes from './admin/clientes';
import TelaRecuperarSenha from './telas/RecuperarSenha';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={estilos.container}>
        <Stack.Navigator
          initialRouteName="TelaInicial"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="TelaInicial" component={TelaInicial} />
          <Stack.Screen name="TelaLogin" component={TelaLogin} />
          <Stack.Screen name="TelaCadastro" component={TelaCadastro} />
          <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} />
          <Stack.Screen name="Produtos" component={TelaProdutos} />
          <Stack.Screen name="Minha Conta" component={TelaMinhaConta} />
          <Stack.Screen name="ProdutoDetalhes" component={ProdutoDetalhes} />
          <Stack.Screen name="RecuperarSenha" component={TelaRecuperarSenha} />

                            {/* Adminstr */}
          <Stack.Screen name="CadastroProduto" component={CadastroProduto}/>
          <Stack.Screen name="VerCortes" component={Telacortes}/>
          <Stack.Screen name="VerClientes" component={TelaClientes}/>

        </Stack.Navigator>
    
      </View>
    </NavigationContainer>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
});
