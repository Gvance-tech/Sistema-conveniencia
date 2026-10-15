import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Caminho para a logo na raiz do projeto a partir de app/(tabs)/
import Logo from '../../assets/images/Logo.jpg';

// Dados de exemplo para simular as festas agendadas na grelha
const MOCK_FESTAS = [
  { id: '1', title: 'Aniversário Carlos', date: '20/10/2026', desc: '3 caixas de cerveja + gelo' },
  { id: '2', title: 'Churrasco Família', date: '25/10/2026', desc: 'Carvão e refrigerantes' },
  { id: '3', title: 'Festa de Fim de Ano', date: '15/12/2026', desc: 'Variedade de destilados' },
  { id: '4', title: 'Confraternização', date: '30/12/2026', desc: 'Sucos, águas e energéticos' },
];

export default function FestasScreen() {
  const [search, setSearch] = useState('');

  const renderItem = ({ item }: { item: typeof MOCK_FESTAS[0] }) => (
    <TouchableOpacity style={styles.card} onPress={() => console.log(`Abrir festa: ${item.title}`)}>
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
        <Text style={styles.headerTitle}>Controle de festas</Text>
        <Image source={Logo} style={styles.logoImage} />
      </View>

      {/* Barra de Procura com Botão de Filtro ao lado */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Festas..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => console.log('Abrir filtros')}>
          <Ionicons name="menu" size={24} color="#FFE800" />
        </TouchableOpacity>
      </View>

      {/* Seção da Lista */}
      <View style={styles.listSection}>
        <FlatList
          data={MOCK_FESTAS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      {/* Botão Inferior: Nova Festa */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.newButton} onPress={() => console.log('Criar nova festa')}>
          <Text style={styles.newButtonText}>Nova festa</Text>
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
    paddingTop: 30,
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1B2A4A',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
    color: '#1B2A4A',
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#1B2A4A',
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listSection: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#1B2A4A', // Cartões em azul escuro
    width: '48%',
    height: 120,
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
    color: '#FFE800', // Título em amarelo para destaque
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardDate: {
    color: '#A0AEC0', // Tom cinza claro para a data
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