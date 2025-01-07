import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Certifique-se de configurar corretamente o firebaseConfig.js
import axios from 'axios';


// Função para enviar mensagem via Telegram Bot
const sendMessage = async (message) => {
    const botToken = '7644113264:AAFfMy4LfbS9yah49uIWL8DxPNoO157JKog';  // Substitua com o token do seu bot
    const chatId = '6895431032';         // Substitua com o chat_id do administrador ou grupo
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`;

    try {
        const response = await axios.get(url);
        const data = await response.data; // Use response.data para pegar o conteúdo da resposta
        if (data.ok) {
            console.log("Mensagem enviada com sucesso!");
        } else {
            console.error("Erro ao enviar a mensagem", data);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        Alert.alert("Erro na requisição para o Telegram!");
    }
};

// Componente principal para agendar o corte e enviar a mensagem
export default function TelaDetalhesProduto({ route }) {
    const { nome, preco, descricao, imageUrl } = route.params;
    const [dia, setDia] = useState('');
    const [hora, setHora] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [erroDia, setErroDia] = useState('');
    const [erroHora, setErroHora] = useState('');
     const [telefoneUsuario, setTelefoneUsuario] = useState('');


    const validarDia = (dia) => /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(dia);
    const validarHora = (hora) => /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/.test(hora);


    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, 'Usuarios', user.uid);
                try {
                    const docSnap = await getDoc(userRef);
                    if (docSnap.exists()) {
                        setTelefoneUsuario(docSnap.data().numero);
                    } else {
                        setTelefoneUsuario("Não fornecido");
                    }
                 } catch (error) {
                    console.error("Erro ao pegar o número:", error);
                    setTelefoneUsuario('Erro ao pegar o número');
               }
          }
       };
          fetchUserData();
    }, []);



    const handleAgendar = async () => {
        setErroDia('');
        setErroHora('');

        if (validarDia(dia) && validarHora(hora)) {
            setMensagem(`Produto agendado para: ${dia} às ${hora}`);

            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (user) {
                     await addDoc(collection(db, 'Agendamentos'), {
                        nomeCorte: nome,
                        emailUsuario: user.email,
                        dia,
                       hora,
                        preco,
                         userId: user.uid,
                        telefoneUsuario: telefoneUsuario,
                     });

                     // Gera a mensagem para o Telegram
                    const mensagemTelegram = `Novo agendamento realizado!%0ACliente: ${user.email}%0ACorte: ${nome}%0ADia: ${dia}%0AHora: ${hora} min%0APreço: ${preco} Meticais%0ANumero do Cliente: ${telefoneUsuario}`;
                     // Envia a mensagem para o administrador via Telegram
                    await sendMessage(mensagemTelegram);
                     setMensagem('Agendamento realizado com sucesso! '+ user.email);
                } else {
                    setMensagem('Usuário não autenticado');
                }
            } catch (error) {
                console.error('Erro ao agendar:', error);
                 setMensagem('Erro ao agendar o corte');
           }
        } else {
            if (!validarDia(dia)) {
                 setErroDia('Por favor, insira uma data válida (DD/MM/AAAA).');
           }
           if (!validarHora(hora)) {
               setErroHora('Por favor, insira uma hora válida (HH:MM).');
           }
            setMensagem('');
        }
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: imageUrl }} style={styles.imagemProduto} />
            <Text style={styles.nomeProduto}>{nome}</Text>
            <Text style={styles.precoProduto}>{preco}</Text>
            <Text style={styles.descricaoProduto}>{descricao}</Text>

            <TextInput
                style={styles.input}
                placeholder="Digite o dia (ex: 25/12/2024)"
                placeholderTextColor="#aaa"
                value={dia}
                onChangeText={setDia}
            />
            {erroDia ? <Text style={styles.erro}>{erroDia}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Digite a hora (ex: 14:00)"
                placeholderTextColor="#aaa"
                value={hora}
                onChangeText={setHora}
            />
            {erroHora ? <Text style={styles.erro}>{erroHora}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleAgendar}>
                <Text style={styles.buttonText}>Agendar</Text>
            </TouchableOpacity>

            {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#000',
    },
    imagemProduto: {
        width: '100%',
        height: 250,
        borderRadius: 15,
        marginBottom: 20,
        resizeMode: 'cover',
    },
    nomeProduto: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#0f0',
        marginBottom: 10,
        textAlign: 'center',
    },
    precoProduto: {
        fontSize: 22,
        color: '#0f0',
        fontWeight: '600',
        marginBottom: 10,
        textAlign: 'center',
    },
    descricaoProduto: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        marginTop: 10,
        padding: 15,
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        fontSize: 16,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#0f0',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#0f0',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        width: 220,
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 2,
    },
    textoBotao: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    mensagem: {
        marginTop: 20,
        fontSize: 18,
        color: '#0f0',
        textAlign: 'center',
    },
    erro: {
        marginTop: 5,
        fontSize: 14,
        color: '#e74c3c',
    },
});