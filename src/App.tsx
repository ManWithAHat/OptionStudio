import React from 'react';
import Sidebar from './components/sidebar';
import MainPanel from './components/MainPanel';

/**
 * Root App with flex layout: sidebar left, main panel right
 */
function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <MainPanel />
    </div>
  );
}

export default App;