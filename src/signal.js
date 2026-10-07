import {gsap} from 'gsap';
import {signalConfig} from './signal-config.js';

// One reversible seven-second score, played by native scroll distance.
export function directSignal(){
  const section=document.querySelector('#clarity');
  const questions=[...section.querySelectorAll('.signal-question')];
  const steps=[...section.querySelectorAll('.signal-sequence span')];
  const update=progress=>{
    const phase=progress<.26?0:progress<.48?1:progress<.76?2:3;
    section.dataset.signalPhase=String(phase);
    steps.forEach((step,index)=>step.classList.toggle('is-current',index===phase));
    questions.forEach((item,index)=>item.setAttribute('aria-current',index===0?'step':'false'));
  };
  section.style.setProperty('--signal-screens',String(signalConfig.scrollScreens));
  const timeline=gsap.timeline({scrollTrigger:{trigger:section,start:'top top',end:'bottom bottom',scrub:signalConfig.scrub,invalidateOnRefresh:true,onUpdate:self=>update(self.progress),onRefresh:self=>update(self.progress)}});
  const duration=signalConfig.duration;
  timeline.fromTo(section,{'--signal-p':0},{'--signal-p':1,duration,ease:'none'},0);
  timeline.fromTo('.signal-noise-word',{opacity:1,letterSpacing:'-.055em'},{opacity:.30,letterSpacing:'.005em',duration:duration*.27,ease:'power2.inOut'},duration*.11);
  timeline.fromTo('.signal-clear-word',{color:'#181a17'},{color:'#e65900',duration:duration*.23,ease:'power2.inOut'},duration*.26);
  gsap.set(questions,{autoAlpha:1,y:0});
  timeline.fromTo('.signal-output',{opacity:.3},{opacity:1,duration:.70,ease:'power2.out'},duration*.76);
  timeline.fromTo('.signal-fallback-art',{rotationY:-12,scale:.95},{rotationY:0,scale:1.08,duration,ease:'none'},0);
  return timeline;
}
