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
      <div className="space-y-4 text-gray-300">
        <div className="flex items-start space-x-3">
          <span className="text-green-400 mt-1 font-bold">✓</span>
          <p><strong className="font-semibold text-white">Local Storage:</strong> Recent messages are temporarily saved in your browser to maintain the feed across page reloads.</p>
        </div>
        <div className="border-t border-gray-700 my-2"></div>
        <div className="flex items-start space-x-3">
           <svg className="h-5 w-5 mr-1 text-blue-400 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 11v5" />
            <path d="M12 17a1 1 0 100-2 1 1 0 000 2z" />
            <path d="M2.5 12.5a10 10 0 1119 0 10 10 0 01-19 0z" />
          </svg>
          <div>
            <p><strong className="font-semibold text-white">PostgreSQL Backend:</strong> This project includes a Node.js backend service located in the <code className="bg-gray-700 text-cyan-300 px-1 rounded-sm text-sm">/backend</code> directory.</p>
            <p className="text-sm text-gray-400 mt-2">When running, this service subscribes to the MQTT topic and permanently stores all messages in a PostgreSQL database.</p>
            <p className="text-sm text-gray-400 mt-1">To use it, you must configure your credentials in a <code className="bg-gray-700 text-cyan-300 px-1 rounded-sm text-sm">.env</code> file and run the service.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseInfo;
