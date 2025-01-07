import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BarraNavegacao from './componentenavegacao';
import { getAuth, signOut } from 'firebase/auth';
import { collection, getDocs, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function Telacortes() {
  const [cortes, setCortes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCortes = async () => {
      setLoading(true);
      try {
        const cortesQuery = query(collection(db, 'Cortes'));
        const cortesSnapshot = await getDocs(cortesQuery);
        let cortesList = cortesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCortes(cortesList);
      } catch (error) {
        console.error('Erro ao buscar cortes:', error);
        setCortes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCortes();
  }, []);

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmação',
      'Deseja realmente excluir este corte?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'Cortes', id));
              setCortes((prev) => prev.filter((corte) => corte.id !== id));
              Alert.alert('Sucesso', 'Corte excluído com sucesso.');
            } catch (error) {
              console.error('Erro ao excluir corte:', error);
              Alert.alert('Erro', 'Não foi possível excluir o corte.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      BackHandler.exitApp();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return (
      <View style={estilos.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={estilos.loadingText}>Carregando os cortes...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={estilos.linhaTabela}>
      <Text style={[estilos.textoTabela, estilos.celula, { flex: 2 }]}>{item.nome}</Text>
      <Text style={[estilos.textoTabela, estilos.celula, { flex: 2 }]}>{item.descricao}</Text>
      <Text style={[estilos.textoTabela, estilos.celula, { flex: 1 }]}>{item.preco} Mt</Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Icon name="trash-can" size={20} color="red" style={estilos.iconeLixo} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require('../assets/favic.png')}
      style={estilos.container}
      imageStyle={estilos.imagemFundo}
    >
      <SafeAreaView style={estilos.conteudo}>
        <Text style={estilos.titulo}>Cortes</Text>
        <BarraNavegacao />
        <Text style={estilos.subTitulo}>Cortes Cadastrados</Text>

        <View style={estilos.linhaTabela}>
          <Text style={[estilos.textoTabela, estilos.celula, { flex: 2 }]}>Corte</Text>
          <Text style={[estilos.textoTabela, estilos.celula, { flex: 2 }]}>Descrição</Text>
          <Text style={[estilos.textoTabela, estilos.celula, { flex: 1 }]}>Preço</Text>
          <Text style={estilos.textoTabela}>Apagar</Text>
        </View>

        <FlatList
          data={cortes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={estilos.tabela}
        />

        <TouchableOpacity style={estilos.botaoLogout} onPress={handleLogout}>
          <Text style={estilos.textoBotaoLogout}>Sair</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  imagemFundo: {
    opacity: 0.3,
  },
  conteudo: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 15,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007bff',
    letterSpacing: 0.8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#3498db',
  },
  subTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  tabela: {
    marginTop: 10,
    width: '100%',
  },
  linhaTabela: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  textoTabela: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  celula: {
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
  iconeLixo: {
    padding: 5,
  },
  botaoLogout: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  textoBotaoLogout: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
