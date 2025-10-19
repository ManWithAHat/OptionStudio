import React from 'react';
import { FaCalculator, FaChartLine, FaProjectDiagram } from 'react-icons/fa';

interface SidebarProps {
  onSelectTool: (tool: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectTool }) => {
  return (
    <nav className="flex flex-col gap-4 p-6 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Option Studio</h1>
      
      <button
        className="flex items-center gap-2 p-2 bg-blue-100 hover:bg-blue-200 rounded"
        onClick={() => onSelectTool('blackScholes')}
      >
        <FaCalculator /> Black–Scholes
      </button>

      <button
        className="flex items-center gap-2 p-2 bg-blue-100 hover:bg-blue-200 rounded"
        onClick={() => onSelectTool('monteCarlo')}
      >
        <FaChartLine /> Monte Carlo
      </button>

      <button
        className="flex items-center gap-2 p-2 bg-blue-100 hover:bg-blue-200 rounded"
        onClick={() => onSelectTool('binomialTree')}
      >
        <FaProjectDiagram /> Binomial Tree
      </button>
            <button
        className="flex items-center gap-2 p-2 bg-blue-100 hover:bg-blue-200 rounded"
        onClick={() => onSelectTool('asianOption')}
      >
        <FaProjectDiagram /> Asian Option
      </button>
      <button
  className="flex items-center gap-2 p-2 bg-blue-100 hover:bg-blue-200 rounded"
  onClick={() => onSelectTool('ivSurface')}
>
  <FaChartLine /> IV Surface
</button>

      {/* Add more buttons for Asian, Vol Surface later */}
    </nav>
  );
};

export default Sidebar;
