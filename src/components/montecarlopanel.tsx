import React, { useState, useEffect, useMemo } from 'react';
import Plot from 'react-plotly.js';
import * as Plotly from 'plotly.js';
import { simulatePaths, optionPayoffs, OptionType } from '../utils/monteCarlo';

const MonteCarloPanel: React.FC = () => {
  const [S, setS] = useState(100);
  const [K, setK] = useState(100);
  const [T, setT] = useState(1);
  const [r, setR] = useState(0.05);
  const [sigma, setSigma] = useState(0.2);
  const [steps, setSteps] = useState(50);
  const [paths, setPaths] = useState(100);
  const [type, setType] = useState<OptionType>('call');

  // Simulate paths whenever inputs change
  const [simulatedPaths, setSimulatedPaths] = useState<number[][]>([]);
  const [convergence, setConvergence] = useState<number[]>([]);

  useEffect(() => {
    const pathsArray = simulatePaths({ S, K, T, r, sigma, steps, paths, type });
    setSimulatedPaths(pathsArray);

    // Compute cumulative mean option value for convergence
    const payoffs = optionPayoffs(pathsArray, K, type);
    const cumMean: number[] = [];
    let sum = 0;
    payoffs.forEach((p, i) => {
      sum += p;
      cumMean.push(Math.exp(-r*T) * sum / (i+1));
    });
    setConvergence(cumMean);
  }, [S, K, T, r, sigma, steps, paths, type]);

  // Generate traces for animation
  const traces = useMemo<Plotly.Data[]>(() => {
    return simulatedPaths.map((path, idx) => ({
      x: Array.from({length: path.length}, (_, i) => i * T/steps),
      y: path,
      mode: 'lines',
      type: 'scatter',
      line: { width: 1, color: `rgba(59,130,246,${1/Math.sqrt(paths)})` },
      name: `Path ${idx+1}`
    } as Plotly.Data));
  }, [simulatedPaths, steps, T, paths]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Monte Carlo Simulator</h2>

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

      {/* Simulated paths */}
      <Plot
        data={ traces }
        layout={{
          title: { text: 'Simulated Stock Paths' },
          xaxis: { title: { text: 'Time (Years)' } },
          yaxis: { title: { text: 'Stock Price' } },
          showlegend: false,
          autosize: true,
        }}
        style={{ width:'100%', height:'400px' }}
      />

      {/* Convergence chart */}
      <Plot
        data={[{ x: Array.from({length: convergence.length}, (_, i) => i+1), y: convergence, type:'scatter', mode:'lines+markers', line:{color:'#10b981'}, name:'Estimated Option Price' }]}
        layout={{ title:{text:'Option Price Convergence'}, xaxis:{title:{text:'Number of Paths'}}, yaxis:{title:{text:'Discounted Expected Payoff'}} }}
        style={{ width:'100%', height:'300px' }}
      />

      {/* Educational write-up */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">📘 How to Read the Monte Carlo Simulation</h3>
        <p className="text-sm leading-relaxed">
          Each blue line shows a possible path of the stock price over time, generated randomly using the Geometric Brownian Motion formula.  
          The convergence plot below shows how the <strong>estimated option price</strong> stabilizes as more paths are simulated.  
          Adjust the number of steps, paths, volatility, or other inputs to see how uncertainty affects the option’s value.  
          The discount factor (exp(-r*T)) converts the average payoff into today’s price.
        </p>
      </div>
    </div>
  );
};

export default MonteCarloPanel;
