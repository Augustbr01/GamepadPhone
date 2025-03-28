# GamepadPhone 🎮📱

![GamepadPhone Icon](assets/gamepadphone-icon.png)

**GamepadPhone** é um aplicativo mobile desenvolvido em React Native que transforma seu celular em um controle para jogos de corrida, como o Assetto Corsa. Com ele, você pode controlar o volante e marchas diretamente do seu smartphone, usando toques na tela. O app se conecta ao servidor `AcTools.GamepadServer.exe` via WebSocket, configurado através do Content Manager do Assetto Corsa.

## 📋 Funcionalidades

- **Controle do Volante**: Giroscópio e Acelerometro.
- **Botões de Marcha**: Troque de marcha com botões intuitivos na tela (Marcha + e Marcha -).
- **Feedback Visual**: Uma barra visual mostra a posição do volante em tempo real.
- **Conexão WebSocket**: Usa WebSocket para comunicação com o servidor, configurado via Content Manager.
- **Compatibilidade**: Desenvolvido para Android, com suporte a dispositivos como Xiaomi/Redmi (MIUI).

## 🚀 Como Funciona

O app se conecta ao servidor `AcTools.GamepadServer.exe`, que deve estar rodando no seu PC e configurado através do Content Manager do Assetto Corsa. O servidor traduz os comandos enviados pelo app (como movimentos do volante e trocas de marcha) para o jogo Assetto Corsa. A comunicação é feita via WebSocket (`ws://`).

### Estrutura do Projeto

- **Frontend**: Desenvolvido em React Native com Expo, para rodar no Android.
- **Backend**: Usa o `AcTools.GamepadServer.exe` (configurado via Content Manager) para comunicação com o jogo.
- **Conexão**: WebSocket configurado através do Content Manager.
