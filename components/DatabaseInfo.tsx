
import React from 'react';

const DatabaseInfo: React.FC = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7v4c0 2.21 3.582 4 8 4s8-1.79 8-4V7" />
        </svg>
        Data Persistence
      </h2>
      <div className="space-y-3 text-gray-300">
        <div className="flex items-start space-x-3">
          <span className="text-green-400 mt-1">✓</span>
          <p><strong className="font-semibold text-white">Local Storage:</strong> Messages are temporarily saved in your browser's local storage.</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="text-blue-400 mt-1">→</span>
          <p><strong className="font-semibold text-white">PostgreSQL:</strong> To permanently store data in PostgreSQL, a backend service (e.g., a Node.js API) is required. This service would subscribe to the MQTT topic and insert messages into the database.</p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseInfo;
