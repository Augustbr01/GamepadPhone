import React, { useState, useEffect } from 'react';
import ConnectionScreen from './ConnectionScreen';
import ControlScreen from './ControlScreen';
import WebSocketService from './WebSocketService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Quando o app inicia, permite todas as orientações (para a tela de conexão)
    ScreenOrientation.unlockAsync();

    // Verifica se há um URL salvo e tenta conectar automaticamente
    AsyncStorage.getItem('@socketURL.2').then(url => {
      if (url) {
        handleConnect(url, () => {}); // Tenta conectar automaticamente, mas ignora erros aqui
      }
    });

    // Limpeza ao desmontar o componente
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const handleConnect = (url, onError) => {
    WebSocketService.connect(
      url,
      () => {
        setIsConnected(true);
        // Quando conectado, trava na orientação horizontal (landscape)
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      },
      (error) => {
        setIsConnected(false);
        // Quando desconectado ou há erro, permite todas as orientações novamente
        ScreenOrientation.unlockAsync();
        if (onError) onError(error); // Chama a função de callback para tratar o erro
      }
    );
  };

  return isConnected ? <ControlScreen /> : <ConnectionScreen onConnect={handleConnect} />;
}