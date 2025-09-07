
import { useState, useEffect, useRef } from 'react';
import type { MqttClient, IClientOptions } from 'mqtt';
import { MqttMessage, ConnectionStatus } from '../types';

interface MqttHookOptions {
  uri: string;
  options?: IClientOptions;
}

// Note: The global `mqtt` object comes from the script included in index.html
declare global {
  interface Window {
    mqtt: any;
  }
}

export const useMqtt = ({ uri, options = {} }: MqttHookOptions) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.Disconnected);
  const [messages, setMessages] = useState<MqttMessage[]>([]);
  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {
    if (clientRef.current) {
      return;
    }

    if (!window.mqtt) {
      console.error("MQTT.js not loaded. Make sure the script is included in your index.html.");
      setConnectionStatus(ConnectionStatus.Error);
      return;
    }

    try {
      setConnectionStatus(ConnectionStatus.Connecting);
      const client = window.mqtt.connect(uri, options);
      clientRef.current = client;

      client.on('connect', () => {
        console.log('MQTT Client Connected');
        setConnectionStatus(ConnectionStatus.Connected);
      });

      client.on('reconnect', () => {
        console.log('MQTT Client Reconnecting');
        setConnectionStatus(ConnectionStatus.Reconnecting);
      });

      client.on('close', () => {
        console.log('MQTT Client Disconnected');
        setConnectionStatus(ConnectionStatus.Disconnected);
      });

      client.on('error', (err: Error) => {
        console.error('MQTT Client Error:', err);
        setConnectionStatus(ConnectionStatus.Error);
        client.end();
      });

      client.on('message', (topic: string, payload: Buffer) => {
        const newMessage: MqttMessage = {
          topic,
          payload: payload.toString(),
          timestamp: new Date().toISOString(),
        };
        console.log('New Message:', newMessage);
        setMessages(prevMessages => [newMessage, ...prevMessages]);
      });

    } catch (error) {
      console.error('Failed to initialize MQTT client:', error);
      setConnectionStatus(ConnectionStatus.Error);
    }

    return () => {
      if (clientRef.current) {
        console.log('Cleaning up MQTT client.');
        clientRef.current.end();
        clientRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri]); // Only re-run if URI changes. Options are assumed to be stable.

  return { connectionStatus, messages, client: clientRef.current };
};
