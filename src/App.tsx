import React from 'react';
import Sidebar from './components/sidebar';
import BlackScholesPanel from './components/BlackScholes/blackscholespanel';

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <BlackScholesPanel />
      </div>
    </div>
  );
}

export default App;