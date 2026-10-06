import {gsap} from 'gsap';
import {motion} from './config.js';

// Editorial transitions share the main GSAP context and revert with motion off.
export function directEditorial(){
  gsap.fromTo('.studio-wordmark',{yPercent:0,opacity:.07},{yPercent:28,opacity:0,ease:'none',scrollTrigger:{trigger:'#opening',start:'top top',end:'bottom top',scrub:motion.scrub}});
  gsap.from('.project-panel',{clipPath:'inset(0 0 100% 0)',duration:1.1,ease:'power4.inOut',scrollTrigger:{trigger:'.project-panel',start:'top 94%',once:true}});
  document.querySelectorAll('.mission-chapter').forEach(section=>{
    gsap.fromTo(section.querySelector('.mission-copy'),{y:18},{y:-18,ease:'none',scrollTrigger:{trigger:section,start:'top bottom',end:'bottom top',scrub:motion.scrub}});
  });
  gsap.from('.system-node',{clipPath:'inset(0 100% 0 0)',stagger:.06,duration:.9,ease:'power3.inOut',scrollTrigger:{trigger:'.system-grid',start:'top 88%',once:true}});
}
