// ListaProdutos.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import BarraPesquisa from '../componentes/pesquisa';
import BarraNavegacao from '../componentes/navegacao';

const larguraTela = Dimensions.get('window').width;

export default function ListaProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pesquisa, setPesquisa] = useState('');
    const [produtosFiltrados, setProdutosFiltrados] = useState([]);
    const navigation = useNavigation();

    const carregarProdutos = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'Cortes'));
            const produtosFirestore = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProdutos(produtosFirestore);
            setProdutosFiltrados(produtosFirestore);
        } catch (error) {
            console.error('Erro ao carregar os produtos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePesquisa = (texto) => {
        setPesquisa(texto);
        setProdutosFiltrados(
            texto
                ? produtos.filter((produto) =>
                    produto.nome.toLowerCase().includes(texto.toLowerCase())
                )
                : produtos
        );
    };

    useEffect(() => {
        carregarProdutos();
    }, []);

    const abrirDetalhesCorte = (id, item) => {
        navigation.navigate('ProdutoDetalhes', { ...item });
    };

    const renderProduto = ({ item }) => (
        <View style={styles.card} onTouchEnd={() => abrirDetalhesCorte(item.id, item)}>
            <Image source={{ uri: item.imageUrl }} style={styles.imagem} />
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.preco}>{item.preco} Meticais</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Carregando os cortes...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.barraPesquisaContainer}>
                <BarraPesquisa valor={pesquisa} aoAlterarTexto={handlePesquisa} />
            </View>
            <FlatList
                data={produtosFiltrados}
                renderItem={renderProduto}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.lista}
            />
            <BarraNavegacao />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 10,
    },
    barraPesquisaContainer: {
        marginTop: 50,
        paddingHorizontal: 10,
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
    lista: {
        justifyContent: 'center',
    },
    card: {
        flex: 1,
        margin: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    imagem: {
        width: larguraTela / 2 - 20,
        height: larguraTela / 2 - 20,
        borderRadius: 10,
        marginBottom: 10,
        resizeMode: 'cover',
    },
    nome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    preco: {
        fontSize: 14,
        color: 'green',
    },
});




