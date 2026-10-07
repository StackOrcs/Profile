const smooth=(value,low,high)=>{const t=Math.max(0,Math.min(1,(value-low)/(high-low)));return t*t*(3-2*t);};

export function sampleStage(stages,position){
  let index=0;
  while(index<stages.length-2&&position>stages[index+1].at)index++;
  const from=stages[index],to=stages[index+1],t=smooth(position,from.at,to.at);
  return from.bounds.map((value,axis)=>value+(to.bounds[axis]-value)*t);
}

// Desktop follows a continuous safe gutter. Phones follow actual layout space.
export function createStage(settings){
  const slots=[...document.querySelectorAll('[data-scene-slot]')];
  const craft=document.querySelector('#craft');
  const craftCopy=craft.querySelector('.chapter-copy');
  return(compact,position,height)=>{
    if(!compact)return {bounds:sampleStage(settings.stages,position),opacity:1};
    if(position>=3&&position<4){
      const rect=craft.getBoundingClientRect();
      const top=Math.max(settings.mobileStage[1],(craftCopy.getBoundingClientRect().bottom+22)/height);
      const bottom=Math.min(.94,(rect.bottom-30)/height);
      if(bottom>top+.10)return {bounds:[.08,top,.92,bottom],opacity:smooth(bottom-top,.10,.25)};
    }
    let best=null,visibility=0;
    for(const slot of slots){
      const rect=slot.getBoundingClientRect();
      if(!rect.height||rect.bottom<=0||rect.top>=height)continue;
      const top=Math.max(height*.09,rect.top+12),bottom=Math.min(height*.94,rect.bottom-12);
      const fraction=Math.max(0,bottom-top)/rect.height;
      if(fraction>visibility){visibility=fraction;best=[.08,top/height,.92,bottom/height];}
    }
    return {bounds:best||settings.mobileStage,opacity:smooth(visibility,.25,.75)};
  };
}
