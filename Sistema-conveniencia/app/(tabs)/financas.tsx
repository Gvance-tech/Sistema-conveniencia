import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import Logo from '../../assets/images/Logo.jpg';
import { api } from '../../services/api';

export default function FinancasScreen() {
  const [saldo, setSaldo] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [relatorioTexto, setRelatorioTexto] = useState('');

  useFocusEffect(
    useCallback(() => {
      try {
        const currentBalance = api.getDailyBalance();
        const allTransactions = api.getTransactions();
        
        setSaldo(currentBalance);
        setTransactions(allTransactions);
      } catch (error) {
        console.error("Erro ao carregar dados financeiros:", error);
      }
    }, [])
  );

  const formatarDataSegura = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const formatarHoraSegura = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const gerarTextoRelatorio = () => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR');

    let texto = `========================================\n`;
    texto += `       FECHO DE CAIXA - CONVENIÊNCIA      \n`;
    texto += `========================================\n`;
    texto += `Data: ${dataAtual} às ${horaAtual}\n`;
    texto += `Saldo em Caixa: ${saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
    texto += `----------------------------------------\n`;
    texto += `HISTÓRICO DE TRANSAÇÕES:\n\n`;

    if (transactions.length === 0) {
      texto += `Nenhuma transação registada.\n`;
    } else {
      transactions.forEach((tx, index) => {
        const tipoStr = tx.type === 'receita' ? 'RECEITA' : 'DESPESA';
        const valorStr = Number(tx.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const dataTx = formatarDataSegura(tx.date);
        const horaTx = formatarHoraSegura(tx.date);

        texto += `${index + 1}. [${tipoStr}] ${tx.category}\n`;
        texto += `   Descrição: ${tx.description || 'N/A'}\n`;
        texto += `   Valor: ${valorStr}\n`;
        texto += `   Data: ${dataTx} ${horaTx}\n`;
        texto += `----------------------------------------\n`;
      });
    }
    return texto;
  };

  // Abre apenas o modal para visualização na tela
  const handleFecharCaixa = () => {
    const texto = gerarTextoRelatorio();
    setRelatorioTexto(texto);
    setModalVisible(true);
  };

  // Executa o download/partilha apenas quando o utilizador clica no botão de descarregar dentro do modal
  const handleDescarregarOuPartilhar = async () => {
    try {
      const filename = `fecho_caixa_${Date.now()}.txt`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, relatorioTexto);

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Erro", "A partilha de ficheiros não está disponível neste dispositivo.");
        return;
      }

      await Sharing.shareAsync(fileUri, {
        dialogTitle: 'Relatório de Fecho de Caixa',
        mimeType: 'text/plain',
        UTI: 'public.plain-text',
      });
    } catch (error) {
      console.error("Erro ao partilhar relatório:", error);
      Alert.alert("Erro", "Não foi possível descarregar o relatório.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fluxo de caixa</Text>
        <Image source={Logo} style={styles.logoImage} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Bloco de Saldo Diário */}
        <View style={styles.saldoCard}>
          <Text style={styles.saldoLabel}>Saldo Diário</Text>
          <Text style={[styles.saldoValue, { color: saldo >= 0 ? '#FFE800' : '#FF6B6B' }]}>
            {saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Text>
        </View>

        {/* Botões de Ação Rápida (Despesa e Receita) */}
        <View style={styles.rowActions}>
          <Link href="/(tabs)/sub_pages/nova-despesa" asChild>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="arrow-down-circle" size={28} color="#FF6B6B" />
              <Text style={styles.actionText}>Despesa</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(tabs)/sub_pages/nova-receita" asChild>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="arrow-up-circle" size={28} color="#4CD964" />
              <Text style={styles.actionText}>Receita</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Bloco de Transações / Histórico */}
        <View style={styles.despesasDiariasSection}>
          <Text style={styles.sectionTitle}>Histórico de transações</Text>
          <View style={styles.despesasBox}>
            {transactions.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma transação registada.</Text>
            ) : (
              transactions.map((item, index) => (
                <React.Fragment key={item.id.toString()}>
                  <View style={styles.despesaItem}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={styles.despesaName} numberOfLines={1}>
                        {item.description || item.category}
                      </Text>
                      <Text style={styles.despesaDate}>
                        {formatarDataSegura(item.date)} - {item.category}
                      </Text>
                    </View>
                    <Text 
                      style={[
                        styles.despesaValor, 
                        { color: item.type === 'receita' ? '#4CD964' : '#FF6B6B' }
                      ]}
                    >
                      {item.type === 'receita' ? '+ ' : '- '}
                      {Number(item.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Text>
                  </View>
                  {index < transactions.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Botão Inferior: Fechar Caixa */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.fecharCaixaButton} onPress={handleFecharCaixa}>
          <Text style={styles.fecharCaixaText}>Fechar caixa</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para Visualizar o Relatório na Tela */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Relatório de Fecho</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1B2A4A" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalText}>{relatorioTexto}</Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: '#1B2A4A' }]} 
                onPress={handleDescarregarOuPartilhar}
              >
                <Ionicons name="download-outline" size={18} color="#FFE800" style={{ marginRight: 6 }} />
                <Text style={styles.modalBtnTextDark}>Descarregar / Partilhar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: '#E2E8F0' }]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnTextLight}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  scrollContainer: {
    paddingBottom: 20,
  },
  saldoCard: {
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
  saldoLabel: {
    color: '#A0AEC0',
    fontSize: 14,
    marginBottom: 5,
  },
  saldoValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  rowActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#1B2A4A',
    borderRadius: 14,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
  },
  despesasDiariasSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#1B2A4A',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  despesasBox: {
    backgroundColor: '#1B2A4A',
    borderRadius: 14,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  despesaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  despesaName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  despesaDate: {
    color: '#A0AEC0',
    fontSize: 11,
    marginTop: 2,
  },
  despesaValor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#A0AEC0',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 4,
  },
  footer: {
    paddingVertical: 15,
  },
  fecharCaixaButton: {
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
  fecharCaixaText: {
    color: '#FFE800',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 10,
  },
  modalTitle: {
    color: '#1B2A4A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalScroll: {
    maxHeight: 350,
    marginBottom: 15,
  },
  modalText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 13,
    color: '#2D3748',
    lineHeight: 18,
  },
  modalFooter: {
    gap: 10,
  },
  modalBtn: {
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalBtnTextDark: {
    color: '#FFE800',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBtnTextLight: {
    color: '#1B2A4A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});