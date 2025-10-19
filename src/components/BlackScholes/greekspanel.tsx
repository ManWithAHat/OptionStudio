import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { delta, gamma, vega, theta, rho } from '../../utils/greeks';
import { OptionType } from '../../utils/greeks';

interface GreeksProps {
  S: number;
  T: number;
  r: number;
  sigma: number;
  optionType: OptionType;
}

/**
 * Plots Delta, Gamma, Vega, Theta, Rho vs Strike and explains each Greek
 */
const GreeksPanel: React.FC<GreeksProps> = ({ S, T, r, sigma, optionType }) => {
  const strikeRange = useMemo(() => {
    const minStrike = Math.max(1, S*0.5);
    const maxStrike = S*1.5;
    const step = (maxStrike - minStrike)/100;
    return Array.from({length:101},(_,i)=>minStrike+i*step);
  }, [S]);

  const greekData = useMemo(() => ({
    delta: strikeRange.map(K => delta(S,K,T,r,sigma,optionType)),
    gamma: strikeRange.map(K => gamma(S,K,T,r,sigma)),
    vega: strikeRange.map(K => vega(S,K,T,r,sigma)),
    theta: strikeRange.map(K => theta(S,K,T,r,sigma,optionType)),
    rho: strikeRange.map(K => rho(S,K,T,r,sigma,optionType))
  }), [S,T,r,sigma,optionType,strikeRange]);

  const greekExplanations: Record<string,string> = {
    Delta: "Measures how much the option price changes if the underlying spot price changes by $1.",
    Gamma: "Measures how much Delta changes as the spot price changes; it shows the curvature of the option price.",
    Vega: "Measures sensitivity of option price to changes in volatility.",
    Theta: "Measures how much the option price decays as time passes (time decay).",
    Rho: "Measures sensitivity of option price to changes in the risk-free interest rate."
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        {Object.entries(greekData).map(([name, values]) => (
          <Plot
            key={name}
            data={[{ x: strikeRange, y: values, type:'scatter', mode:'lines', name: name }]}
            layout={{
              title: { text: `${name.toUpperCase()} vs Strike` },
              xaxis: { title: { text: 'Strike' } },
              yaxis: { title: { text: name.toUpperCase() } },
              autosize: true,
              margin: {t:50,l:50,r:30,b:50},
            }}
            useResizeHandler
            style={{width:'100%',height:'300px'}}
          />
        ))}
      </div>

      {/* Explanations */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">📘 Greek Explanations</h3>
        <ul className="list-disc list-inside text-sm leading-relaxed">
          {Object.entries(greekExplanations).map(([name, desc]) => (
            <li key={name}><strong>{name}</strong>: {desc}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default GreeksPanel;