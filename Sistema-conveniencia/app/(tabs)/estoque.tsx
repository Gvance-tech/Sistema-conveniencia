import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Caminho para a logo na raiz do projeto a partir de app/(tabs)/
import Logo from '../../assets/images/Logo.jpg';

// Dados de exemplo para simular o estoque de produtos
const MOCK_ESTOQUE = [
  { id: '1', name: 'Cerveja Lata 350ml', qty: 24, price: 'R$ 5,00', lowStock: false },
  { id: '2', name: 'Gelo em Saco 5kg', qty: 3, price: 'R$ 10,00', lowStock: true }, // Alerta de stock baixo
  { id: '3', name: 'Carvão 3kg', qty: 12, price: 'R$ 20,00', lowStock: false },
  { id: '4', name: 'Água Mineral 500ml', qty: 5, price: 'R$ 3,50', lowStock: true }, // Alerta de stock baixo
  { id: '5', name: 'Energético Monster', qty: 18, price: 'R$ 9,90', lowStock: false },
  { id: '6', name: 'Refrigerante 2L', qty: 10, price: 'R$ 12,00', lowStock: false },
];

export default function EstoqueScreen() {
  const [search, setSearch] = useState('');

  const renderItem = ({ item }: { item: typeof MOCK_ESTOQUE[0] }) => (
    <TouchableOpacity style={[styles.card, item.lowStock && styles.cardLowStock]} onPress={() => console.log(`Selecionar produto: ${item.name}`)}>
      <View>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardPrice}>{item.price}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={[styles.cardQty, item.lowStock && styles.textLowStock]}>
          Qtd: {item.qty} un
        </Text>
        {item.lowStock && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Baixo</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Controle de estoque</Text>
        <Image source={Logo} style={styles.logoImage} />
      </View>

      {/* Barra de Procura com Botão de Filtro ao lado */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="procurar produto"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => console.log('Abrir filtros')}>
          <Ionicons name="menu" size={24} color="#FFE800" />
        </TouchableOpacity>
      </View>

      {/* Seção da Grelha de Produtos */}
      <View style={styles.listSection}>
        <FlatList
          data={MOCK_ESTOQUE}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      {/* Rodapé com Dois Botões: Novo Produto e Editar */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => console.log('Criar novo produto')}>
          <Text style={styles.actionButtonText}>Novo produto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => console.log('Editar estoque')}>
          <Text style={styles.actionButtonText}>Editar</Text>
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
    height: 115,
    borderRadius: 14,
    padding: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  cardLowStock: {
    borderWidth: 1.5,
    borderColor: '#FF6B6B', // Borda vermelha leve para destacar stock baixo
  },
  cardTitle: {
    color: '#FFE800', // Título em amarelo para destaque
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardPrice: {
    color: '#FFFFFF',
    fontSize: 13,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardQty: {
    color: '#A0AEC0',
    fontSize: 12,
    fontWeight: '600',
  },
  textLowStock: {
    color: '#FF8A8A', // Tom avermelhado para avisar que a quantidade está baixa
  },
  badge: {
    backgroundColor: '#FF4D4D',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    gap: 12,
  },
  actionButton: {
    flex: 1,
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
  editButton: {
    backgroundColor: '#111827', // Um tom de azul/cinza escuro diferente para diferenciar o botão de editar
  },
  actionButtonText: {
    color: '#FFE800',
    fontSize: 16,
    fontWeight: 'bold',
  },
});