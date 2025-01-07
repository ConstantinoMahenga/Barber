import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,
    ScrollView
} from 'react-native';
import BarraNavegacao from './componentenavegacao';
import { getAuth, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function TelaAgendamentos() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchAgendamentos = async () => {
            setLoading(true);
            try {
                // Buscando todos os agendamentos
                const agendamentosSnapshot = await getDocs(collection(db, 'Agendamentos'));

                const agendamentosList = agendamentosSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAgendamentos(agendamentosList);
            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
                setAgendamentos([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAgendamentos();
    }, []);

   const renderItem = ({ item }) => (
      <ScrollView horizontal={true} style={estilos.linhaTabelaScroll}>
         <View style={estilos.linhaTabela}>
          <Text style={[estilos.textoTabela, estilos.celula, { flex: 2 }]} numberOfLines={1}>{item.emailUsuario}</Text>
            <Text style={[estilos.textoTabela, estilos.celula, { flex: 2 }]} numberOfLines={1}>{item.nomeCorte}</Text>
            <Text style={[estilos.textoTabela, estilos.celula, { flex: 1 }]}>{item.dia}</Text>
            <Text style={[estilos.textoTabela, estilos.celula, { flex: 1 }]}>{item.hora}</Text>
           <Text style={[estilos.textoTabela, estilos.celula, { flex: 1 }]}>{item.telefoneUsuario}</Text>
         </View>
        </ScrollView>
    );

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
                <Text style={estilos.loadingText}>Carregando informações...</Text>
            </View>
        );
    }

    return (
        <View style={estilos.container}>
            <BarraNavegacao />
            <View style={estilos.conteudo}>
                <Text style={estilos.titulo}>Agendamentos</Text>

                {/* Tabela de agendamentos */}
                <Text style={estilos.subTitulo}>Cliente e pedido</Text>

                <View style={estilos.tabelaContainer}>
                   <View style={estilos.linhaTabela}>
                       <Text style={[estilos.textoTabela, estilos.celula, { flex: 2 }]}>Email</Text>
                       <Text style={[estilos.textoTabela, estilos.celula, { flex: 2 }]}>Corte</Text>
                        <Text style={[estilos.textoTabela, estilos.celula, { flex: 1 }]}>Dia</Text>
                       <Text style={[estilos.textoTabela, estilos.celula, { flex: 1 }]}>Hora</Text>
                       <Text style={[estilos.textoTabela, estilos.celula, { flex: 1 }]}>Preço</Text>
                        <Text style={[estilos.textoTabela, estilos.celula, { flex: 1 }]}>Número</Text>
                   </View>
                    <FlatList
                        data={agendamentos}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                         style={estilos.tabela}
                    />
               </View>
                <TouchableOpacity style={estilos.botaoLogout} onPress={handleLogout}>
                    <Text style={estilos.textoBotaoLogout}>Sair</Text>
                 </TouchableOpacity>
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    conteudo: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        padding: 15,
    },
    titulo: {
        fontSize: 20,
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
   tabelaContainer:{
      flex:1,
 },
    tabela: {
        width: '100%',
    },
    linhaTabela: {
      flexDirection: 'row',
      paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
   },
   textoTabela: {
      fontSize: 13,
       color: '#333',
      textAlign: 'center',
        paddingHorizontal: 5,
  },
    celula: {
        borderLeftWidth: 1,
       borderLeftColor: '#ddd',
    },
   botaoLogout: {
     backgroundColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 20,
      borderRadius: 8,
       width: 70,
        marginTop: 20,
       alignSelf: 'center',
    },
   textoBotaoLogout: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
    },
   subTitulo: {
        fontSize: 18,
      fontWeight: 'bold',
        marginBottom: 15,
      color: '#333',
       letterSpacing: 0.5,
      textAlign: 'center'
   },
   linhaTabelaScroll:{
     width: '100%',
     flexDirection: 'row',
   }
});