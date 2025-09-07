
import React from 'react';
import { MqttMessage } from '../types';

interface MessageItemProps {
  message: MqttMessage;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div className="bg-gray-900/50 p-4 rounded-md border border-gray-700 animate-fade-in">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-xs text-gray-400">Topic:</span>
          <p className="font-mono text-cyan-300 break-all">{message.topic}</p>
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap pl-4">{new Date(message.timestamp).toLocaleTimeString()}</span>
      </div>
      <div>
        <span className="text-xs text-gray-400">Payload:</span>
        <pre className="bg-gray-800 p-3 rounded mt-1 text-gray-200 text-sm whitespace-pre-wrap break-all font-mono">
          <code>{message.payload}</code>
        </pre>
      </div>
    </div>
  );
};

export default MessageItem;
