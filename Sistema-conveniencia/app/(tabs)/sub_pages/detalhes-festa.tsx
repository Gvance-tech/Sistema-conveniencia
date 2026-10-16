import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import Logo from '../../../assets/images/Logo.jpg';

export default function DetalhesFestaScreen() {
  const router = useRouter();
  const { id, nomeDono } = useLocalSearchParams(); // Recebe os dados passados da lista principal

  // Dados fictícios de exemplo para simular os itens da festa
  const [itens, setItens] = useState([
    { id: '1', data: '18/10/2026', descricao: '5 Engradados de Cerveja', valor: 'R$ 250,00' },
    { id: '2', data: '19/10/2026', descricao: '3 Pacotes de Gelo Grande', valor: 'R$ 45,00' },
  ]);

  const valorTotal = 'R$ 295,00';

  const handleExcluirFesta = () => {
    Alert.alert(
      "Excluir Festa",
      `Deseja realmente excluir o registro da festa de ${nomeDono || 'este responsável'}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: () => {
            console.log(`Festa ID ${id} excluída.`);
            router.replace('/(tabs)/festas');
          } 
        }
      ]
    );
  };

  const handleFestaPaga = () => {
    Alert.alert(
      "Festa Paga",
      "Marcar esta festa como paga/quitada?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Confirmar", 
          onPress: () => {
            console.log(`Festa ID ${id} paga.`);
            router.replace('/(tabs)/festas');
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/festas')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1B2A4A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes festa</Text>
        <Image source={Logo} style={styles.logoImage} />
      </View>

      {/* Bloco de Informações Principais (Nome do Dono e Valor Total) */}
      <View style={styles.infoCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.labelCliente}>Nome do dono</Text>
          <Text style={styles.nomeCliente} numberOfLines={1}>{nomeDono || 'Carlos Silva'}</Text>
        </View>
        <View style={styles.valorContainer}>
          <Text style={styles.labelValor}>Valor total</Text>
          <Text style={styles.valorTotal}>{valorTotal}</Text>
        </View>
      </View>

      {/* Caixa de Itens Passados */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Itens passados</Text>
        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {itens.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemDescricao}>{item.descricao}</Text>
                <Text style={styles.itemData}>{item.data}</Text>
              </View>
              <Text style={styles.itemValor}>{item.valor}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Botões de Ação no Rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.actionButtonAdd} 
          onPress={() => console.log('Adicionar item')}
        >
          <Text style={styles.actionButtonTextDark}>Adicionar item</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButtonPay} 
          onPress={handleFestaPaga}
        >
          <Text style={styles.actionButtonTextLight}>Festa Paga</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButtonDelete} 
          onPress={handleExcluirFesta}
        >
          <Text style={styles.actionButtonTextDelete}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE800',
    paddingHorizontal: 20,
    paddingTop: 20,
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
  infoCard: {
    backgroundColor: '#1B2A4A',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  labelCliente: {
    color: '#A0AEC0',
    fontSize: 12,
  },
  nomeCliente: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  valorContainer: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  labelValor: {
    color: '#A0AEC0',
    fontSize: 12,
  },
  valorTotal: {
    color: '#FFE800',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
  },
  listContainer: {
    flex: 1,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#1B2A4A',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollList: {
    gap: 10,
    paddingBottom: 10,
  },
  historyItem: {
    backgroundColor: '#1B2A4A',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDescricao: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  itemData: {
    color: '#A0AEC0',
    fontSize: 12,
    marginTop: 3,
  },
  itemValor: {
    color: '#FFE800',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    paddingBottom: 20,
    gap: 8,
  },
  actionButtonAdd: {
    backgroundColor: '#1B2A4A',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonPay: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1B2A4A',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDelete: {
    backgroundColor: '#FF4D4D',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonTextDark: {
    color: '#FFE800',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonTextLight: {
    color: '#1B2A4A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonTextDelete: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});