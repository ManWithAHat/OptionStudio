import React from 'react';
import Plot from 'react-plotly.js';

/**
 * Main content panel for charts and visuals
 */
const MainPanel: React.FC = () => {
  return (
    <div className="flex-1 p-6 overflow-auto">
      <Plot
        data={[
          {
            x: [0, 1, 2, 3],
            y: [0, 2, 3, 5],
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'blue' },
          },
        ]}
        layout={{
          title: {text:'Interactive Chart Panel'},
          autosize: true,
          margin: { t: 50, r: 30, b: 50, l: 50 },
        }}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default MainPanel;
