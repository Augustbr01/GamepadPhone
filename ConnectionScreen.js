import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConnectionScreen = ({ onConnect }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('@socketURL.2').then(storedUrl => {
      if (storedUrl) setUrl(storedUrl);
    });
  }, []);

  const handleConnect = () => {
    if (url) {
      AsyncStorage.setItem('@socketURL.2', url);
      onConnect(url);
    }
  };

  const handlePreset1 = () => {
    const presetUrl = 'ws://192.168.100.105:46557';
    setUrl(presetUrl); // Atualiza o campo de texto com o URL predefinido
    AsyncStorage.setItem('@socketURL.2', presetUrl);
    onConnect(presetUrl); // Conecta diretamente
  };

  return (
    <View style={styles.container}>
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ConnectionScreen;