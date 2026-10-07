import {gsap} from 'gsap';
import {motion} from './config.js';

// Editorial transitions share the main GSAP context and revert with motion off.
export function directEditorial(){
  gsap.fromTo('.studio-wordmark',{yPercent:0,opacity:.07},{yPercent:28,opacity:0,ease:'none',scrollTrigger:{trigger:'#opening',start:'top top',end:'bottom top',scrub:motion.scrub}});
  document.querySelectorAll('.mission-chapter').forEach(section=>{
    gsap.fromTo(section.querySelector('.mission-copy'),{y:18},{y:-18,ease:'none',scrollTrigger:{trigger:section,start:'top bottom',end:'bottom top',scrub:motion.scrub}});
  });
  gsap.from('.system-node',{clipPath:'inset(0 100% 0 0)',stagger:.04,duration:.5,ease:'power3.out',scrollTrigger:{trigger:'.system-grid',start:'top 92%',once:true}});
  gsap.fromTo('.launch-track',{'--track-progress':0},{'--track-progress':1,ease:'none',scrollTrigger:{trigger:'.launch-track',start:'top 88%',end:'top 40%',scrub:motion.scrub}});
}
