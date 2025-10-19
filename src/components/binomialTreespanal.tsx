import React, { useState } from 'react';
import { binomialTree, Node, OptionType } from '../utils/binomialTrees';
import Plot from 'react-plotly.js';

const BinomialTreePanel: React.FC = () => {
  const [S,setS]=useState(100);
  const [K,setK]=useState(100);
  const [T,setT]=useState(1);
  const [sigma,setSigma]=useState(0.2);
  const [r,setR]=useState(0.05);
  const [steps,setSteps]=useState(5);
  const [type,setType]=useState<OptionType>('call');
  const [american,setAmerican]=useState(true);

  const tree: Node[][] = binomialTree({S,K,T,r,sigma,steps,type,american});

  // Flatten for Plotly scatter
  const x: number[] = [];
  const y: number[] = [];
  const text: string[] = [];
  const markerColor: string[] = [];
  tree.forEach((level,n)=>{
    level.forEach((node,i)=>{
      x.push(n);
      y.push(i);
      text.push(`Price: ${node.price.toFixed(2)}<br>Option: ${node.option.toFixed(2)}${node.exercise?' ✅':' '}`);
      markerColor.push(node.exercise?'green':'blue');
    });
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Binomial Tree Pricing</h2>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {[
          {label:'Spot',val:S,set:setS},
          {label:'Strike',val:K,set:setK},
          {label:'Time',val:T,set:setT},
          {label:'Vol',val:sigma,set:setSigma},
          {label:'Rate',val:r,set:setR},
          {label:'Steps',val:steps,set:setSteps},
        ].map(({label,val,set})=>(
          <div key={label}>
            <label className="block text-sm mb-1">{label}</label>
            <input type="number" value={val} onChange={e=>set(Number(e.target.value))} className="w-full p-1 border rounded"/>
          </div>
        ))}
        <div>
          <label className="block text-sm mb-1">American?</label>
          <input type="checkbox" checked={american} onChange={e=>setAmerican(e.target.checked)} className="w-4 h-4"/>
        </div>
        <div>
          <label className="block text-sm mb-1">Type</label>
          <select value={type} onChange={e=>setType(e.target.value as OptionType)} className="w-full p-1 border rounded">
            <option value="call">Call</option>
            <option value="put">Put</option>
          </select>
        </div>
      </div>

      <Plot
        data={[{
          x,
          y,
          text,
          mode:'text+markers',
          type:'scatter',
          marker:{color:markerColor,size:12},
          textposition:'top center',
        }]}
        layout={{
          title:{text:'Binomial Tree (x=step, y=node)'},
          xaxis:{title:{text:'Time Step'}},
          yaxis:{title:{text:'Node Index'}},
          autosize:true
        }}
        style={{width:'100%',height:'500px'}}
      />
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
  <h3 className="text-lg font-semibold mb-2">📘 How to Read the Binomial Tree</h3>
  <p className="text-sm leading-relaxed">
    Each point in the chart represents a possible price of the underlying asset at a given time step.  
    Horizontal axis = <strong>time steps</strong>, vertical axis = <strong>node index</strong>.  
    Blue nodes show continuation, green nodes show <strong>early exercise</strong> (American options).  
    Hover over a node to see price & option value. Adjust spot, strike, volatility, rate, steps, and option type to explore.
  </p>
</div>
    </div>
  );
};

export default BinomialTreePanel;
