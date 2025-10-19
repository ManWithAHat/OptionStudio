import { blackScholes } from './blackscholes';

export type OptionType = 'call' | 'put';

export function d1(S: number, K: number, T: number, r: number, sigma: number) {
  return (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
}

export function d2(S: number, K: number, T: number, r: number, sigma: number) {
  return d1(S, K, T, r, sigma) - sigma * Math.sqrt(T);
}

// Standard normal PDF
const phi = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
// CDF using error function
const Phi = (x: number) => 0.5 * (1 + erf(x / Math.SQRT2));
function erf(x: number) {
  const sign = Math.sign(x);
  x = Math.abs(x);
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const t = 1 / (1 + p * x);
  return sign * (1 - (((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x));
}

export function delta(S: number, K: number, T: number, r: number, sigma: number, type: OptionType) {
  const d_1 = d1(S,K,T,r,sigma);
  return type==='call'? Phi(d_1) : Phi(d_1)-1;
}

export function gamma(S: number, K: number, T: number, r: number, sigma: number) {
  const d_1 = d1(S,K,T,r,sigma);
  return phi(d_1)/(S*sigma*Math.sqrt(T));
}

export function vega(S: number, K: number, T: number, r: number, sigma: number) {
  const d_1 = d1(S,K,T,r,sigma);
  return S * phi(d_1) * Math.sqrt(T) / 100; // scaled per 1% vol change
}

export function theta(S: number, K: number, T: number, r: number, sigma: number, type: OptionType) {
  const d_1 = d1(S,K,T,r,sigma);
  const d_2 = d2(S,K,T,r,sigma);
  const first = -S * phi(d_1) * sigma / (2*Math.sqrt(T));
  const second = type==='call'? -r*K*Math.exp(-r*T)*Phi(d_2) : r*K*Math.exp(-r*T)*Phi(-d_2);
  return (first+second)/365; // per day
}

export function rho(S: number, K: number, T: number, r: number, sigma: number, type: OptionType) {
  const d_2 = d2(S,K,T,r,sigma);
  return type==='call'? K*T*Math.exp(-r*T)*Phi(d_2)/100 : -K*T*Math.exp(-r*T)*Phi(-d_2)/100;
}
