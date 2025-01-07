import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // Certifique-se de que db está configurado corretamente

export default function TelaCadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [numero, setNumero] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  // Regex para validar o número de telefone
  const telefoneRegex = /^(82|84|86|87|83)\d{7}$/;

  const handleCadastro = async () => {
    // Verificando se todos os campos estão preenchidos
    if (!email || !senha || !confirmarSenha || !numero) {
      Alert.alert("Erro", "Todos os campos devem ser preenchidos.");
      return;
    }

    // Validando o número de telefone com regex
    if (!telefoneRegex.test(numero)) {
      Alert.alert("Erro", "Número inválido. Deve começar com 82, 83, 84, 86 ou 87 e ter 9 dígitos.");
      return;
    }

    // Verificando se as senhas coincidem
    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      // Criando o usuário no Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      Alert.alert("Sucesso", "Usuário criado com sucesso!");


      // Salvando os dados do usuário no Firestore
      await setDoc(doc(db, "Usuarios", userCredential.user.uid), {
        email: userCredential.user.email,
        numero: numero,
      });

     

    } catch (error) {
     
      // Tratando diferentes tipos de erro do Firebase
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Erro", "Este e-mail já está em uso.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Erro", "O e-mail inserido é inválido.");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      } else {
        Alert.alert("Erro", "Ocorreu um erro: " + error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Criar Conta</Text>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <FontAwesome name="envelope" size={20} color="#fff" style={styles.inputIcon} />
        <TextInput
          placeholder="E-mail"
          style={styles.input}
          value={email}
          placeholderTextColor="#aaa"
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Número */}
      <View style={styles.inputWrapper}>
        <FontAwesome name="phone" size={20} color="#fff" style={styles.inputIcon} />
        <TextInput
          placeholder="Número de Telefone"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={numero}
          onChangeText={setNumero}
          keyboardType="phone-pad"
        />
      </View>

      {/* Senha */}
      <View style={styles.inputWrapper}>
        <FontAwesome name="lock" size={20} color="#fff" style={styles.inputIcon} />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#aaa"
          style={styles.input}
          secureTextEntry={!mostrarSenha}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)} style={styles.eyeIcon}>
          <FontAwesome name={mostrarSenha ? "eye-slash" : "eye"} size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Confirmar Senha */}
      <View style={styles.inputWrapper}>
        <FontAwesome name="lock" size={20} color="#fff" style={styles.inputIcon} />
        <TextInput
          placeholder="Confirmar Senha"
          placeholderTextColor="#aaa"
          style={styles.input}
          secureTextEntry={!mostrarConfirmarSenha}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
        <TouchableOpacity onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} style={styles.eyeIcon}>
          <FontAwesome name={mostrarConfirmarSenha ? "eye-slash" : "eye"} size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Botão de Cadastro */}
      <TouchableOpacity style={styles.botaoCadastro} onPress={handleCadastro}>
        <Text style={styles.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1c1c1c",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#28a745",
    borderRadius: 8,
    backgroundColor: "#333",
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#fff",
    paddingLeft: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  botaoCadastro: {
    width: "100%",
    height: 50,
    backgroundColor: "#28a745",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
