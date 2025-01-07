import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function BarraPesquisa({ valor, aoAlterarTexto }) {
  return (
    <View style={estilos.barraPesquisa}>
      <FontAwesome5 name="search" size={20} color="#666" style={estilos.iconePesquisa} />
      <TextInput
        style={estilos.inputPesquisa}
        placeholder="Pesquisar produtos"
        value={valor}
        onChangeText={aoAlterarTexto}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  barraPesquisa: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  iconePesquisa: {
    marginRight: 10,
  },
  inputPesquisa: {
    backgroundColor: '#f1f3f5',
    padding: 10,
    borderRadius: 20,
    flex: 1,
  },
});
