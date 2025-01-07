import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Certifique-se de que o arquivo está configurado corretamente

export default function TelaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigation = useNavigation(); // Hook para acessar o objeto de navegação

  const handleLogin = async () => {
    if (email=='admin' && senha=='admin') {
        navigation.navigate('CadastroProduto');
       
    } else {
      try {
        // Faz o login no Firebase
        await signInWithEmailAndPassword(auth, email, senha);
     
      
        // Navegar para a TelaProdutos após o login
        navigation.navigate('TelaPrincipal');
      } catch (error) {
     
        Alert.alert('Erro', 'Email ou senha inválidos.');
      }
    };
    
    }
    
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/logo.png')} // Certifique-se de que o arquivo logo.png existe nesse caminho
        style={styles.logo}
      />

      {/* Título */}
      <Text style={styles.title}>Bem-vindo de volta!</Text>

      {/* Formulário de Login */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <FontAwesome name="user" size={20} color="#fff" style={styles.inputIcon} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputWrapper}>
          <FontAwesome name="lock" size={20} color="#fff" style={styles.inputIcon} />
          <TextInput
            placeholder="Senha"
            secureTextEntry
            placeholderTextColor="#aaa"
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
          />
        </View>
      </View>

      {/* Botão de login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      
      {/* Links para recuperar */}
<View style={styles.linksContainer}>
  <TouchableOpacity onPress={() => navigation.navigate('RecuperarSenha')}>
    <Text style={styles.link}>Esqueceu a senha?</Text>
  </TouchableOpacity>
</View>

      <Text style={styles.socialText}>Entrar com:</Text>
      {/* Entrar com */}
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1c1c1c', // Fundo preto
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#28a745', // Cor verde
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#28a745', // Cor verde
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#333',
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    paddingLeft: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#28a745', // Cor verde
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  link: {
    color: '#28a745', // Cor verde
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  socialText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  socialButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 10,
  },
});
