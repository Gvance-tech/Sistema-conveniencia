import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, FlatList, Image } from 'react-native';

import Logo from '../../assets/images/Logo.jpg';

// Dados de exemplo provisórios para simular os fiados na grelha
const MOCK_FIADOS = [
  { id: '1', name: 'João da Padaria', amount: 'R$ 45,00' },
  { id: '2', name: 'Carlos Silva', amount: 'R$ 120,50' },
  { id: '3', name: 'Maria Souza', amount: 'R$ 32,00' },
  { id: '4', name: 'Pedro Henrique', amount: 'R$ 85,00' },
];

export default function FiadoScreen() {
  const [search, setSearch] = useState('');

  const renderItem = ({ item }: { item: typeof MOCK_FIADOS[0] }) => (
    <TouchableOpacity style={styles.card} onPress={() => console.log(`Abrir fiado de ${item.name}`)}>
      <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.cardAmount}>{item.amount}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Controle de Fiados</Text>
        <Image source={Logo} style={styles.logoImage} />
      </View>

      {/* Barra de Procura */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Procurar cliente..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Seção da Lista */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Lista de fiados</Text>
        <FlatList
          data={MOCK_FIADOS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      {/* Botão Inferior: Novo Fiado */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.newButton} onPress={() => console.log('Criar novo fiado')}>
          <Text style={styles.newButtonText}>Novo fiado</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE800', // Amarelo vibrante da marca
    paddingHorizontal: 20,
    paddingTop: 45,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    color: '#1B2A4A', // Azul escuro
    fontSize: 22,
    fontWeight: 'bold',
  },
  logoImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: '#1B2A4A',
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1B2A4A',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
    color: '#1B2A4A',
    fontSize: 16,
  },
  listSection: {
    flex: 1,
  },
  sectionTitle: {
    color: '#1B2A4A',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1B2A4A', // Cartões em azul escuro
    width: '48%',
    height: 90,
    borderRadius: 14,
    padding: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardAmount: {
    color: '#FFE800', // Valor destacado em amarelo
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  footer: {
    paddingVertical: 15,
  },
  newButton: {
    backgroundColor: '#1B2A4A',
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  newButtonText: {
    color: '#FFE800',
    fontSize: 18,
    fontWeight: 'bold',
  },
});