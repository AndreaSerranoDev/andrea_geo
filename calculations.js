export function analyze(layers) {
  if (!layers.length) throw new Error('Add at least one soil layer.');
  for (const l of layers) {
    if (![l.thickness,l.vs,l.density].every(x=>Number.isFinite(x)&&x>0)) throw new Error('Thickness, shear-wave velocity, and density must be positive numbers.');
  }
  const depth=layers.reduce((s,l)=>s+l.thickness,0);
  const travelTime=layers.reduce((s,l)=>s+l.thickness/l.vs,0);
  let remaining=30, time30=0;
  for(const l of layers){const h=Math.min(remaining,l.thickness);time30+=h/l.vs;remaining-=h;if(remaining<=1e-9)break;}
  return {depth,travelTime,averageVs:depth/travelTime,vs30:remaining<=1e-9?30/time30:null,period:4*travelTime};
}
export const shearModulus = l => l.density*l.vs*l.vs/1e6;
