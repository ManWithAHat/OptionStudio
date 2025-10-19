export type OptionType = 'call' | 'put';
export interface BinomialParams {
  S: number;
  K: number;
  T: number;
  r: number;
  sigma: number;
  steps: number;
  type: OptionType;
  american?: boolean;
}

export interface Node {
  price: number;
  option: number;
  exercise: boolean; // true if early exercise occurs
}

/**
 * Build recombining binomial tree and return a 2D array of nodes
 */
export function binomialTree({ S, K, T, r, sigma, steps, type, american=false }: BinomialParams): Node[][] {
  const dt = T/steps;
  const u = Math.exp(sigma*Math.sqrt(dt));
  const d = 1/u;
  const p = (Math.exp(r*dt)-d)/(u-d);

  // Initialize tree: array of arrays
  const tree: Node[][] = [];
  // Final nodes at maturity
  tree[steps] = [];
  for(let i=0;i<=steps;i++){
    const price = S*Math.pow(u,i)*Math.pow(d,steps-i);
    const option = type==='call'? Math.max(price-K,0) : Math.max(K-price,0);
    tree[steps].push({price, option, exercise: false});
  }

  // Backward induction
  for(let n=steps-1;n>=0;n--){
    tree[n]=[];
    for(let i=0;i<=n;i++){
      const up = tree[n+1][i+1].option;
      const down = tree[n+1][i].option;
      let optionPrice = Math.exp(-r*dt)*(p*up + (1-p)*down);
      let price = S*Math.pow(u,i)*Math.pow(d,n-i);
      let exercise = false;
      if(american){
        const intrinsic = type==='call'? Math.max(price-K,0) : Math.max(K-price,0);
        if(intrinsic>optionPrice){
          optionPrice = intrinsic;
          exercise=true;
        }
      }
      tree[n].push({price, option: optionPrice, exercise});
    }
  }

  return tree;
}
