import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useMqtt } from './hooks/useMqtt';
import { ConnectionStatus } from './types';
import Header from './components/Header';
import StatusDisplay from './components/StatusDisplay';
import MessageFeed from './components/MessageFeed';
import { MqttMessage } from './types';
import DatabaseInfo from './components/DatabaseInfo';

// IMPORTANT: This file contains credentials. In a production environment,
// these should be managed securely, for example, through environment variables
// or a secure authentication mechanism, not hardcoded in the source.
const MQTT_BROKER_URL = 'wss://a1ad4768bc2847efa4eec689fee6b7bd.s1.eu.hivemq.cloud:8884/mqtt';
const MQTT_USERNAME = 'Aquaa';
const MQTT_PASSWORD = 'OqpsHE#47oT1.BN0&$yh';
const LOCAL_STORAGE_KEY = 'mqtt-messages';
const API_BASE_URL = 'http://localhost:3001'; // Backend API URL


const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('sensor/data');
  const [subscribedTopic, setSubscribedTopic] = useState<string>('');
  const [messages, setMessages] = useState<MqttMessage[]>([]);

  // Memoize the options object to prevent re-creating it on every render.
  // This stabilizes the dependency for the useMqtt hook, preventing connection loops.
  const mqttOptions = useMemo(() => ({
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    clean: true,
    connectTimeout: 8000, // Increased timeout for more reliability
    reconnectPeriod: 1000,
  }), []);

  // Callback for when a new message is received from MQTT
  const onMessageReceived = useCallback((message: MqttMessage) => {
    // Add new message to the top, and keep the list at a max of 50 items
    setMessages(prevMessages => [message, ...prevMessages.slice(0, 49)]);
  }, []);

  const { connectionStatus, client } = useMqtt({
    uri: MQTT_BROKER_URL,
    options: mqttOptions,
    onMessage: onMessageReceived,
  });

  // Load historical messages from the backend on initial render
  useEffect(() => {
    const fetchHistoricalMessages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/messages`);
        if (response.ok) {
          const historicalMessages: MqttMessage[] = await response.json();
          setMessages(historicalMessages);
          console.log(`Successfully loaded ${historicalMessages.length} historical messages from the database.`);
        } else {
          console.warn('Backend not available or failed to fetch historical messages. Showing real-time data only.');
        }
      } catch (error) {
        console.warn('Could not connect to backend for historical messages. Is the backend service running?');
      }
    };

    fetchHistoricalMessages();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save messages to local storage whenever they change
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages.slice(0, 50)));
      }
    } catch (error) {
      console.error("Failed to save messages to local storage:", error);
    }
  }, [messages]);

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const handleSubscribe = () => {
    if (client && topic) {
      if (subscribedTopic && subscribedTopic !== topic) {
        client.unsubscribe(subscribedTopic, (err) => {
          if (err) console.error(`Unsubscribe error:`, err);
        });
      }
      client.subscribe(topic, (err) => {
        if (!err) {
          setSubscribedTopic(topic);
          console.log(`Subscribed to ${topic}`);
        } else {
          console.error(`Subscription error:`, err);
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col space-y-6">
            <StatusDisplay status={connectionStatus} />
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">Topic Subscription</h2>
              <div className="flex flex-col space-y-3">
                <input
                  type="text"
                  value={topic}
                  onChange={handleTopicChange}
                  placeholder="e.g. home/livingroom/temp"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  onClick={handleSubscribe}
                  disabled={!client || !topic || connectionStatus !== ConnectionStatus.Connected}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
                >
                  {subscribedTopic === topic ? 'Resubscribe' : 'Subscribe'}
                </button>
              </div>
              {subscribedTopic && (
                <p className="text-sm text-gray-400 mt-3">Currently subscribed to: <span className="font-mono text-cyan-300">{subscribedTopic}</span></p>
              )}
            </div>

            <DatabaseInfo />
          </div>

          <div className="lg:col-span-2">
            <MessageFeed messages={messages} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;