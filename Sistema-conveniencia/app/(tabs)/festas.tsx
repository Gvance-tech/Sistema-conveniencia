import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import Logo from '../../assets/images/Logo.jpg';
import { api } from '../../services/api';

export default function FestasScreen() {
  const router = useRouter();
  const [parties, setParties] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      try {
        const list = api.getParties();
        setParties(list);
      } catch (error) {
        console.error("Erro ao carregar festas:", error);
      }
    }, [])
  );

  const calcularTotalGeral = () => {
    return parties.reduce((acc, item) => acc + Number(item.total_value), 0);
  };

  const handleExcluirFesta = (id: number) => {
    Alert.alert(
      "Excluir Festa",
      "Deseja realmente remover este registo de festa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            try {
              api.deleteParty(id);
              setParties(api.getParties());
            } catch (error) {
              console.error("Erro ao excluir festa:", error);
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
        <Text style={styles.headerTitle}>Controle de Festas</Text>
        <Image source={Logo} style={styles.logoImage} />
      </View>

      {/* Bloco de Valor Total */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total em Festas</Text>
        <Text style={styles.totalValue}>
          {calcularTotalGeral().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </Text>
      </View>

      {/* Lista de Festas */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Festas agendadas / ativas</Text>
        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {parties.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma festa registada.</Text>
          ) : (
            parties.map((party) => (
              <View key={party.id.toString()} style={styles.clientCard}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.clientName} numberOfLines={1}>{party.client_name}</Text>
                  <Text style={styles.clientDate}>Data: {party.party_date} | Local: {party.package_type}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.clientDebt}>
                    {Number(party.total_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Text>
                  <TouchableOpacity onPress={() => handleExcluirFesta(party.id)} style={{ marginTop: 6 }}>
                    <Ionicons name="trash-outline" size={18} color="#FF4D4D" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Botão Inferior: Nova Festa */}
      <View style={styles.footer}>
        <Link href="/(tabs)/sub_pages/nova-festa" asChild>
          <TouchableOpacity style={styles.newButton}>
            <Ionicons name="beer-outline" size={22} color="#1B2A4A" style={{ marginRight: 8 }} />
            <Text style={styles.newButtonText}>Nova festa</Text>
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