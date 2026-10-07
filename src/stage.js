import {signalConfig} from './signal-config.js';
import {sampleSignal} from './signal-state.js';
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
  const signal=document.querySelector('#clarity'),signalCopy=signal.querySelector('.signal-copy');
  const contactSlot=document.querySelector('#contact [data-scene-slot]');
  return(compact,position,height)=>{
    if(!compact){
      const bounds=sampleStage(settings.stages,position),weight=sampleSignal(position,signal.offsetHeight,height).weight;
      return {bounds:bounds.map((value,index)=>value+(signalConfig.desktopStage[index]-value)*weight),opacity:1};
    }
    if(position>=2&&position<3){
      const rect=signal.getBoundingClientRect(),top=Math.max(.40,(signalCopy.getBoundingClientRect().bottom+18)/height),bottom=Math.min(.94,(rect.bottom-24)/height);
      if(bottom>top+.10)return {bounds:[.08,top,.92,bottom],opacity:smooth(bottom-top,.10,.25)};
    }
    if(position>=3&&position<4){
      const rect=craft.getBoundingClientRect();
      const top=Math.max(settings.mobileStage[1],(craftCopy.getBoundingClientRect().bottom+22)/height);
      const bottom=Math.min(.94,(rect.bottom-30)/height);
      if(bottom>top+.10)return {bounds:[.08,top,.92,bottom],opacity:smooth(bottom-top,.10,.25)};
    }
    if(position>=13&&contactSlot){
      // Hold the actual contact sculpture as its slot scrolls out of view.
      // The finale can then move that same frame instead of restoring it anew.
      const rect=contactSlot.getBoundingClientRect();
      const settle=smooth(position,13,13.20);
      const top=Math.max(.09,Math.min(.90,(rect.top+12)/height));
      const bottom=Math.max(top+.12,Math.min(.94,(rect.bottom-12)/height));
      return {bounds:[.08,top+(settings.mobileStage[1]-top)*settle,.92,bottom+(settings.mobileStage[3]-bottom)*settle],opacity:1};
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
