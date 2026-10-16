import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import Logo from '../../../assets/images/Logo.jpg';
import { api } from '../../../services/api'; // Ajusta o caminho relativo conforme a localização exata do teu api.ts

export default function NovaNotinhaScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [valor, setValor] = useState('');
  const [itens, setItens] = useState('');

  const handleSalvarNotinha = () => {
    if (!nome || !valor) {
      Alert.alert('Atenção', 'Preencha os campos obrigatórios (Nome e Valor).');
      return;
    }

    try {
      const numericValue = parseFloat(valor.replace(',', '.'));
      if (isNaN(numericValue) || numericValue <= 0) {
        Alert.alert('Erro', 'Insira um valor válido.');
        return;
      }

      // 1. Insere o cliente na tabela de clientes (tipo 'notinha')
      const clientId = api.insertClient(
        nome.trim(), 
        'notinha', 
        telefone.trim() || undefined
      );

      // 2. Prepara os itens da notinha descritos na caixa de texto
      const listaItens = [
        {
          description: itens.trim() || 'Notinha / Produtos diversos',
          quantity: 1,
          unit_price: numericValue,
        }
      ];

      // 3. Regista a dívida/notinha e os respetivos itens no SQLite
      api.createDebt(clientId, numericValue, listaItens);

      Alert.alert('Sucesso', 'Notinha salva com sucesso!');
      router.replace('/(tabs)/notinhas');
    } catch (error) {
      console.error("Erro ao salvar notinha:", error);
      Alert.alert('Erro', 'Não foi possível salvar a notinha no banco de dados.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/(tabs)/notinhas')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1B2A4A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nova notinha</Text>
          <Image source={Logo} style={styles.logoImage} />
        </View>

        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Linha superior: Nome/Telefone à esquerda e Valor à direita */}
          <View style={styles.topRow}>
            <View style={styles.leftInputs}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome do cliente"
                  placeholderTextColor="#888"
                  value={nome}
                  onChangeText={setNome}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor="#888"
                  keyboardType="phone-pad"
                  value={telefone}
                  onChangeText={setTelefone}
                />
              </View>
            </View>

            <View style={styles.rightValueContainer}>
              <Text style={styles.label}>Valor</Text>
              <TextInput
                style={[styles.input, styles.valorInput]}
                placeholder="R$ 0,00"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={valor}
                onChangeText={setValor}
              />
            </View>
          </View>

          {/* Área de Itens (Grande caixa de texto) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Itens</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva os itens da notinha..."
              placeholderTextColor="#888"
              multiline
              numberOfLines={6}
              value={itens}
              onChangeText={setItens}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* Rodapé com botão de Salvar */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSalvarNotinha}>
            <Text style={styles.saveButtonText}>Salvar notinha</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE800',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#1B2A4A',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
  },
  logoImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#1B2A4A',
  },
  formContainer: {
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 15,
  },
  leftInputs: {
    flex: 1,
    gap: 15,
  },
  rightValueContainer: {
    width: 110,
    justifyContent: 'flex-start',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: '#1B2A4A',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1B2A4A',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    color: '#1B2A4A',
    fontSize: 15,
  },
  valorInput: {
    height: 111, 
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textArea: {
    height: 140,
    paddingTop: 12,
  },
  footer: {
    paddingVertical: 15,
  },
  saveButton: {
    backgroundColor: '#1B2A4A',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFE800',
    fontSize: 17,
    fontWeight: 'bold',
  },
});