import {smooth} from './director.js';
import {signalConfig} from './signal-config.js';
const clamp=value=>Math.max(0,Math.min(1,value));

// Map the existing chapter position to the sticky section's available travel.
// Outside chapter 03, every original scene parameter remains untouched.
export function sampleSignal(story,sectionHeight,viewportHeight){
  if(story<2||story>=3)return {progress:0,weight:0};
  const progress=clamp((story-2)*sectionHeight/Math.max(1,sectionHeight-viewportHeight));
  return {progress,weight:smooth(progress,0,.07)};
}

export function signalPerformance(progress){
  const focus=smooth(progress,.08,.38);
  const breath=progress>.40&&progress<.72?Math.sin(Math.PI*(progress-.40)/.32)**2:0;
  return {
    focus,breath,jaw:breath*signalConfig.jawTravel,
    pitch:-.08+Math.sin(progress*Math.PI*2)*.10-breath*.12,
    yaw:6.05+(1-focus)*signalConfig.turn+Math.sin(progress*Math.PI*2)*.13,
    roll:Math.sin(progress*Math.PI*2)*.04,
    scale:1+breath*signalConfig.pulseStrength,
    waveFrame:smooth(progress,.40,.52)*(1-smooth(progress,.83,.94)),
    phase:progress<.26?0:progress<.48?1:progress<.76?2:3
  };
}

export function wavePerformance(progress,index){
  const time=(progress-(.43+index*.065))/.28;
  if(time<=0||time>=1)return {radius:.5,opacity:0,depth:0};
  return {radius:1.48+smooth(time,0,1)*(signalConfig.waveRadius-1.48),opacity:Math.sin(time*Math.PI)*.72,depth:time*.38};
}
