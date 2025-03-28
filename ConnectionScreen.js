import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConnectionScreen = ({ onConnect }) => {
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('@socketURL.2').then(storedUrl => {
      if (storedUrl) setUrl(storedUrl);
    });
  }, []);

  const validateUrl = (url) => {
    const wsRegex = /^ws:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}$/;
    return wsRegex.test(url);
  };

  const handleConnect = () => {
    setErrorMessage('');
    if (!url) {
      setErrorMessage('Por favor, digite um URL.');
      return;
    }
    if (!validateUrl(url)) {
      setErrorMessage('URL inválido. Use o formato ws://IP:PORTA (ex.: ws://192.168.1.100:46557).');
      return;
    }
    AsyncStorage.setItem('@socketURL.2', url);
    onConnect(url, handleConnectionError);
  };

  const handleConnectionError = (error) => {
    setErrorMessage(`Falha ao conectar: ${error.message || 'IP ou porta inválidos.'}`);
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  };

  const handlePreset1 = () => {
    const presetUrl = 'ws://192.168.100.105:46557';
    setUrl(presetUrl);
    AsyncStorage.setItem('@socketURL.2', presetUrl);
    onConnect(presetUrl, handleConnectionError);
  };

  // Função para limpar o AsyncStorage
  const handleClearStorage = async () => {
    try {
      await AsyncStorage.clear();
      setUrl(''); // Limpa o campo de texto
      setErrorMessage('Cache do AsyncStorage limpo com sucesso!');
    } catch (error) {
      setErrorMessage('Erro ao limpar o AsyncStorage: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Digite o URL do WebSocket (ex.: ws://192.168.1.100:46557)"
        placeholderTextColor="#888"
        value={url}
        onChangeText={setUrl}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleConnect}>
          <Text style={styles.buttonText}>Conectar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.presetButton} onPress={handlePreset1}>
          <Text style={styles.buttonText}>Preset1</Text>
        </TouchableOpacity>
      </View>
      {/* Botão temporário para limpar o AsyncStorage */}
      <TouchableOpacity style={styles.clearButton} onPress={handleClearStorage}>
        <Text style={styles.buttonText}>Limpar Cache</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  presetButton: {
    flex: 1,
    backgroundColor: '#FF9500',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 10,
  },
  clearButton: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ConnectionScreen;