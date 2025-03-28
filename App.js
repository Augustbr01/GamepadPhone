import React, { useState, useEffect } from 'react';
import ConnectionScreen from './ConnectionScreen';
import ControlScreen from './ControlScreen';
import WebSocketService from './WebSocketService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as DevSettings from 'expo-dev-client'; // Importa o DevSettings

export default function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Desativa o "shake to reload"
    // Quando o app inicia, permite todas as orientações (para a tela de conexão)
    ScreenOrientation.unlockAsync();

    // Verifica se há um URL salvo e tenta conectar automaticamente
    AsyncStorage.getItem('@socketURL.2').then(url => {
      if (url) {
        WebSocketService.connect(
          url,
          () => {
            setIsConnected(true);
            // Quando conectado, trava na orientação horizontal (landscape)
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
          },
          () => {
            setIsConnected(false);
            // Quando desconectado, permite todas as orientações novamente
            ScreenOrientation.unlockAsync();
          }
        );
      }
    });

    // Limpeza ao desmontar o componente
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const handleConnect = (url) => {
    WebSocketService.connect(
      url,
      () => {
        setIsConnected(true);
        // Quando conectado, trava na orientação horizontal (landscape)
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      },
      () => {
        setIsConnected(false);
        // Quando desconectado, permite todas as orientações novamente
        ScreenOrientation.unlockAsync();
      }
    );
  };

  return isConnected ? <ControlScreen /> : <ConnectionScreen onConnect={handleConnect} />;
}