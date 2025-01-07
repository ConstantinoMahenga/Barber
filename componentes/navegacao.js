import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BarraNavegacao() {
  const navigation = useNavigation();
  const route = useRoute(); // Obtém a rota atual

  const BotaoNav = ({ tela, icone, texto }) => {
    const ativo = route.name === tela; // Verifica se a tela atual é a mesma do botão

    return (
      <TouchableOpacity
        style={[estilos.botaoNav, ativo && estilos.botaoAtivo]}
        onPress={() => navigation.navigate(tela)}
      >
        {React.cloneElement(icone, { color: ativo ? '#ffffff' : '#28a745' })}
        <Text style={[estilos.textoNav, ativo && estilos.textoAtivo]}>{texto}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={estilos.barraNavegacao}>
      <BotaoNav
        tela="TelaPrincipal"
        icone={<FontAwesome5 name="home" size={20} />}
        texto="Home"
      />
      <BotaoNav
        tela="Produtos"
        icone={<MaterialIcons name="miscellaneous-services" size={20} />}
        texto="Serviços"
      />
      <BotaoNav
        tela="Minha Conta"
        icone={<FontAwesome5 name="user-circle" size={20} />}
        texto="Minha Conta"
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  barraNavegacao: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#f8f8f8',
  },
  botaoNav: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  botaoAtivo: {
    backgroundColor: '#28a745',
  },
  textoNav: {
    fontSize: 10,
    color: '#28a745',
    marginTop: 3,
  },
  textoAtivo: {
    color: '#ffffff',
  },
});
