import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { blackScholes } from '../../utils/blackscholes';

const BlackScholesPanel: React.FC = () => {
  const [S, setS] = useState(100);
  const [K, setK] = useState(100);
  const [T, setT] = useState(1);
  const [sigma, setSigma] = useState(0.2);
  const [r, setR] = useState(0.05);
  const [darkMode, setDarkMode] = useState(false);
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');

  // Generate strike range
  const strikeRange = useMemo(() => {
    const minStrike = Math.max(1, S * 0.5);
    const maxStrike = S * 1.5;
    const step = (maxStrike - minStrike) / 100;
    const arr = [];
    for (let k = minStrike; k <= maxStrike; k += step) arr.push(k);
    return arr;
  }, [S]);

  // Price curves
  const callPrices = useMemo(
    () => strikeRange.map(k => blackScholes({ S, K: k, T, r, sigma, type: 'call' })),
    [S, T, r, sigma, strikeRange]
  );
  const putPrices = useMemo(
    () => strikeRange.map(k => blackScholes({ S, K: k, T, r, sigma, type: 'put' })),
    [S, T, r, sigma, strikeRange]
  );

  // Payoff curve at maturity
  const payoffLine = useMemo(() => {
    if (optionType === 'call') {
      return strikeRange.map(k => Math.max(S - k, 0));
    } else {
      return strikeRange.map(k => Math.max(k - S, 0));
    }
  }, [optionType, S, strikeRange]);

  // Current prices for marker
  const currentCallPrice = blackScholes({ S, K, T, r, sigma, type: 'call' });
  const currentPutPrice = blackScholes({ S, K, T, r, sigma, type: 'put' });

  return (
    <div className={darkMode ? 'bg-gray-900 text-white p-4 rounded-lg' : 'bg-white text-black p-4 rounded-lg'}>
      {/* Header + Dark Mode */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Black–Scholes Pricing Module</h2>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div>
          <label className="block text-sm mb-1">Spot (S)</label>
          <input type="number" value={S} onChange={e => setS(Number(e.target.value))}
            className="w-full p-2 border rounded text-black" />
        </div>
        <div>
          <label className="block text-sm mb-1">Strike (K)</label>
          <input type="number" value={K} onChange={e => setK(Number(e.target.value))}
            className="w-full p-2 border rounded text-black" />
        </div>
        <div>
          <label className="block text-sm mb-1">Time (T, yrs)</label>
          <input type="number" step="0.1" value={T} onChange={e => setT(Number(e.target.value))}
            className="w-full p-2 border rounded text-black" />
        </div>
        <div>
          <label className="block text-sm mb-1">Volatility (σ)</label>
          <input type="number" step="0.01" value={sigma} onChange={e => setSigma(Number(e.target.value))}
            className="w-full p-2 border rounded text-black" />
        </div>
        <div>
          <label className="block text-sm mb-1">Rate (r)</label>
          <input type="number" step="0.01" value={r} onChange={e => setR(Number(e.target.value))}
            className="w-full p-2 border rounded text-black" />
        </div>
        <div>
          <label className="block text-sm mb-1">Option Type</label>
          <select
            value={optionType}
            onChange={e => setOptionType(e.target.value as 'call' | 'put')}
            className="w-full p-2 border rounded text-black"
          >
            <option value="call">Call</option>
            <option value="put">Put</option>
          </select>
        </div>
      </div>

      {/* Plot */}
      <Plot
        data={[
          {
            x: strikeRange,
            y: callPrices,
            type: 'scatter',
            mode: 'lines',
            name: 'Call Price',
            line: { color: '#3b82f6', width: 2 },
          },
          {
            x: strikeRange,
            y: putPrices,
            type: 'scatter',
            mode: 'lines',
            name: 'Put Price',
            line: { color: '#ef4444', width: 2, dash: 'dot' },
          },
          {
            x: strikeRange,
            y: payoffLine,
            type: 'scatter',
            mode: 'lines',
            name: `${optionType.toUpperCase()} Payoff at Maturity`,
            line: { color: '#10b981', width: 2, dash: 'dash' },
          },
          {
            x: [K],
            y: [currentCallPrice],
            type: 'scatter',
            mode: 'text+markers',
            name: 'Current Call',
            marker: { color: '#3b82f6', size: 10 },
            text: [`Call: ${currentCallPrice.toFixed(2)}`],
            textposition: 'top center',
          },
          {
            x: [K],
            y: [currentPutPrice],
            type: 'scatter',
            mode: 'text+markers',
            name: 'Current Put',
            marker: { color: '#ef4444', size: 10 },
            text: [`Put: ${currentPutPrice.toFixed(2)}`],
            textposition: 'bottom center',
          },
        ]}
        layout={{
          title: { text: `Option Prices & Payoff vs Strike` },
          xaxis: { title: { text: 'Strike (K)' }, gridcolor: darkMode ? '#444' : '#ddd' },
          yaxis: { title: { text: 'Price' }, gridcolor: darkMode ? '#444' : '#ddd' },
          plot_bgcolor: darkMode ? '#1f2937' : '#fff',
          paper_bgcolor: darkMode ? '#111827' : '#fff',
          font: { color: darkMode ? '#e5e7eb' : '#000' },
          legend: { orientation: 'h', y: -0.25 },
          margin: { t: 60, r: 30, b: 60, l: 60 },
        }}
        useResizeHandler
        style={{ width: '100%', height: '550px' }}
        config={{ displayModeBar: true, responsive: true }}
      />

      {/* Explanation Section */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">📘 How to Read This Graph</h3>
        <p className="text-sm leading-relaxed">
          The horizontal axis shows different <strong>strike prices (K)</strong>, which are the fixed prices at which you can buy (call) or sell (put) the underlying asset in the future.  
          The blue and red curves show the <strong>current market price</strong> of call and put options at each strike, using the Black–Scholes model.  
          The green dashed line shows the <strong>payoff at maturity</strong>: this is what the option is worth at expiry, not today.  
          Notice how call prices are higher for lower strikes (because it's cheaper to buy), while put prices are higher for higher strikes (because it's more valuable to sell at a high price).  
          The model price curves are always above the payoff line — because they include <strong>time value</strong> (the chance that the option will become more valuable before maturity).  
        </p>
      </div>
    </div>
  );
};

export default BlackScholesPanel;
