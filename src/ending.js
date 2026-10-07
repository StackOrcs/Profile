import {gsap} from 'gsap';
import {ending as settings} from './config.js';
import {createTypeOptics} from './type-optics.js';

// A separate typographic coda follows the existing sculpture shot.
// Scroll controls one reversible score plus a demand-rendered optical pass.
export function directEnding(){
  const section=document.querySelector('.closing-sequence');
  if(!section)return()=>{};
  const word=section.querySelector('.closing-word');
  const prefix=section.querySelector('.closing-prefix');
  const name=section.querySelector('.closing-name');
  const glyphs=section.querySelectorAll('.ending-glyph');
  const echoes=section.querySelectorAll('.closing-echo');
  const kicker=section.querySelector('.closing-line-kicker');
  const rule=section.querySelector('.closing-rule');
  section.classList.add('ending-enhanced');
  // Clear pixel transforms before rebuilding at a responsive breakpoint.
  gsap.set([word,prefix,name,kicker,rule,...glyphs,...echoes],{clearProps:'transform,opacity,visibility'});
  const optics=createTypeOptics(section,name);
  const score=gsap.timeline({paused:true,onUpdate:()=>optics.render(score.progress())});
  score
    .fromTo(word,{autoAlpha:0,yPercent:10,scale:.94,rotationX:7},{autoAlpha:1,duration:.22,ease:'power2.out'},0)
    .to(word,{yPercent:0,scale:1,rotationX:0,duration:1.45,ease:'power3.out'},.1)
    .fromTo(echoes,{autoAlpha:0,scaleX:1.12,x:0,y:0,xPercent:i=>i===0?9:-9,yPercent:i=>i===0?-115:115},
      {autoAlpha:.52,scaleX:1,x:0,y:0,xPercent:0,yPercent:i=>i===0?-35:35,duration:.72,ease:'power3.out'},0)
    .fromTo(name,{x:0,xPercent:-20},{x:0,xPercent:0,duration:.9,ease:'power3.inOut'},.25)
    .to(echoes,{yPercent:0,duration:.55,ease:'power3.inOut'},.55)
    .to(echoes,{autoAlpha:0,duration:.45,ease:'power2.out'},1.05)
    .fromTo(glyphs,{y:0,yPercent:118,rotationX:-78,z:-70,x:12,autoAlpha:0},
      {y:0,yPercent:0,rotationX:0,z:0,x:0,autoAlpha:1,duration:settings.glyphDuration,stagger:settings.glyphStagger,ease:settings.glyphEase},.28)
    .fromTo(prefix,{x:0,xPercent:-65,rotationY:-25,autoAlpha:0},
      {x:0,xPercent:0,rotationY:0,autoAlpha:1,duration:.55,ease:'power3.out'},.68)
    .fromTo(kicker,{y:0,yPercent:130,autoAlpha:0},
      {y:0,yPercent:0,autoAlpha:1,duration:.6,ease:'power3.out'},1.02)
    .fromTo(rule,{scaleX:0,autoAlpha:0,transformOrigin:'0% 50%'},
      {scaleX:1,autoAlpha:.75,duration:.4,ease:'power3.inOut'},1.1)
    .to(rule,{scaleX:0,autoAlpha:0,transformOrigin:'100% 50%',duration:.3,ease:'power3.inOut'},1.55)
    .to(word,{duration:.15},1.85);
  score.progress(Number(section.dataset.typeProgress||0));
  const follow=gsap.quickTo(score,'progress',{duration:settings.typeFollow,ease:settings.typeEase});
  const update=()=>follow(Number(section.dataset.typeProgress||0));
  document.addEventListener('experience:scroll',update);
  return()=>{
    document.removeEventListener('experience:scroll',update);
    follow.tween.kill();score.kill();optics.destroy();section.classList.remove('ending-enhanced');
  };
}
