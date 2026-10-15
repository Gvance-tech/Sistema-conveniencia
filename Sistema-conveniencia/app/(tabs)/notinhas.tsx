import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, FlatList, Image } from 'react-native';

// Caminho correto para a logo na raiz do projeto a partir de app/(tabs)/
import Logo from '../../assets/images/Logo.jpg';

// Dados de exemplo para simular as notinhas na grelha
const MOCK_NOTINHAS = [
  { id: '1', title: 'Cliente 1', date: '15/10/2026', desc: 'Comprar 5 sacos de gelo' },
  { id: '2', title: 'Cliente 2', date: '14/10/2026', desc: 'Acabou a cerveja litrão' },
  { id: '3', title: 'Cliente 3', date: '10/10/2026', desc: 'Pagar boleto fornecedor' },
  { id: '4', title: 'Cliente 4', date: '09/10/2026', desc: 'Reposição de carvão' },
];

export default function NotinhasScreen() {
  const [search, setSearch] = useState('');

  const renderItem = ({ item }: { item: typeof MOCK_NOTINHAS[0] }) => (
    <TouchableOpacity style={styles.card} onPress={() => console.log(`Abrir notinha de ${item.title}`)}>
      <View>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Controle de notinhas</Text>
        <Image source={Logo} style={styles.logoImage} />
      </View>

      {/* Barra de Procura */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Procurar notinha"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Seção da Lista */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Lista de notinhas</Text>
        <FlatList
          data={MOCK_NOTINHAS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      {/* Botão Inferior: Nova Notinha */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.newButton} onPress={() => console.log('Criar nova notinha')}>
          <Text style={styles.newButtonText}>Nova notinha</Text>
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
    paddingTop: 30, // Espaçamento superior para descer o conteúdo
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
    height: 110,
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
    color: '#FFE800', // Título do cartão em amarelo
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardDate: {
    color: '#A0AEC0',
    fontSize: 11,
    marginBottom: 4,
  },
  cardDesc: {
    color: '#FFFFFF',
    fontSize: 12,
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