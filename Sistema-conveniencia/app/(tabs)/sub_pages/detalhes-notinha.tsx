import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import Logo from '../../../assets/images/Logo.jpg';
import { api } from '../../../services/api';

export default function DetalhesNotinhaScreen() {
  const router = useRouter();
  const { id, nomeCliente } = useLocalSearchParams(); 

  const [itens, setItems] = useState<any[]>([]);
  const [valorTotal, setValorTotal] = useState<number>(0);
  const [debtId, setDebtId] = useState<number | null>(null);

  // Carrega os itens e o valor total do SQLite quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      try {
        const clientId = Number(id);
        
        // Procura a dívida/notinha aberta associada a este cliente
        const openDebts = api.getOpenDebts();
        const clientDebt = openDebts.find(d => d.client_id === clientId);

        if (clientDebt) {
          setDebtId(clientDebt.id);
          const debtItems = api.getDebtItems(clientDebt.id);
          setItems(debtItems);

          const total = debtItems.reduce((acc, item) => acc + Number(item.total_price), 0);
          setValorTotal(total);
        } else {
          setDebtId(null);
          setItems([]);
          setValorTotal(0);
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes da notinha:", error);
      }
    }, [id])
  );

  const handleExcluirNotinha = () => {
    Alert.alert(
      "Excluir Notinha",
      `Deseja realmente excluir a notinha de ${nomeCliente || 'este cliente'}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: () => {
            try {
              const clientId = Number(id);
              api.deleteClient(clientId);
              router.replace('/(tabs)/notinhas');
            } catch (error) {
              console.error("Erro ao excluir notinha:", error);
              Alert.alert("Erro", "Não foi possível excluir o registo.");
            }
          } 
        }
      ]
    );
  };

  const handleNotinhaPaga = () => {
    if (!debtId) {
      Alert.alert("Atenção", "Nenhuma notinha aberta encontrada para quitar.");
      return;
    }

    Alert.alert(
      "Notinha Paga",
      "Marcar esta notinha como paga/quitada?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Confirmar", 
          onPress: () => {
            try {
              api.payDebt(debtId);

              api.insertTransaction(
                'receita', 
                'Quitação de Notinha', 
                valorTotal, 
                `Recebimento de notinha de ${nomeCliente || 'Cliente'}`
              );

              Alert.alert("Sucesso", "Notinha quitada com sucesso!");
              router.replace('/(tabs)/notinhas');
            } catch (error) {
              console.error("Erro ao quitar notinha:", error);
              Alert.alert("Erro", "Não foi possível quitar a notinha.");
            }
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/notinhas')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1B2A4A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes notinha</Text>
        <Image source={Logo} style={styles.logoImage} />
      </View>

      {/* Bloco de Informações Principais (Nome e Valor Total) */}
      <View style={styles.infoCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.labelCliente}>Cliente</Text>
          <Text style={styles.nomeCliente} numberOfLines={1}>{nomeCliente || 'Cliente'}</Text>
        </View>
        <View style={styles.valorContainer}>
          <Text style={styles.labelValor}>Valor total</Text>
          <Text style={styles.valorTotal}>
            {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Text>
        </View>
      </View>

      {/* Caixa de Itens Passados */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Itens passados</Text>
        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {itens.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum item registado nesta notinha.</Text>
          ) : (
            itens.map((item) => (
              <View key={item.id.toString()} style={styles.historyItem}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.itemDescricao}>{item.description}</Text>
                  <Text style={styles.itemData}>Quantidade: {item.quantity}</Text>
                </View>
                <Text style={styles.itemValor}>
                  {Number(item.total_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Botões de Ação no Rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.actionButtonAdd} 
          onPress={() => router.push({ 
            pathname: '/(tabs)/sub_pages/novo-fiado', 
            params: { clienteId: id, nomeCliente: nomeCliente, debtId: debtId } 
          })}
        >
          <Text style={styles.actionButtonTextDark}>Adicionar item</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButtonPay} 
          onPress={handleNotinhaPaga}
        >
          <Text style={styles.actionButtonTextLight}>Notinha Paga</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButtonDelete} 
          onPress={handleExcluirNotinha}
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
  emptyText: {
    color: '#1B2A4A',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
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