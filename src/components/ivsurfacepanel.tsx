import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { generateMockIVSurface } from '../utils/ivsurface';

const IVSurfacePanel: React.FC = () => {
  const { strikes, maturities, volSurface } = useMemo(() => generateMockIVSurface(), []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Implied Volatility Surface</h2>

      <Plot
        data={[{
          z: volSurface,
          x: strikes,
          y: maturities,
          type: 'surface',
          colorscale: 'Viridis',
          contours: { z: { show: true, usecolormap: true, highlightcolor: "#42f5ef", project:{ z: true } } }
        } as any]}
        layout={{
          title: { text: 'IV Surface (Strike vs Maturity)' },
          scene: {
            xaxis: { title: { text: 'Strike K' } },
            yaxis: { title: { text: 'Time to Maturity T (years)' } },
            zaxis: { title: { text: 'Implied Volatility σ' } }
          },
          autosize: true
        }}
        style={{ width:'100%', height:'500px' }}
      />

      {/* Educational write-up */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">📘 How to Read the Implied Volatility Surface</h3>
        <p className="text-sm leading-relaxed">
          The surface shows how implied volatility varies across different strikes and maturities.  
          Horizontal axis = strike price, vertical axis = time to maturity, and the height = implied volatility.  
          Higher peaks indicate higher expected volatility for those strikes and expirations.  
          Traders use this surface to **price options consistently**, detect skews, and manage risk.  
          You can rotate, zoom, and inspect points interactively to explore the shape of the volatility surface.
        </p>
      </div>
    </div>
  );
};

export default IVSurfacePanel;
