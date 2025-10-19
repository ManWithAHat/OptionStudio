import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import BlackScholesPanel from './components/BlackScholes/blackscholespanel';
import BinomialTreePanel from './components/binomialTreespanal';
import MonteCarloPanel from './components/montecarlopanel';
import AsianOptionsPanel from './components/asianoptionspanel';
import IVSurfacePanel from './components/ivsurfacepanel';

const App: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string>('blackScholes');

  const renderTool = () => {
    switch (selectedTool) {
      case 'blackScholes':
        return <BlackScholesPanel />;
      case 'binomialTree':
        return <BinomialTreePanel />;
      case 'monteCarlo':
        return <MonteCarloPanel />;
      case 'asianOption':
        return <AsianOptionsPanel />;
      case 'ivSurface':
        return <IVSurfacePanel />;
      default:
        return <div className="p-4">Select a tool</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
            {/* Sidebar navigation */}
      <div className="w-64 border-l border-gray-300 dark:border-gray-700">
        <Sidebar onSelectTool={setSelectedTool} />
      </div>
      {/* Main panel */}
      <div className="flex-1 p-6 overflow-auto">
        {renderTool()}
      </div>


    </div>
  );
};

export default App;
