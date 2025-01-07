import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

export default function TelaInicial({ navigation }) {  // Recebe a prop navigation
  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGJhcmJlcnxlbnwwfHx8fDE2OTMwMzEwNjA&ixlib=rb-4.0.3&q=80&w=1080', // Nova imagem relacionada à barbearia
      }}
      style={estilos.container}
    >
      <View style={estilos.overlay}>
        <Text style={estilos.textoTitulo}>Bem-vindo à Barbearia     Max SD</Text>
        <Text style={estilos.textoSubtitulo}>Seu estilo, nosso compromisso</Text>

        <TouchableOpacity
          style={estilos.botaoCriarConta}
          onPress={() => navigation.navigate('TelaLogin')} // Navega para TelaLogin
        >
          <Text style={estilos.textoBotaoCriarConta}>Fazer Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilos.botaoFazerLogin}
          onPress={() => navigation.navigate('TelaCadastro')} // Navega para TelaCadastro
        >
          <Text style={estilos.textoBotaoFazerLogin}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}


const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Efeito de escurecimento no fundo
  },
  textoTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  textoSubtitulo: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 30,
    textAlign: 'center',
  },
  botaoCriarConta: {
    width: '85%',
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  textoBotaoCriarConta: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoFazerLogin: {
    width: '85%',
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#28a745',
  },
  textoBotaoFazerLogin: {
    color: '#28a745',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


