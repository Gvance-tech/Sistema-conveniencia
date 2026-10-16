import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Switch, BackHandler, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Logo from '../../assets/images/Logo.jpg';
import { useTheme } from '../context/themeContext'; // Ajusta o caminho se necessário

export default function PerfilScreen() {
  const { theme, toggleTheme, colors } = useTheme();

  const handleSairDoApp = () => {
    Alert.alert(
      "Sair",
      "Tens a certeza que queres fechar a aplicação?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive", 
          onPress: () => {
            if (Platform.OS === 'android') {
              BackHandler.exitApp();
            } else {
              // No iOS a Apple não permite fechar a app via código
              console.log("Fecho forçado bloqueado no iOS.");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Perfil</Text>
      </View>

      {/* Cartão de Informações da Empresa */}
      <View style={[styles.profileCard, { backgroundColor: colors.cardBackground }]}>
        <Image source={Logo} style={styles.profileLogo} />
        <View style={styles.infoContainer}>
          <Text style={styles.storeName}>Brasileirinho</Text>
          <Text style={styles.storeDetail}>Presidente Venceslau - SP</Text>
          <Text style={styles.storeDetail}>CNPJ: 00.000.000/0001-00</Text>
        </View>
      </View>

      {/* Configuração de Modo Escuro */}
      <View style={[styles.settingCard, { backgroundColor: colors.cardBackground }]}>
        <View style={styles.settingInfo}>
          <Ionicons name="moon-outline" size={22} color="#FFE800" />
          <Text style={styles.settingText}>Modo escuro</Text>
        </View>
        
        {/* O Switch lê o valor e altera diretamente através do contexto global */}
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#FFE800' }}
          thumbColor={theme === 'dark' ? '#1B2A4A' : '#f4f3f4'}
        />
      </View>

      <View style={{ flex: 1 }} />

      {/* Botões do Rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.cardBackground }]} onPress={() => console.log('Gerar relatórios')}>
          <Text style={styles.actionButtonText}>Gerar relatórios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleSairDoApp}>
          <Text style={[styles.actionButtonText, styles.logoutText]}>Sair do app</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  profileLogo: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    borderWidth: 2,
    borderColor: '#FFE800',
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  storeName: {
    color: '#FFE800',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  storeDetail: {
    color: '#FFFFFF',
    fontSize: 13,
    marginBottom: 2,
  },
  settingCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingBottom: 20,
    gap: 12,
  },
  actionButton: {
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
  actionButtonText: {
    color: '#FFE800',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FF4D4D',
  },
  logoutText: {
    color: '#FF4D4D',
  },
});