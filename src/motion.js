import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {motion} from './config.js';
import {splitWords} from './text.js';
import {initMedia} from './media.js';
import {directEditorial} from './editorial.js';
import {directSignal} from './signal.js';
import {directEnding} from './ending.js';
import {directTransitions} from './transitions.js';

export function initMotion(isPaused){
  gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({ignoreMobileResize:true});
  document.querySelectorAll('.reveal-heading,.title-line').forEach(splitWords);
  const queries=gsap.matchMedia();let context;
  const cleanMedia=initMedia(isPaused);
  const setup=()=>{
    context?.revert();document.body.classList.toggle('motion-enabled',!isPaused());
    if(isPaused())return;
    context=gsap.context(()=>{
      directEditorial();
      directSignal();
      const cleanEnding=directEnding();
      const cleanTransitions=directTransitions();
      gsap.from('.title-line .word',{yPercent:105,rotation:.5,stagger:.035,duration:motion.revealDuration,ease:motion.revealEase});
      gsap.from('.hero-copy .kicker,.hero-copy .lede,.hero-actions',{y:12,opacity:0,stagger:.06,duration:.45,delay:.08,ease:'power3.out'});
      document.querySelectorAll('.reveal-heading').forEach(heading=>{
        if(heading.closest('.mission-chapter'))return;
        gsap.from(heading.querySelectorAll('.word'),{yPercent:112,rotation:.6,stagger:motion.revealStagger,duration:motion.revealDuration,ease:motion.revealEase,scrollTrigger:{trigger:heading,start:'top 92%',once:true}});
      });
      document.querySelectorAll('.reveal').forEach(element=>{
        if(element.classList.contains('mission-screen'))return;
        gsap.from(element,{y:14,opacity:0,duration:.42,ease:'power3.out',scrollTrigger:{trigger:element,start:'top 95%',once:true}});
      });
      gsap.fromTo('#launch-title .word',{color:'#484f42'},{color:'#ecebe5',stagger:.2,ease:'none',scrollTrigger:{trigger:'#launch-title',start:'top 72%',end:'bottom 36%',scrub:motion.scrub}});
      gsap.from('.foundation-diagram',{clipPath:'inset(0 100% 0 0)',duration:.65,ease:'power3.inOut',scrollTrigger:{trigger:'.foundation-diagram',start:'top 90%',once:true}});
      gsap.from('.intelligence-statement span',{y:32,opacity:0,stagger:.08,duration:.62,ease:'power3.out',scrollTrigger:{trigger:'.intelligence-statement',start:'top 90%',once:true}});
      gsap.from('.values-strip span',{y:20,opacity:0,stagger:.06,duration:.5,ease:'power3.out',scrollTrigger:{trigger:'.values-strip',start:'top 93%',once:true}});
      gsap.from('.social-links a',{y:10,opacity:0,stagger:.05,duration:.4,scrollTrigger:{trigger:'.social-links',start:'top 95%',once:true}});
      return()=>{cleanEnding();cleanTransitions();};
    });
    ScrollTrigger.refresh();
  };
  queries.add('(prefers-reduced-motion:no-preference) and (min-width:761px)',()=>{setup();return()=>context?.revert();});
  queries.add('(prefers-reduced-motion:no-preference) and (max-width:760px)',()=>{setup();return()=>context?.revert();});
  document.addEventListener('experience:motion',setup);document.addEventListener('experience:direction',setup);
  return()=>{queries.revert();context?.revert();cleanMedia();document.removeEventListener('experience:motion',setup);document.removeEventListener('experience:direction',setup);};
}
