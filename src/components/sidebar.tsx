import React from 'react';
import { FaCalculator, FaChartLine } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  return (
    <div className="w-1/4 bg-white shadow-lg p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">📊 Option Dashboard</h1>
      <nav className="flex flex-col gap-4">
        <button className="flex items-center gap-2 p-2 bg-blue-100 hover:bg-blue-200 rounded">
          {React.createElement(FaCalculator)} Black–Scholes
        </button>
        <button className="flex items-center gap-2 p-2 bg-blue-100 hover:bg-blue-200 rounded">
          {React.createElement(FaChartLine)} Monte Carlo
        </button>
      </nav>
      <div className="mt-auto text-sm text-gray-500">
        Inputs will appear here dynamically for selected model.
      </div>
    </div>
  );
};

export default Sidebar;
