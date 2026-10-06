import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {motion} from './config.js';
import {splitWords} from './text.js';
import {initMedia} from './media.js';
import {directEditorial} from './editorial.js';

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
      gsap.from('.title-line .word',{yPercent:110,rotation:1,stagger:.055,duration:motion.revealDuration,ease:motion.revealEase});
      gsap.from('.hero-copy .kicker,.hero-copy .lede,.hero-actions',{y:16,opacity:0,stagger:.1,duration:.85,delay:.2,ease:'power3.out'});
      document.querySelectorAll('.reveal-heading').forEach(heading=>{
        gsap.from(heading.querySelectorAll('.word'),{yPercent:112,rotation:.6,stagger:motion.revealStagger,duration:motion.revealDuration,ease:motion.revealEase,scrollTrigger:{trigger:heading,start:'top 92%',once:true}});
      });
      document.querySelectorAll('.reveal').forEach(element=>{
        if(element.classList.contains('mission-screen'))return;
        gsap.from(element,{y:20,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:element,start:'top 93%',once:true}});
      });
      gsap.fromTo('#launch-title .word',{color:'#484f42'},{color:'#ecebe5',stagger:.2,ease:'none',scrollTrigger:{trigger:'#launch-title',start:'top 72%',end:'bottom 36%',scrub:motion.scrub}});
      gsap.from('.decision-list li',{y:25,opacity:0,stagger:.13,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.decision-list',start:'top 88%',once:true}});
      gsap.from('.foundation-diagram',{clipPath:'inset(0 100% 0 0)',duration:1.25,ease:'power3.inOut',scrollTrigger:{trigger:'.foundation-diagram',start:'top 86%',once:true}});
      gsap.from('.intelligence-statement span',{y:50,opacity:0,stagger:.15,duration:1.1,ease:'power4.out',scrollTrigger:{trigger:'.intelligence-statement',start:'top 85%',once:true}});
      document.querySelectorAll('.mission-screen').forEach(screen=>{
        gsap.from(screen,{clipPath:'inset(8% 8% 8% 8%)',opacity:0,duration:1.25,ease:'power3.inOut',scrollTrigger:{trigger:screen,start:'top 92%',once:true}});
        gsap.fromTo(screen,{rotationY:-motion.mediaTilt,y:motion.mediaParallax},{rotationY:motion.mediaTilt*.4,y:-motion.mediaParallax,ease:'none',scrollTrigger:{trigger:screen,start:'top bottom',end:'bottom top',scrub:motion.scrub}});
      });
      gsap.from('.values-strip span',{y:30,opacity:0,stagger:.1,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.values-strip',start:'top 90%',once:true}});
      gsap.from('.social-links a',{y:15,opacity:0,stagger:.08,duration:.6,scrollTrigger:{trigger:'.social-links',start:'top 93%',once:true}});
    });
    ScrollTrigger.refresh();
  };
  queries.add('(prefers-reduced-motion:no-preference) and (min-width:761px)',()=>{setup();return()=>context?.revert();});
  queries.add('(prefers-reduced-motion:no-preference) and (max-width:760px)',()=>{setup();return()=>context?.revert();});
  document.addEventListener('experience:motion',setup);document.addEventListener('experience:direction',setup);
  return()=>{queries.revert();context?.revert();cleanMedia();document.removeEventListener('experience:motion',setup);document.removeEventListener('experience:direction',setup);};
}
