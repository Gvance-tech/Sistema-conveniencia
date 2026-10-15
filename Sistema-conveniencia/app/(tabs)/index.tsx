import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image } from 'react-native';

import Logo from '@/assets/images/Logo.jpg';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho: Nome da empresa e Logo */}
      <View style={styles.header}>
        <Text style={styles.companyName}>Brasileirinho</Text>
        <Image source={Logo} style={styles.logoImage} />
      </View>

      {/* Card de Saldo */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Atual da Conveniência</Text>
        <Text style={styles.balanceValue}>R$ 0,00</Text>
      </View>

      {/* Grade de Botões Principais */}
      <View style={styles.gridContainer}>
        <Link href="/(tabs)/fiados" asChild>
        <TouchableOpacity style={styles.menuButton} onPress={() => console.log('Ir para Fiado')}>
          <Text style={styles.buttonText}>Fiado</Text>
        </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/notinha" asChild>
        <TouchableOpacity style={styles.menuButton} onPress={() => console.log('Ir para Notinha')}>
          <Text style={styles.buttonText}>Notinha</Text>
        </TouchableOpacity>
        </Link>
        
        <Link href="/(tabs)/festas" asChild>
        <TouchableOpacity style={styles.menuButton} onPress={() => console.log('Ir para Festas')}>
          <Text style={styles.buttonText}>Festas</Text>
        </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/estoque" asChild>
        <TouchableOpacity style={styles.menuButton} onPress={() => console.log('Ir para Estoque')}>
          <Text style={styles.buttonText}>Estoque</Text>
        </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE800', // Amarelo vibrante inspirado na logo
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  companyName: {
    color: '#1B2A4A', // Azul escuro elegante
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 2,
    borderColor: '#1B2A4A',
  },
  balanceCard: {
    backgroundColor: '#1B2A4A', // Fundo azul escuro para destacar o financeiro
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  balanceLabel: {
    color: '#FFE800', // Texto em amarelo para contraste
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    paddingBottom: 20,
  },
  menuButton: {
    backgroundColor: '#1B2A4A', // Botões em azul escuro combinando com a identidade
    width: '48%',
    height: '46%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFE800', // Texto dos botões em amarelo da marca
    fontSize: 20,
    fontWeight: 'bold',
  },
});