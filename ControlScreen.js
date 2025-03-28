import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import WebSocketService from './WebSocketService';

// Função para calcular o ângulo do volante com base no acelerômetro
const computeAngle = (accel) => {
  return Math.atan2(accel.y, Math.sqrt(accel.x * accel.x + accel.z * accel.z)) * 1;
};

const ControlScreen = () => {
  const [steerValue, setSteerValue] = useState(0);

  useEffect(() => {
    Accelerometer.setUpdateInterval(20);
    Gyroscope.setUpdateInterval(20);

    let accelData = { x: 0, y: 0, z: 0 };
    let gyroData = { x: 0, y: 0, z: 0 };
    let smoothedSteer = 0;
    let lastTime = Date.now();

    const accelSubscription = Accelerometer.addListener((data) => {
      accelData = data;
    });

    const gyroSubscription = Gyroscope.addListener((data) => {
      gyroData = data;
    });

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const dt = Math.min(currentTime - lastTime, 100) / 1000;
      lastTime = currentTime;

      const baseAngle = computeAngle(accelData);
      const gyroAdjust = (gyroData.z + gyroData.x) * dt * -2;

      smoothedSteer = smoothedSteer * 0.5 + (baseAngle + gyroAdjust) * 0.5;
      const clampedSteer = Math.max(-1, Math.min(1, smoothedSteer));

      setSteerValue(clampedSteer);
      WebSocketService.send(`S${clampedSteer.toFixed(3)}`);
    }, 30);

    return () => {
      accelSubscription.remove();
      gyroSubscription.remove();
      clearInterval(interval);
    };
  }, []);

  // Adicionando keep-alive para evitar desconexões

  const sendGearCommand = (command) => {
    if (WebSocketService.isConnected()) {
      const gearCommand = `I0,0,999,0,${command === 'G' ? 'G' : 'g'}`;
      WebSocketService.send(gearCommand);
      console.log(`Comando de marcha enviado: ${gearCommand}`);

      setTimeout(() => {
        const resetCommand = `I0,0,999,0,`;
        WebSocketService.send(resetCommand);
        console.log(`Resetando comando de marcha: ${resetCommand}`);
      }, 100);
    } else {
      console.log('WebSocket não está conectado');
    }
  };

  const handleGearUp = () => {
    console.log('Botão Marcha + pressionado');
    sendGearCommand('G');
  };

  const handleGearDown = () => {
    console.log('Botão Marcha - pressionado');
    sendGearCommand('g');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.debug}>Steer: {steerValue.toFixed(3)}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonLeft} onPress={handleGearDown}>
          <Text style={styles.buttonText}>Marcha -</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonRight} onPress={handleGearUp}>
          <Text style={styles.buttonText}>Marcha +</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  debug: {
    position: 'absolute',
    top: 20,
    left: 20,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'column', // Mudei para 'column' para ter os botões verticalmente
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  buttonLeft: {
    flex: 1,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    paddingVertical: 30,
    borderRadius: 10,
  },
  buttonRight: {
    flex: 1,
    backgroundColor: '#44ff44',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10, // Mudei para left para alinhar os botões na lateral
    paddingVertical: 30,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ControlScreen;