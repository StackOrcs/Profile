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
  return {
    focus,breath:0,jaw:0,
    pitch:.10-focus*.02,
    yaw:6.05+(1-focus)*signalConfig.turn,
    roll:-.02*focus,
    scale:1,
    phase:progress<.26?0:progress<.48?1:progress<.76?2:3
  };
}
