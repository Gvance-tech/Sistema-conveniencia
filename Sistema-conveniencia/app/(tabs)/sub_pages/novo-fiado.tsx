import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import Logo from '../../../assets/images/Logo.jpg';
import { api } from '../../../services/api';

export default function NovoFiadoScreen() {
  const router = useRouter();
  const { clienteId, nomeCliente, debtId } = useLocalSearchParams(); // Recebe parâmetros caso venha dos detalhes

  const [nome, setNome] = useState(nomeCliente ? String(nomeCliente) : '');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');

  const isAddingItem = Boolean(clienteId); // Se tem clienteId, estamos a adicionar um item a um fiado existente

  const handleSalvarFiado = () => {
    if (!valor || (!isAddingItem && !nome)) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const numericValue = parseFloat(valor.replace(',', '.'));
      if (isNaN(numericValue) || numericValue <= 0) {
        Alert.alert('Erro', 'Insira um valor válido.');
        return;
      }

      if (isAddingItem) {
        // Cenário 1: Adicionar item a uma dívida/cliente existente
        // Precisamos de garantir que temos a dívida aberta do cliente
        let targetDebtId = debtId ? Number(debtId) : null;

        if (!targetDebtId) {
          const openDebts = api.getOpenDebts();
          const existingDebt = openDebts.find(d => d.client_id === Number(clienteId));
          if (existingDebt) {
            targetDebtId = existingDebt.id;
          }
        }

        if (targetDebtId) {
          api.addDebtItem(
            targetDebtId, 
            descricao.trim() || 'Novo item adicionado', 
            1, 
            numericValue
          );
        } else {
          // Se por acaso não tiver dívida aberta, cria uma nova para este cliente
          api.createDebt(Number(clienteId), numericValue, [
            { description: descricao.trim() || 'Novo item', quantity: 1, unit_price: numericValue }
          ]);
        }
      } else {
        // Cenário 2: Criar novo fiado do zero (cliente novo)
        const newClientId = api.insertClient(nome, 'fiado');
        const itens = [
          {
            description: descricao.trim() || 'Dívida / Produtos diversos',
            quantity: 1,
            unit_price: numericValue,
          }
        ];
        api.createDebt(newClientId, numericValue, itens);
      }

      router.back();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert('Erro', 'Não foi possível concluir a operação.');
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1B2A4A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isAddingItem ? `Adicionar a ${nomeCliente}` : 'Novo fiado'}
          </Text>
          <Image source={Logo} style={styles.logoImage} />
        </View>

        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Campo Nome (Bloqueado se for para adicionar item a cliente existente) */}
          {!isAddingItem && (
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
          )}

          {/* Campo Valor do Item / Adicional */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{isAddingItem ? 'Valor do novo item' : 'Valor total'}</Text>
            <TextInput
              style={styles.input}
              placeholder="R$ 0,00"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={valor}
              onChangeText={setValor}
            />
          </View>

          {/* Campo Descrição */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição dos produtos</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ex: + 2 Cervejas, 1 Gelo..."
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
              value={descricao}
              onChangeText={setDescricao}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* Botão de Rodapé */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSalvarFiado}>
            <Text style={styles.saveButtonText}>{isAddingItem ? 'Adicionar item' : 'Salvar fiado'}</Text>
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
    marginBottom: 25,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#1B2A4A',
    fontSize: 20,
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#1B2A4A',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1B2A4A',
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 50,
    color: '#1B2A4A',
    fontSize: 16,
  },
  textArea: {
    height: 120,
    paddingTop: 15,
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