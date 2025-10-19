export type OptionType = 'call' | 'put';

export interface MonteCarloParams {
  S: number;
  K: number;
  T: number;
  r: number;
  sigma: number;
  steps: number;
  paths: number;
  type: OptionType;
}

// Simulate GBM paths
export function simulatePaths({ S, T, r, sigma, steps, paths }: MonteCarloParams) {
  const dt = T / steps;
  const pathsArray: number[][] = [];
  for (let i = 0; i < paths; i++) {
    const path: number[] = [S];
    for (let j = 1; j <= steps; j++) {
      const z = Math.random() * 2 - 1; // simple standard normal approx
      const prev = path[j - 1];
      const next = prev * Math.exp((r - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * z);
      path.push(next);
    }
    pathsArray.push(path);
  }
  return pathsArray;
}

// Compute option payoff for final step
export function optionPayoffs(paths: number[][], K: number, type: OptionType) {
  return paths.map(path => type === 'call' ? Math.max(path[path.length-1] - K, 0) : Math.max(K - path[path.length-1], 0));
}
