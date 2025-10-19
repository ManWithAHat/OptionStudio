/**
 * Generate mock implied volatility surface data
 * @returns strikes[], maturities[], volSurface[][] (2D array)
 */
export function generateMockIVSurface() {
  const strikes = Array.from({length:20},(_,i)=>80+i*5);  // 80,85,...175
  const maturities = Array.from({length:20},(_,i)=>0.1+i*0.2); // 0.1y,0.3y,...4y
  const volSurface = maturities.map(t => 
    strikes.map(K => 0.2 + 0.1*Math.exp(-((K-100)**2)/1000) + 0.05*t) // bell + slope
  );
  return { strikes, maturities, volSurface };
}
