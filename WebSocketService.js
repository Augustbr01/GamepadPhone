let socket = null;

const WebSocketService = {
  connect: (url, onOpen, onClose) => {
    if (socket) socket.close();
    socket = new WebSocket(url);
    socket.onopen = () => {
      console.log('Conectado ao Assetto Corsa');
      onOpen();
    };
    socket.onclose = () => {
      console.log('Desconectado do Assetto Corsa');
      socket = null;
      onClose();
    };
    socket.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
      socket = null;
      onClose();
    };
    socket.onmessage = (event) => {
      if (event.data.startsWith('P')) {
        const pingValue = event.data.slice(1);
        socket.send(`P${pingValue}`); // Responde ao ping
      }
    };
  },
  send: (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.error('WebSocket não está conectado ou não está pronto');
    }
  },
  isConnected: () => {
    return socket && socket.readyState === WebSocket.OPEN;
  },
};

export default WebSocketService;