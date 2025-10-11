/**
 * Black–Scholes pricing and Greeks for European Call/Put options.
 * All inputs are numbers; T in years.
 */
export type OptionType = 'call' | 'put';

export interface BSParams {
  S: number;      // spot price
  K: number;      // strike price
  T: number;      // time to maturity (years)
  r: number;      // risk-free rate
  sigma: number;  // volatility
  type: OptionType;
}

const phi = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
const Phi = (x: number) => 0.5 * (1 + erf(x / Math.SQRT2));

// error function approximation for Phi
function erf(x: number): number {
  // Abramowitz-Stegun approximation
  const sign = Math.sign(x);
  x = Math.abs(x);
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

export function blackScholes({ S, K, T, r, sigma, type }: BSParams) {
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  if (type === 'call') {
    return S * Phi(d1) - K * Math.exp(-r * T) * Phi(d2);
  } else {
    return K * Math.exp(-r * T) * Phi(-d2) - S * Phi(-d1);
  }
}
