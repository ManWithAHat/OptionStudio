import { simulatePaths, OptionType } from './monteCarlo';

/**
 * Compute arithmetic average price for each path
 */
export function asianPayoffs(S: number, K: number, T: number, r: number, sigma: number, steps: number, paths: number, type: OptionType) {
  const simPaths = simulatePaths({ S, K, T, r, sigma, steps, paths, type });
  const payoffs = simPaths.map(path => {
    const avgPrice = path.reduce((a,b)=>a+b,0)/path.length;
    return type==='call'? Math.max(avgPrice-K,0) : Math.max(K-avgPrice,0);
  });
  return payoffs.map(p => p * Math.exp(-r*T)); // discounted payoff
}
export type { OptionType };

