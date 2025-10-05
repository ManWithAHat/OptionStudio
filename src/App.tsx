import React from 'react';
import Plot from 'react-plotly.js';

/**
 * Root component with basic dashboard layout.
 * Left: placeholder for inputs
 * Right: placeholder Plotly chart
 */
function App() {
  return (
    <div className="flex h-screen">
      {/* Sidebar for inputs */}
      <div className="w-1/4 bg-white shadow-lg p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">📊 Option Pricing Dashboard</h1>
        <p className="text-sm text-gray-600">Adjust parameters and explore pricing models interactively.</p>
      </div>

      {/* Main content for charts */}
      <div className="flex-1 p-4 overflow-auto">
        <Plot
          data={[
            {
              x: [1, 2, 3, 4],
              y: [10, 15, 13, 17],
              type: 'scatter',
              mode: 'lines+markers',
            },
          ]}
          layout={{
            title: { text: 'Sample Plotly Chart' },
            autosize: true,
          }}
          useResizeHandler
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}

export default App;