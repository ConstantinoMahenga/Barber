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
  BackHandler,
} from 'react-native';
import BarraNavegacao from '../componentes/navegacao';
import { getAuth, signOut } from 'firebase/auth';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function TelaMinhaConta() {
    const [usuario, setUsuario] = useState(null);
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
   const navigation = useNavigation(); // Inicialize useNavigation

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                try {
                    // Buscando dados do usuário (email e número)
                    setEmail(user.email);
                    const userRef = doc(db, 'Usuarios', user.uid);
                    const docSnap = await getDoc(userRef);
                    if (docSnap.exists()) {
                        setUsuario(docSnap.data());
                    }

                    // Buscando cortes agendados
                    const comprasQuery = query(collection(db, 'Agendamentos'), where('userId', '==', user.uid));
                    const comprasSnapshot = await getDocs(comprasQuery);

                    let comprasList = comprasSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                  // Ordenando por data
                 comprasList.sort((a, b) => {
                      const dateA = parseDate(a.dia);
                      const dateB = parseDate(b.dia);
                      return dateA - dateB;
                   });

                   setCompras(comprasList);
                } catch (error) {
                    console.error('Erro ao buscar dados:', error);
                    setUsuario(null);
                    setCompras([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setUsuario(null);
                setCompras([]);
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);
    // Funcao para converter a data em um timestamp
    const parseDate = (dateString) => {
       const [day, month, year] = dateString.split('/');
       return new Date(`${year}-${month}-${day}`).getTime();
   };


    const renderItem = ({ item }) => (
        <View style={estilos.linhaTabela}>
            <Text style={[estilos.textoTabela, estilos.celula, { flex: 2 }]}>{item.nomeCorte}</Text>
            <Text style={[estilos.textoTabela, estilos.celula, { flex: 1 }]}>{item.dia}</Text>
            <Text style={[estilos.textoTabela, estilos.celula, { flex: 1 }]}>{item.hora}</Text>
            <Text style={[estilos.textoTabela, estilos.celula, { flex: 1 }]}>{item.preco}</Text>
        </View>
    );

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
           //Fecha o app por completo
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
        <ImageBackground
            source={require('../assets/favic.png')}
            style={estilos.container}
            imageStyle={estilos.imagemFundo}
        >
            <SafeAreaView style={estilos.conteudo}>
                <Text style={estilos.titulo}>Minha Conta</Text>

                {/* Informações do usuário */}
                {usuario ? (
                    <View style={estilos.usuarioInfo}>
                        <Text style={estilos.textoUsuario}>Email: {email}</Text>
                        <Text style={estilos.textoUsuario}>Número: {usuario.numero}</Text>
                    </View>
                ) : (
                    <Text style={estilos.textoUsuario}>Usuário não autenticado</Text>
                )}

                {/* Tabela de cortes */}
                <Text style={estilos.subTitulo}>Cortes Agendados</Text>

                <View style={estilos.linhaTabela}>
                    <Text style={[estilos.textoTabela, estilos.celula, { flex: 2 }]}>Corte</Text>
                    <Text style={[estilos.textoTabela, estilos.celula, { flex: 1 }]}>Dia</Text>
                    <Text style={[estilos.textoTabela, estilos.celula, { flex: 1 }]}>Hora</Text>
                    <Text style={[estilos.textoTabela, estilos.celula, { flex: 1 }]}>Preço</Text>
                </View>

                <FlatList
                    data={compras}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    style={estilos.tabela}
                />
                   <TouchableOpacity style={estilos.botaoLogout} onPress={handleLogout}>
                    <Text style={estilos.textoBotaoLogout}>Sair</Text>
                   </TouchableOpacity>
            </SafeAreaView>
            <BarraNavegacao />
        </ImageBackground>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
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
    usuarioInfo: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    textoUsuario: {
        fontSize: 15,
        color: '#333',
        marginBottom: 5,
    },
    subTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        letterSpacing: 0.5,
         textAlign: 'center'
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
        alignItems: 'center'
    },
    textoTabela: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
         paddingHorizontal: 10,

    },
    celula: {
        borderLeftWidth: 1,
        borderLeftColor: '#ddd',
    },
     botaoLogoutContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    botaoLogout: {
      marginTop: 20,
      backgroundColor: 'black',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 3,
      width:50,
      marginInlineStart: 0, // Remove qualquer margem à esquerda
      marginInlineEnd: 0, // Remove qualquer margem à direita
      alignSelf: 'center',
      
      },
    textoBotaoLogout: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
    },
});