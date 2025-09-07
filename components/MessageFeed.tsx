
import React from 'react';
import { MqttMessage } from '../types';
import MessageItem from './MessageItem';

interface MessageFeedProps {
  messages: MqttMessage[];
}

const MessageFeed: React.FC<MessageFeedProps> = ({ messages }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg h-full max-h-[70vh] flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-cyan-400">Message Feed</h2>
        <p className="text-sm text-gray-400">Showing last {messages.length} messages. New messages appear at the top.</p>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Waiting for messages...
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageItem key={`${msg.timestamp}-${index}`} message={msg} />
          ))
        )}
      </div>
    </div>
  );
};

export default MessageFeed;
