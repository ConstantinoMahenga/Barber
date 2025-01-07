import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import BarraPesquisa from './componentes/pesquisa';
import BarraNavegacao from './componentes/navegacao';

const larguraTela = Dimensions.get('window').width;

// Array de URLs de imagens aleatórias (substitua com suas imagens)
const carrosselImagens = [
    'https://th.bing.com/th/id/R.e69de46a916f866383deb43c4a4e2fe2?rik=mVwHsZPmfyJqdA&pid=ImgRaw&r=0',
    'https://th.bing.com/th/id/OIP.00zDhUdeLfOfbkJs4v9E_wAAAA?rs=1&pid=ImgDetMain',
    'https://th.bing.com/th/id/R.e69de46a916f866383deb43c4a4e2fe2?rik=mVwHsZPmfyJqdA&pid=ImgRaw&r=0',
    'https://th.bing.com/th/id/OIP.EvzzVxe1FeVVc-4TVYGDYAHaGb?rs=1&pid=ImgDetMain'
];

export default function ListaProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pesquisa, setPesquisa] = useState('');
    const [produtosFiltrados, setProdutosFiltrados] = useState([]);
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const carregarProdutos = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'Cortes'));
            const produtosFirestore = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Filtrando os produtos onde a categoria é true
            const produtosFiltrados = produtosFirestore.filter(produto => produto.categoria === true);
            
            setProdutos(produtosFirestore);
            setProdutosFiltrados(produtosFiltrados);
        } catch (error) {
            console.error('Erro ao carregar os produtos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePesquisa = (texto) => {
        setPesquisa(texto);
        
        // Filtrando tanto pela pesquisa quanto pela categoria
        setProdutosFiltrados(
            texto
                ? produtos.filter((produto) =>
                    produto.nome.toLowerCase().includes(texto.toLowerCase()) && produto.categoria === true
                )
                : produtos.filter((produto) => produto.categoria === true)
        );
    };

    useEffect(() => {
        carregarProdutos();
    }, []);

    const abrirDetalhesCorte = (id, item) => {
        navigation.navigate('ProdutoDetalhes', { ...item });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!flatListRef.current) return;
            
            const nextIndex = (currentIndex + 1) % carrosselImagens.length;
            flatListRef.current.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
            setCurrentIndex(nextIndex);
        }, 3000); // Troca de imagem a cada 3 segundos

        return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
    }, [currentIndex, flatListRef]);

    const renderCarrosselItem = ({ item }) => (
        <Image source={{ uri: item }} style={styles.carrosselImagem} />
    );

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
                <Text style={styles.loadingText}>Barbearia MaxSD...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Carrossel de Imagens */}
            <View style={styles.carrosselContainer}>
                <FlatList
                    ref={flatListRef}
                    data={carrosselImagens}
                    renderItem={renderCarrosselItem}
                    keyExtractor={(item, index) => String(index)}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    getItemLayout={(data, index) => ({
                        length: larguraTela, // Largura da imagem
                        offset: larguraTela * index, // Distância até o próximo item
                        index,
                    })}
                    onScrollToIndexFailed={(error) => {
                        console.log('Erro ao fazer scroll:', error);
                    }}
                    onViewableItemsChanged={() => {}}
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 50,
                    }}
                />
            </View>
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
    carrosselContainer: {
        height: 200, // Altura do carrossel
        marginBottom: 10, // Espaço abaixo do carrossel
        borderRadius: 30,
        overflow: 'hidden',
    },
    carrosselImagem: {
        width: larguraTela, // Largura da imagem
        height: '100%', // Altura da imagem
        resizeMode: 'cover',
    },
    barraPesquisaContainer: {
        marginTop: 10,
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
        width: larguraTela / 2 - 60,
        height: larguraTela / 2 - 50,
        borderRadius: 10,
        marginBottom: 10,
        resizeMode: 'cover',
    },
    nome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    preco: {
        fontSize: 14,
        color: 'green',
        textAlign: 'center',
        marginTop: 5,
    },
});
