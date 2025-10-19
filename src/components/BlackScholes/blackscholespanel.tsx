import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import GreeksPanel from './greekspanel';
import { blackScholes } from '../../utils/blackscholes';

const BlackScholesPanel: React.FC = () => {
  const [S, setS] = useState(100);
  const [K, setK] = useState(100);
  const [T, setT] = useState(1);
  const [sigma, setSigma] = useState(0.2);
  const [r, setR] = useState(0.05);
  const [darkMode, setDarkMode] = useState(false);
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');

  // Strike range
  const strikeRange = useMemo(() => {
    const minStrike = Math.max(1, S * 0.5);
    const maxStrike = S * 1.5;
    const step = (maxStrike - minStrike) / 100;
    return Array.from({ length: 101 }, (_, i) => minStrike + i * step);
  }, [S]);

  // Prices
  const callPrices = useMemo(() => strikeRange.map(k => blackScholes({ S, K: k, T, r, sigma, type: 'call' })), [S, T, r, sigma, strikeRange]);
  const putPrices = useMemo(() => strikeRange.map(k => blackScholes({ S, K: k, T, r, sigma, type: 'put' })), [S, T, r, sigma, strikeRange]);

  // Payoff line
  const payoffLine = useMemo(() => strikeRange.map(k =>
    optionType === 'call' ? Math.max(S - k, 0) : Math.max(k - S, 0)
  ), [optionType, S, strikeRange]);

  // P/L shading: difference between payoff and current option price
  const plLine = useMemo(() => strikeRange.map((_, i) =>
    payoffLine[i] - (optionType === 'call' ? callPrices[i] : putPrices[i])
  ), [payoffLine, callPrices, putPrices, optionType]);

  const currentPrice = optionType === 'call'
    ? blackScholes({ S, K, T, r, sigma, type: 'call' })
    : blackScholes({ S, K, T, r, sigma, type: 'put' });

  return (
    <div className={darkMode ? 'bg-gray-900 text-white p-4 rounded-lg' : 'bg-white text-black p-4 rounded-lg'}>
      {/* Header + Dark Mode */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Black–Scholes Pricing Module</h2>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {[
          { label: 'Spot (S)', value: S, setter: setS },
          { label: 'Strike (K)', value: K, setter: setK },
          { label: 'Time (T, yrs)', value: T, setter: setT },
          { label: 'Volatility (σ)', value: sigma, setter: setSigma },
          { label: 'Rate (r)', value: r, setter: setR },
        ].map(({ label, value, setter }) => (
          <div key={label}>
            <label className="block text-sm mb-1">{label}</label>
            <input type="number" value={value} onChange={e => setter(Number(e.target.value))} className="w-full p-2 border rounded text-black" />
          </div>
        ))}
        <div>
          <label className="block text-sm mb-1">Option Type</label>
          <select value={optionType} onChange={e => setOptionType(e.target.value as 'call' | 'put')} className="w-full p-2 border rounded text-black">
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
            name: `${optionType.toUpperCase()} Payoff`,
            line: { color: '#10b981', width: 2, dash: 'dash' },
          },
          {
            x: strikeRange,
            y: plLine,
            type: 'scatter',
            mode: 'none',
            fill: 'tonexty',
            fillcolor: 'rgba(16,185,129,0.2)',
            name: 'Profit/Loss Zone',
          },
          {
            x: [K],
            y: [currentPrice],
            type: 'scatter',
            mode: 'text+markers',
            name: 'Current Price',
            marker: { color: '#facc15', size: 10 },
            text: [`${optionType} Price: ${currentPrice.toFixed(2)}`],
            textposition: 'top center',
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
        style={{ width: '100%', height: '600px' }}
        config={{ displayModeBar: true, responsive: true }}
      />

      {/* Explanation */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">📘 How to Read This Graph</h3>
        <p className="text-sm leading-relaxed">
          The horizontal axis shows <strong>strike prices (K)</strong>.  
          The blue and red curves are the <strong>current option prices</strong> for calls and puts, calculated with Black–Scholes.  
          The green dashed line is the <strong>payoff at maturity</strong>, showing what the option will be worth at expiry.  
          The shaded area represents <strong>profit/loss (P/L)</strong> relative to current price: above zero is potential profit, below is loss.  
          The yellow marker shows the current strike and option price.  
          Notice how call prices are higher for lower strikes and put prices are higher for higher strikes. The payoff line intersects the price curves, showing the difference between intrinsic value and market price (time value).
        </p>
      </div>
      {/* Greeks Panel */}
      <div className="mt-8">
        <GreeksPanel S={S} T={T} r={r} sigma={sigma} optionType={optionType} />
      </div>
    </div>
  );
};

export default BlackScholesPanel;
