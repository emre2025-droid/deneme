
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center border-b-2 border-cyan-500/30 pb-4">
      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
        Aqua <span className="text-cyan-400">MQTT</span> Real-time Dashboard
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Live message feed from your MQTT broker.
      </p>
    </header>
  );
};

export default Header;
