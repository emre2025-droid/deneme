
import React from 'react';
import { ConnectionStatus } from '../types';

interface StatusDisplayProps {
  status: ConnectionStatus;
}

const statusStyles: Record<ConnectionStatus, { text: string; bg: string; dot: string }> = {
  [ConnectionStatus.Connected]: { text: 'text-green-300', bg: 'bg-green-500/10', dot: 'bg-green-500' },
  [ConnectionStatus.Connecting]: { text: 'text-yellow-300', bg: 'bg-yellow-500/10', dot: 'bg-yellow-500 animate-pulse' },
  [ConnectionStatus.Reconnecting]: { text: 'text-yellow-300', bg: 'bg-yellow-500/10', dot: 'bg-yellow-500 animate-pulse' },
  [ConnectionStatus.Disconnected]: { text: 'text-gray-400', bg: 'bg-gray-500/10', dot: 'bg-gray-500' },
  [ConnectionStatus.Error]: { text: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-500' },
};

const StatusDisplay: React.FC<StatusDisplayProps> = ({ status }) => {
  const { text, bg, dot } = statusStyles[status] || statusStyles[ConnectionStatus.Disconnected];

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg shadow-lg ${bg}`}>
      <span className="font-semibold text-white">Broker Status</span>
      <div className="flex items-center space-x-2">
        <span className={`h-3 w-3 rounded-full ${dot}`}></span>
        <span className={`font-mono font-bold ${text}`}>{status}</span>
      </div>
    </div>
  );
};

export default StatusDisplay;
