import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import Logo from '../../../assets/images/Logo.jpg';
import { api } from '../../../services/api';

export default function NovaFestaScreen() {
  const router = useRouter();

  const [nomeDono, setNomeDono] = useState('');
  const [local, setLocal] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataFesta, setDataFesta] = useState('');
  const [valor, setValor] = useState('');
  const [itens, setItens] = useState('');

  const handleSalvarFesta = () => {
    if (!nomeDono || !valor) {
      Alert.alert("Atenção", "Por favor, preencha pelo menos o nome do responsável e o valor.");
      return;
    }

    try {
      const numericValue = parseFloat(valor.replace(',', '.'));
      if (isNaN(numericValue) || numericValue <= 0) {
        Alert.alert("Erro", "Insira um valor válido.");
        return;
      }

      // 1. Insere o responsável na tabela clients (tipo 'festa')
      const clientId = api.insertClient(
        nomeDono.trim(),
        'festa',
        telefone.trim() || undefined,
        undefined,
        local.trim() || undefined
      );

      // 2. Formata a data (se o utilizador preencheu, ex: DD/MM/YYYY para ISO ou guarda o texto)
      const partyDate = dataFesta.trim() ? dataFesta.trim() : new Date().toLocaleDateString('pt-BR');

      // 3. Insere a festa na tabela parties
      api.insertParty(
        clientId,
        partyDate,
        local.trim() || 'Festa / Evento',
        numericValue,
        0,
        'aberto'
      );

      Alert.alert("Sucesso", "Festa registada com sucesso!");
      router.replace('/(tabs)/festas');
    } catch (error) {
      console.error("Erro ao salvar festa:", error);
      Alert.alert("Erro", "Não foi possível guardar a festa no banco de dados.");
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
          <TouchableOpacity onPress={() => router.replace('/(tabs)/festas')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1B2A4A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nova festa</Text>
          <Image source={Logo} style={styles.logoImage} />
        </View>

        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Linha superior: Inputs à esquerda e Valor à direita */}
          <View style={styles.topRow}>
            <View style={styles.leftInputs}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome do dono</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome do responsável"
                  placeholderTextColor="#888"
                  value={nomeDono}
                  onChangeText={setNomeDono}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Local</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Local do evento"
                  placeholderTextColor="#888"
                  value={local}
                  onChangeText={setLocal}
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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Data da festa</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#888"
                  value={dataFesta}
                  onChangeText={setDataFesta}
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
              placeholder="Descreva os itens / bebidas solicitadas para a festa..."
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
          <TouchableOpacity style={styles.saveButton} onPress={handleSalvarFesta}>
            <Text style={styles.saveButtonText}>Salvar</Text>
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
    gap: 12,
  },
  rightValueContainer: {
    width: 110,
    justifyContent: 'flex-start',
  },
  inputGroup: {
    marginBottom: 12,
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
    height: 240, 
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