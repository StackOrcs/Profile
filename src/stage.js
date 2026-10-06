const smooth=(value,low,high)=>{const t=Math.max(0,Math.min(1,(value-low)/(high-low)));return t*t*(3-2*t);};

// Phone scenes occupy real space in the story instead of covering its text.
export function createStage(settings){
  const slots=[...document.querySelectorAll('[data-scene-slot]')];
  const craftCopy=document.querySelector('#craft .chapter-copy');
  return(compact,position,height)=>{
    if(!compact)return {bounds:settings.desktopStage,opacity:1};
    if(position>=3){
      const top=Math.min(.77,Math.max(settings.mobileStage[1],(craftCopy.getBoundingClientRect().bottom+22)/height));
      return {bounds:[.08,top,.92,.94],opacity:1};
    }
    let best=null,visibility=0;
    for(const slot of slots){
      const rect=slot.getBoundingClientRect();
      const top=Math.max(height*.09,rect.top+12),bottom=Math.min(height*.94,rect.bottom-12);
      const fraction=Math.max(0,bottom-top)/rect.height;
      if(fraction>visibility){visibility=fraction;best=[.08,top/height,.92,bottom/height];}
    }
    return {bounds:best||settings.mobileStage,opacity:smooth(visibility,.25,.75)};
  };
}
