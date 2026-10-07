export const smooth=(value,low,high)=>{const t=Math.max(0,Math.min(1,(value-low)/(high-low)));return t*t*(3-2*t);};

// Identity → craft → connected systems → infrastructure → decisions → protection.
// The real projects are a deliberate media interval; the closing has a new subject.
export function directScene(position){
  const intoSystems=smooth(position,3.76,3.98),outOfSystems=smooth(position,7.55,7.92);
  const intoPeople=smooth(position,11.94,12.00),intoClosing=smooth(position,12.80,13.00);
  return {
    brand:(1-intoSystems)+intoClosing,
    systems:intoSystems*(1-outOfSystems),
    partnership:intoPeople*(1-intoClosing),
    opacity:position<8?1-outOfSystems:intoPeople,
    division:position<4.1?smooth(position,3.04,3.45):0,
    form:Math.max(0,Math.min(3,position-4)),
    kind:position<3?'identity':position<3.76?'deconstruction':position<4.8?'connections':position<5.8?'infrastructure':position<6.8?'decisions':position<7.92?'protection':position<11.94?'work':position<12.8?'partnership':'closing'
  };
}
