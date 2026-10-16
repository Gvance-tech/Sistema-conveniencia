import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import Logo from '../../assets/images/Logo.jpg';
import { api } from '../../services/api'; // Ajusta o caminho conforme a tua estrutura

export default function NotinhasScreen() {
  const router = useRouter();
  const [notinhas, setNotinhas] = useState<any[]>([]);

  // Carrega apenas as notinhas do SQLite sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      try {
        const openNotinhas = api.getNotinhasOpenDebts();
        setNotinhas(openNotinhas);
      } catch (error) {
        console.error("Erro ao carregar notinhas:", error);
      }
    }, [])
  );

  const calcularTotalGeral = () => {
    return notinhas.reduce((acc, item) => acc + Number(item.total_amount), 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Controle de Notinhas</Text>
        <Image source={Logo} style={styles.logoImage} />
      </View>

      {/* Bloco de Valor Total de Notinhas Abertas */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total em Notinhas Abertas</Text>
        <Text style={styles.totalValue}>
          {calcularTotalGeral().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </Text>
      </View>

      {/* Lista de Notinhas */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Notinhas ativas</Text>
        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {notinhas.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma notinha registada.</Text>
          ) : (
            notinhas.map((item) => (
              <TouchableOpacity
                key={item.id.toString()}
                style={styles.clientCard}
                onPress={() => router.push({
                  pathname: '/(tabs)/sub_pages/detalhes-notinha',
                  params: { id: item.client_id, nomeCliente: item.client_name }
                })}
              >
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.clientName} numberOfLines={1}>{item.client_name}</Text>
                  <Text style={styles.clientDate}>
                    Data: {new Date(item.created_at).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <Text style={styles.clientDebt}>
                  {Number(item.total_amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      {/* Botão Inferior: Nova Notinha */}
      <View style={styles.footer}>
        <Link href="/(tabs)/sub_pages/nova-notinha" asChild>
          <TouchableOpacity style={styles.newButton}>
            <Ionicons name="document-text-outline" size={22} color="#1B2A4A" style={{ marginRight: 8 }} />
            <Text style={styles.newButtonText}>Nova notinha</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE800',
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
    color: '#1B2A4A',
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
  totalCard: {
    backgroundColor: '#1B2A4A',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  totalLabel: {
    color: '#A0AEC0',
    fontSize: 14,
    marginBottom: 5,
  },
  totalValue: {
    color: '#FFE800',
    fontSize: 28,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#1B2A4A',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  scrollList: {
    gap: 10,
    paddingBottom: 10,
  },
  clientCard: {
    backgroundColor: '#1B2A4A',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  clientName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clientDate: {
    color: '#A0AEC0',
    fontSize: 12,
    marginTop: 3,
  },
  clientDebt: {
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
    paddingVertical: 15,
  },
  newButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  newButtonText: {
    color: '#1B2A4A',
    fontSize: 18,
    fontWeight: 'bold',
  },
});