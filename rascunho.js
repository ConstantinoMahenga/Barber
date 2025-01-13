// Enviar notificacao
// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
// import { getAuth } from 'firebase/auth';
// import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebaseConfig'; // Certifique-se de configurar corretamente o firebaseConfig.js

// export default function TelaDetalhesProduto({ route }) {
//     const { nome, preco, descricao, imageUrl } = route.params;
//     const [dia, setDia] = useState('');
//     const [hora, setHora] = useState('');
//     const [mensagem, setMensagem] = useState('');
//     const [erroDia, setErroDia] = useState('');
//     const [erroHora, setErroHora] = useState('');
//     const [telefoneUsuario, setTelefoneUsuario] = useState('');
//     const [telefoneAdmin, setTelefoneAdmin] = useState(''); // Telefone do administrador

//     const validarDia = (dia) => /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(dia);
//     const validarHora = (hora) => /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/.test(hora);

//     useEffect(() => {
//         const fetchUserData = async () => {
//             const auth = getAuth();
//             const user = auth.currentUser;

//             if (user) {
//                 const userRef = doc(db, 'Usuarios', user.uid);
//                 try {
//                     const docSnap = await getDoc(userRef);
//                     if (docSnap.exists()) {
//                         setTelefoneUsuario(docSnap.data().numero);
//                     } else {
//                         setTelefoneUsuario("Não fornecido");
//                     }
//                 } catch (error) {
//                     console.error("Erro ao pegar o número:", error);
//                     setTelefoneUsuario('Erro ao pegar o número');
//                 }

//                 // Defina o telefone do administrador (pode ser fixo ou buscado do Firestore)
//                 setTelefoneAdmin('258845390745'); // Substitua pelo telefone do administrador
//             }
//         };
//         fetchUserData();
//     }, []);

//     const handleAgendar = async () => {
//         setErroDia('');
//         setErroHora('');

//         if (validarDia(dia) && validarHora(hora)) {
//             setMensagem(`Produto agendado para: ${dia} às ${hora}`);

//             try {
//                 const auth = getAuth();
//                 const user = auth.currentUser;

//                 if (user) {
//                     await addDoc(collection(db, 'Agendamentos'), {
//                         nomeCorte: nome,
//                         emailUsuario: user.email,
//                         dia,
//                         hora,
//                         preco,
//                         userId: user.uid,
//                         telefoneUsuario: telefoneUsuario,
//                     });

//                     // Gera o link para WhatsApp
//                     const mensagemWhatsApp = `Novo agendamento realizado!%0A%0ACliente: ${user.email}%0AProduto: ${nome}%0AData: ${dia}%0AHora: ${hora}%0APreço: ${preco}%0ATelefone do Cliente: ${telefoneUsuario}`;
//                     const urlWhatsApp = `https://wa.me/${telefoneAdmin}?text=${mensagemWhatsApp}`;

//                     // Abre o WhatsApp
//                     Linking.openURL(urlWhatsApp);

//                     setMensagem('Agendamento realizado com sucesso! Notificação enviada para o administrador.');
//                 } else {
//                     setMensagem('Usuário não autenticado');
//                 }
//             } catch (error) {
//                 console.error('Erro ao agendar:', error);
//                 setMensagem('Erro ao agendar o corte');
//             }
//         } else {
//             if (!validarDia(dia)) {
//                 setErroDia('Por favor, insira uma data válida (DD/MM/AAAA).');
//             }
//             if (!validarHora(hora)) {
//                 setErroHora('Por favor, insira uma hora válida (HH:MM).');
//             }
//             setMensagem('');
//         }
//     };

//     return (
//         <View style={estilos.container}>
//             <Image source={{ uri: imageUrl }} style={estilos.imagemProduto} />
//             <Text style={estilos.nomeProduto}>{nome}</Text>
//             <Text style={estilos.precoProduto}>{preco}</Text>
//             <Text style={estilos.descricaoProduto}>{descricao}</Text>

//             <TextInput
//                 style={estilos.input}
//                 placeholder="Digite o dia (ex: 25/12/2024)"
//                 placeholderTextColor="#aaa"
//                 value={dia}
//                 onChangeText={setDia}
//             />
//             {erroDia ? <Text style={estilos.erro}>{erroDia}</Text> : null}

//             <TextInput
//                 style={estilos.input}
//                 placeholder="Digite a hora (ex: 14:00)"
//                 placeholderTextColor="#aaa"
//                 value={hora}
//                 onChangeText={setHora}
//             />
//             {erroHora ? <Text style={estilos.erro}>{erroHora}</Text> : null}

//             <TouchableOpacity style={estilos.botao} onPress={handleAgendar}>
//                 <Text style={estilos.textoBotao}>Agendar</Text>
//             </TouchableOpacity>

