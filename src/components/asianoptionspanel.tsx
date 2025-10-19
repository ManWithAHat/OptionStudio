import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { asianPayoffs, OptionType } from '../utils/asianoptions';

const AsianOptionPanel: React.FC = () => {
  const [S, setS] = useState(100);
  const [K, setK] = useState(100);
  const [T, setT] = useState(1);
  const [r, setR] = useState(0.05);
  const [sigma, setSigma] = useState(0.2);
  const [steps, setSteps] = useState(50);
  const [paths, setPaths] = useState(1000);
  const [type, setType] = useState<OptionType>('call');

  const payoffs = useMemo(() => asianPayoffs(S, K, T, r, sigma, steps, paths, type), [S,K,T,r,sigma,steps,paths,type]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Asian Option Simulator</h2>

      {/* Inputs */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {[
          { label:'Spot', value:S, setter:setS },
          { label:'Strike', value:K, setter:setK },
          { label:'Time', value:T, setter:setT },
          { label:'Vol', value:sigma, setter:setSigma },
          { label:'Rate', value:r, setter:setR },
          { label:'Steps', value:steps, setter:setSteps },
          { label:'Paths', value:paths, setter:setPaths },
        ].map(({ label, value, setter }) => (
          <div key={label}>
            <label className="block text-sm mb-1">{label}</label>
            <input type="number" value={value} onChange={e => setter(Number(e.target.value))} className="w-full p-1 border rounded"/>
          </div>
        ))}
        <div>
          <label className="block text-sm mb-1">Option Type</label>
          <select value={type} onChange={e => setType(e.target.value as OptionType)} className="w-full p-1 border rounded">
            <option value="call">Call</option>
            <option value="put">Put</option>
          </select>
        </div>
      </div>

      {/* Histogram of Payoffs */}
      <Plot
        data={[{
          x: payoffs,
          type: 'histogram',
          marker: { color: '#3b82f6' },
          nbinsx: 50
        } as any]}
        layout={{
          title: { text: 'Distribution of Asian Option Payoffs' },
          xaxis: { title: { text: 'Discounted Payoff' } },
          yaxis: { title: { text: 'Frequency' } },
          autosize: true
        }}
        style={{ width:'100%', height:'400px' }}
      />

      {/* Educational Write-Up */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">📘 How to Read the Asian Option Histogram</h3>
        <p className="text-sm leading-relaxed">
          Each bar in the histogram represents how often a certain payoff occurred across all simulated paths.  
          The payoff is based on the <strong>average price of the stock</strong> over the lifetime of the option.  
          Call options earn money if the average price is above the strike; put options earn money if it is below.  
          Adjusting volatility, steps, or the number of paths shows how the payoff distribution changes.  
          This visualization helps you understand the uncertainty and risk profile of Asian options.
        </p>
      </div>
    </div>
  );
};

export default AsianOptionPanel;
