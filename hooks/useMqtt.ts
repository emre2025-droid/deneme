import { useState, useEffect, useRef } from 'react';
import type { MqttClient, IClientOptions } from 'mqtt';
import { MqttMessage, ConnectionStatus } from '../types';

interface MqttHookOptions {
  uri: string;
  options?: IClientOptions;
  onMessage?: (message: MqttMessage) => void;
}

// Note: The global `mqtt` object comes from the script included in index.html
declare global {
  interface Window {
    mqtt: any;
  }
}

export const useMqtt = ({ uri, options = {}, onMessage }: MqttHookOptions) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.Disconnected);
  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {
    if (clientRef.current) {
      // Clean up previous connection before creating a new one
      clientRef.current.end();
      clientRef.current = null;
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

      client.on('message', (topic: string, payload: { toString: () => string }) => {
        const newMessage: MqttMessage = {
          topic,
          payload: payload.toString(),
          timestamp: new Date().toISOString(),
        };
        // Instead of managing state here, call the provided callback
        if (onMessage) {
          onMessage(newMessage);
        }
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
    // Re-run effect if uri or callback changes. `options` are assumed to be stable.
  }, [uri, onMessage, options]);

  return { connectionStatus, client: clientRef.current };
};
