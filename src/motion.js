import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

export function initMotion(isPaused) {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ignoreMobileResize:true});
  const queries = gsap.matchMedia();
  let context;
  const setup = () => {
    context?.revert();
    document.body.classList.toggle('motion-enabled', !isPaused());
    if (isPaused()) return;
    context = gsap.context(() => {
      gsap.from('.title-line', {y:35,duration:1.05,stagger:.12,ease:'power3.out'});
      const curtains = gsap.timeline({scrollTrigger:{trigger:'#opening',start:'top top',end:()=>`+=${Math.min(innerHeight*.6,500)}`,scrub:.35}});
      curtains.to('.curtain-left',{xPercent:-105,ease:'none'},0).to('.curtain-right',{xPercent:105,ease:'none'},0);
      gsap.to('.hero-copy',{y:-80,opacity:.2,ease:'none',scrollTrigger:{trigger:'#opening',start:'top top',end:'bottom top',scrub:.5}});
      gsap.to('.artifact-label',{y:-45,opacity:0,ease:'none',scrollTrigger:{trigger:'#opening',start:'20% top',end:'bottom top',scrub:true}});
      document.querySelectorAll('.reveal-heading').forEach(heading => {
        gsap.from(heading,{y:55,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:heading,start:'top 91%',once:true}});
      });
      document.querySelectorAll('.reveal').forEach(element => {
        gsap.from(element,{y:28,opacity:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:element,start:'top 94%',once:true}});
      });
      gsap.to('.cosmic-glow',{yPercent:-15,xPercent:-8,ease:'none',scrollTrigger:{trigger:'main',start:'top top',end:'bottom bottom',scrub:1}});
      document.querySelectorAll('.chapter-graphic').forEach(graphic=>{
        const compact = matchMedia('(max-width:760px)').matches;
        gsap.fromTo(graphic,{y:40,rotation:-4,xPercent:compact?-50:0,yPercent:compact?0:-50},{y:-40,rotation:4,ease:'none',scrollTrigger:{trigger:graphic.closest('.story-act'),start:'top bottom',end:'bottom top',scrub:.8}});
      });
      document.querySelectorAll('.mission-screen').forEach(screen=>{
        gsap.fromTo(screen,{rotationY:-10},{rotationY:3,ease:'none',scrollTrigger:{trigger:screen.closest('.story-act'),start:'top bottom',end:'bottom top',scrub:.8}});
      });
      gsap.fromTo('.values-strip span',{y:20},{y:0,stagger:.09,duration:.65,scrollTrigger:{trigger:'.values-strip',start:'top 92%',once:true}});
    });
    ScrollTrigger.refresh();
  };
  queries.add('(prefers-reduced-motion: no-preference) and (min-width:761px)', () => {setup(); return () => context?.revert();});
  queries.add('(prefers-reduced-motion: no-preference) and (max-width:760px)', () => {setup(); return () => context?.revert();});
  document.addEventListener('experience:motion', setup);
  return () => {queries.revert();context?.revert();document.removeEventListener('experience:motion',setup);};
}
