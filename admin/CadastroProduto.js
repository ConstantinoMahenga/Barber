import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';  // Adicionando o Picker
import BarraNavegacao from './componentenavegacao';
const LoadingIndicator = () => (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={styles.loadingText}>Cadastrando...</Text>
    </View>
);

export default function CadastroProduto() {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [selectedOption, setSelectedOption] = useState(''); // "servico" ou "principal"
    const [imageUrls, setImageUrls] = useState({ servico: [], principal: [] }); // Armazenar fotos separadas por tipo
    const [loading, setLoading] = useState(false);

    // Função para escolher fotos
    const escolherFoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Erro', 'Você precisa permitir o acesso à galeria!');
            return;
        }

        try {
            const pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsMultipleSelection: true,
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
            });
            if (!pickerResult.canceled && pickerResult.assets) {
                const base64Images = await Promise.all(
                    pickerResult.assets.map(async (asset) => {
                        const manipResult = await manipulateAsync(
                            asset.uri,
                            [],
                            { compress: 0.8, format: SaveFormat.JPEG, base64: true }
                        );
                        return `data:image/jpeg;base64,${manipResult.base64}`;
                    })
                );
                // Atualizar as fotos dependendo da opção selecionada
                setImageUrls((prevUrls) => ({
                    ...prevUrls,
                    [selectedOption]: [...prevUrls[selectedOption], ...base64Images],
                }));
            } else {
                Alert.alert('Erro', 'Nenhuma foto foi selecionada.');
            }
        } catch (error) {
            console.error("Erro ao selecionar fotos", error);
            Alert.alert('Erro ao selecionar fotos', error.message);
        }
    };

    // Função para enviar os dados
    const cadastrarProduto = async () => {
        if (!nome || !descricao || !preco || !selectedOption || !imageUrls[selectedOption].length) {
            Alert.alert('Erro', 'Preencha todos os campos e selecione pelo menos uma foto.');
            return;
        }

        setLoading(true);
        try {
            // Salvar cada imagem como um documento no Firestore
            const promises = imageUrls[selectedOption].map(async (url) => {
                await addDoc(collection(db, "Cortes"), {
                    nome,
                    descricao,
                    preco,
                    categoria: selectedOption === "principal", // true para "principal", false para "servico"
                    imageUrl: url, // Salvar uma URL por documento
                });
            });

            // Aguarde o salvamento de todas as imagens
            await Promise.all(promises);

            Alert.alert('Corte Cadastrado', `Corte ${nome} cadastrado com sucesso!`);
            setImageUrls({ servico: [], principal: [] }); // Limpar as fotos após o envio
            setPreco('');
            setDescricao('');
            setNome('');
            setSelectedOption(''); // Resetando a opção selecionada
        } catch (error) {
            Alert.alert('Erro ao cadastrar o corte', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Cadastro de Corte</Text>
            <BarraNavegacao/>
            <View style={styles.inputContainer}>
                <FontAwesome name="pencil" size={16} color="#888" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Nome do Corte"
                    value={nome}
                    onChangeText={setNome}
                    placeholderTextColor="#aaa"
                />
            </View>

            <View style={styles.inputContainer}>
                <FontAwesome name="file-text" size={16} color="#888" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Descrição do Corte"
                    value={descricao}
                    onChangeText={setDescricao}
                    placeholderTextColor="#aaa"
                    multiline
                />
            </View>

            <View style={styles.inputContainer}>
                <FontAwesome name="money" size={16} color="#888" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Preço"
                    keyboardType="numeric"
                    value={preco}
                    onChangeText={setPreco}
                    placeholderTextColor="#aaa"
                />
            </View>

            {/* Dropdown para escolher entre "Serviço" ou "Principal" */}
            <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Selecione o tipo de foto</Text>
                <Picker
                    selectedValue={selectedOption}
                    onValueChange={(itemValue) => setSelectedOption(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Selecione" value="" />
                    <Picker.Item label="Serviço" value="servico" />
                    <Picker.Item label="Corte Principal" value="principal" />
                </Picker>
            </View>

            {/* Botão para selecionar fotos */}
            <TouchableOpacity style={styles.selectButton} onPress={escolherFoto}>
                <Text style={styles.selectButtonText}>Selecionar Fotos</Text>
            </TouchableOpacity>

            <View style={styles.fotoContainer}>
                {selectedOption && imageUrls[selectedOption].length > 0 ? (
                    imageUrls[selectedOption].map((url, index) => (
                        <Image key={index} source={{ uri: url }} style={styles.foto} />
                    ))
                ) : (
                    <Text style={styles.noFotos}>Nenhuma foto selecionada</Text>
                )}
            </View>

            <TouchableOpacity style={styles.cadastrarButton} onPress={cadastrarProduto} disabled={loading}>
                <Text style={styles.cadastrarButtonText}>Cadastrar</Text>
            </TouchableOpacity>

            {loading && <LoadingIndicator />}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
    loadingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    loadingText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#28a745',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
        paddingLeft: 10,
    },
    inputIcon: {
        marginRight: 10,
        color: '#888',
    },
    selectButton: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    selectButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fotoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        marginBottom: 20,
    },
    foto: {
        width: 80,
        height: 80,
        marginRight: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
    noFotos: {
        color: 'gray',
        fontStyle: 'italic',
    },
    cadastrarButton: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    cadastrarButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dropdownContainer: {
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    dropdownLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    picker: {
        height: 50,
    },
});