//             {mensagem ? <Text style={estilos.mensagem}>{mensagem}</Text> : null}
//         </View>
//     );
// }

// const estilos = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#000',
//     },
//     imagemProduto: {
//         width: '100%',
//         height: 250,
//         borderRadius: 15,
//         marginBottom: 20,
//         resizeMode: 'cover',
//     },
//     nomeProduto: {
//         fontSize: 26,
//         fontWeight: 'bold',
//         color: '#0f0',
//         marginBottom: 10,
//         textAlign: 'center',
//     },
//     precoProduto: {
//         fontSize: 22,
//         color: '#0f0',
//         fontWeight: '600',
//         marginBottom: 10,
//         textAlign: 'center',
//     },
//     descricaoProduto: {
//         fontSize: 16,
//         color: '#ccc',
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     input: {
//         marginTop: 10,
//         padding: 15,
//         backgroundColor: '#1a1a1a',
//         borderRadius: 10,
//         fontSize: 16,
//         color: '#fff',
//         borderWidth: 1,
//         borderColor: '#0f0',
//     },
//     botao: {
//         marginTop: 20,
//         backgroundColor: '#0f0',
//         paddingVertical: 15,
//         borderRadius: 10,
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         width: 220,
//         shadowOpacity: 0.5,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     textoBotao: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#000',
//     },
//     mensagem: {
//         marginTop: 20,
//         fontSize: 18,
//         color: '#0f0',
//         textAlign: 'center',
//     },
//     erro: {
//         marginTop: 5,
//         fontSize: 14,
//         color: '#e74c3c',
//     },
// });

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

// Função para enviar mensagem via Telegram Bot
const sendMessage = async (message) => {
    const botToken = '7644113264:AAFfMy4LfbS9yah49uIWL8DxPNoO157JKog';  // Substitua com o token do seu bot
    const chatId = '6895431032';         // Substitua com o chat_id do administrador ou grupo
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.ok) {
            console.log("Mensagem enviada com sucesso!");
        } else {
            console.error("Erro ao enviar a mensagem", data);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
};

// Componente principal para agendar o corte e enviar a mensagem
export default function Agendamento() {
    const [nome, setNome] = useState('');
    const [dia, setDia] = useState('');
    const [hora, setHora] = useState('');

    const handleAgendar = async () => {
        if (!nome || !dia || !hora) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        // Mensagem a ser enviada ao administrador
        const mensagem = `Novo agendamento: ${nome} agendou o corte para o dia ${dia} às ${hora}.`;

        // Envia a mensagem via Telegram
        await sendMessage(mensagem);
        Alert.alert('Sucesso', 'Agendamento realizado com sucesso!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Agendamento de Corte</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome do Cliente"
                value={nome}
                onChangeText={setNome}
            />
            <TextInput
                style={styles.input}
                placeholder="Dia (DD/MM/AAAA)"
                value={dia}
                onChangeText={setDia}
            />
            <TextInput
                style={styles.input}
                placeholder="Hora (HH:MM)"
                value={hora}
                onChangeText={setHora}
            />

            <TouchableOpacity style={styles.button} onPress={handleAgendar}>
                <Text style={styles.buttonText}>Agendar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f7f7',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});





// principal

// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, FlatList, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from './firebaseConfig';
// import { useNavigation } from '@react-navigation/native';
// import BarraPesquisa from './componentes/pesquisa';
// import BarraNavegacao from './componentes/navegacao';

// const larguraTela = Dimensions.get('window').width;

// // Array de URLs de imagens aleatórias (substitua com suas imagens)
// const carrosselImagens = [
//     'https://th.bing.com/th/id/R.e69de46a916f866383deb43c4a4e2fe2?rik=mVwHsZPmfyJqdA&pid=ImgRaw&r=0',
//     'https://th.bing.com/th/id/OIP.00zDhUdeLfOfbkJs4v9E_wAAAA?rs=1&pid=ImgDetMain',
//     'https://th.bing.com/th/id/R.e69de46a916f866383deb43c4a4e2fe2?rik=mVwHsZPmfyJqdA&pid=ImgRaw&r=0',
//     'https://th.bing.com/th/id/OIP.EvzzVxe1FeVVc-4TVYGDYAHaGb?rs=1&pid=ImgDetMain'
// ];

// export default function ListaProdutos() {
//     const [produtos, setProdutos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [pesquisa, setPesquisa] = useState('');
//     const [produtosFiltrados, setProdutosFiltrados] = useState([]);
//     const navigation = useNavigation();
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const flatListRef = useRef(null);

//     const carregarProdutos = async () => {
//         try {
//             const querySnapshot = await getDocs(collection(db, 'Cortes'));
//             const produtosFirestore = querySnapshot.docs.map((doc) => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));

//             // Filtrando os produtos onde a categoria é true
//             const produtosFiltrados = produtosFirestore.filter(produto => produto.categoria === true);
            
//             setProdutos(produtosFirestore);
//             setProdutosFiltrados(produtosFiltrados);
//         } catch (error) {
//             console.error('Erro ao carregar os produtos:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handlePesquisa = (texto) => {
//         setPesquisa(texto);
        
//         // Filtrando tanto pela pesquisa quanto pela categoria
//         setProdutosFiltrados(
//             texto
//                 ? produtos.filter((produto) =>
//                     produto.nome.toLowerCase().includes(texto.toLowerCase()) && produto.categoria === true
//                 )
//                 : produtos.filter((produto) => produto.categoria === true)
//         );
//     };

//     useEffect(() => {
//         carregarProdutos();
//     }, []);

//     const abrirDetalhesCorte = (id, item) => {
//         navigation.navigate('ProdutoDetalhes', { ...item });
//     };

//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (!flatListRef.current) return;
            
//             const nextIndex = (currentIndex + 1) % carrosselImagens.length;
//             flatListRef.current.scrollToIndex({
//                 index: nextIndex,
//                 animated: true,
//             });
//             setCurrentIndex(nextIndex);
//         }, 3000); // Troca de imagem a cada 3 segundos

//         return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
//     }, [currentIndex, flatListRef]);

//     const renderCarrosselItem = ({ item }) => (
//         <Image source={{ uri: item }} style={styles.carrosselImagem} />
//     );

//     const renderProduto = ({ item }) => (
//         <View style={styles.card} onTouchEnd={() => abrirDetalhesCorte(item.id, item)}>
//             <Image source={{ uri: item.imageUrl }} style={styles.imagem} />
//             <Text style={styles.nome}>{item.nome}</Text>
//             <Text style={styles.preco}>{item.preco} Meticais</Text>
//         </View>
//     );

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#3498db" />
//                 <Text style={styles.loadingText}>Barbearia MaxSD...</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {/* Carrossel de Imagens */}
//             <View style={styles.carrosselContainer}>
//                 <FlatList
//                     ref={flatListRef}
//                     data={carrosselImagens}
//                     renderItem={renderCarrosselItem}
//                     keyExtractor={(item, index) => String(index)}
//                     horizontal
//                     showsHorizontalScrollIndicator={false}
//                     pagingEnabled
//                     getItemLayout={(data, index) => ({
//                         length: larguraTela, // Largura da imagem
//                         offset: larguraTela * index, // Distância até o próximo item
//                         index,
//                     })}
//                     onScrollToIndexFailed={(error) => {
//                         console.log('Erro ao fazer scroll:', error);
//                     }}
//                     onViewableItemsChanged={() => {}}
//                     viewabilityConfig={{
//                         itemVisiblePercentThreshold: 50,
//                     }}
//                 />
//             </View>
//             <View style={styles.barraPesquisaContainer}>
//                 <BarraPesquisa valor={pesquisa} aoAlterarTexto={handlePesquisa} />
//             </View>
//             <FlatList
//                 data={produtosFiltrados}
//                 renderItem={renderProduto}
//                 keyExtractor={(item) => item.id}
//                 numColumns={2}
//                 contentContainerStyle={styles.lista}
//             />
//             <BarraNavegacao />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f8f9fa',
//         padding: 10,
//     },
//     carrosselContainer: {
//         height: 200, // Altura do carrossel
//         marginBottom: 10, // Espaço abaixo do carrossel
//         borderRadius: 30,
//         overflow: 'hidden',
//     },
//     carrosselImagem: {
//         width: larguraTela, // Largura da imagem
//         height: '100%', // Altura da imagem
//         resizeMode: 'cover',
//     },
//     barraPesquisaContainer: {
//         marginTop: 10,
//         paddingHorizontal: 10,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     loadingText: {
//         marginTop: 10,
//         fontSize: 16,
//         color: '#3498db',
//     },
//     lista: {
//         justifyContent: 'center',
//     },
//     card: {
//         flex: 1,
//         margin: 5,
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         padding: 10,
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 2,
//         elevation: 3,
//     },
//     imagem: {
//         width: larguraTela / 2 - 60,
//         height: larguraTela / 2 - 50,
//         borderRadius: 10,
//         marginBottom: 10,
//         resizeMode: 'cover',
//     },
//     nome: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#333',
//         textAlign: 'center',
//     },
//     preco: {
//         fontSize: 14,
//         color: 'green',
//         textAlign: 'center',
//         marginTop: 5,
//     },
// });
// BarberMca-app-pub-4341912579832407~8725570810

// ID do bloco de anúncios do AdMob
// Tenha calmaca-app-pub-4341912579832407/9722694385



// ca-app-pub-4341912579832407~8725570810
// ca-app-pub-4341912579832407/2160162466