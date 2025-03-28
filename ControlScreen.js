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
    backgroundColor: '#000', // Preto
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  gearLabel: {
    position: 'absolute',
    top: 20,
    right: 20,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  debug: {
    position: 'absolute',
    top: 20,
    left: 20,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  steeringIndicator: {
    alignSelf: 'center',
    width: '60%',
    height: 30,
    backgroundColor: '#333',
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 20,
  },
  steeringBar: {
    height: '100%',
    backgroundColor: '#2196F3', // Azul vibrante
    borderRadius: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonLeft: {
    width: 120,
    height: 300,
    backgroundColor: '#ff4d4d', // Vermelho escuro
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonRight: {
    width: 120,
    height: 300,
    backgroundColor: '#4CAF50', // Verde escuro
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default ControlScreen;