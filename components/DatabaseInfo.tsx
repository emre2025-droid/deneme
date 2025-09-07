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
          <p><strong className="font-semibold text-white">Local Storage:</strong> The most recent messages are saved in your browser. This provides offline access and persistence across page reloads.</p>
        </div>
        <div className="border-t border-gray-700 my-2"></div>
        <div className="flex items-start space-x-3">
           <svg className="h-5 w-5 mr-1 text-blue-400 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 11v5" />
            <path d="M12 17a1 1 0 100-2 1 1 0 000 2z" />
            <path d="M2.5 12.5a10 10 0 1119 0 10 10 0 01-19 0z" />
          </svg>
          <div>
            <p><strong className="font-semibold text-white">PostgreSQL Backend:</strong> The included Node.js backend (in <code className="bg-gray-700 text-cyan-300 px-1 rounded-sm text-sm">/backend</code>) saves all incoming MQTT messages to a PostgreSQL database.</p>
            <p className="text-sm text-gray-400 mt-2">
              <strong className="text-white">New:</strong> When the backend is running, this dashboard will automatically load the 50 most recent messages from the database to populate the initial message feed.
            </p>
            <p className="text-sm text-gray-400 mt-1">Make sure the backend service is running to enable historical data loading and permanent storage.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseInfo;
