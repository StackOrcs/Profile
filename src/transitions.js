import {gsap} from 'gsap';
import {transitions as settings} from './config.js';

// The image separates into photographic shutters, then resolves to the real
// accessible image. Shared URLs reuse the already decoded project captures.
export function directTransitions(){
  const mobile=matchMedia('(max-width:760px)').matches;
  const count=mobile?settings.mobileBands:settings.desktopBands;
  const cleanups=[];
  document.querySelectorAll('.mission-chapter').forEach((section,index)=>{
    const screen=section.querySelector('.mission-screen');
    const link=screen?.querySelector('a');
    const image=link?.querySelector('img');
    if(!image)return;
    const direction=index%2?-1:1;
    const aperture=document.createElement('span');
    aperture.className='media-aperture';
    aperture.setAttribute('aria-hidden','true');
    aperture.inert=true;
    const bands=Array.from({length:count},(_,i)=>{
      const band=document.createElement('span');
      band.className='media-shutter';
      band.style.left=`${i/count*100}%`;
      band.style.width=`${100/count}%`;
      const capture=image.cloneNode();
      capture.alt='';capture.removeAttribute('id');
      capture.style.width=`${count*100}%`;
      capture.style.left=`${-i*100}%`;
      band.append(capture);aperture.append(band);
      return band;
    });
    const trace=document.createElement('span');
    trace.className='media-exposure-line';aperture.append(trace);
    link.append(aperture);screen.classList.add('media-directed');
    const tilt=mobile?settings.mobileMediaTilt:settings.mediaTilt;
    const score=gsap.timeline({scrollTrigger:{trigger:screen,start:'top 90%',end:'top 32%',scrub:settings.scrub,invalidateOnRefresh:true}});
    score
      .fromTo(screen,{rotationY:direction*tilt,rotationX:mobile?0:2,y:settings.mediaTravel,transformPerspective:1400},
        {rotationY:0,rotationX:0,y:-settings.mediaTravel*.35,duration:1.25,ease:'power2.out'},0)
      .fromTo(bands,{clipPath:'inset(0 50% 0 50%)',yPercent:i=>i%2?12:-12,rotationY:direction*16,transformPerspective:900},
        {clipPath:'inset(0 0% 0 0%)',yPercent:0,rotationY:0,duration:settings.apertureDuration,stagger:{each:settings.apertureStagger,from:direction>0?'start':'end'},ease:'power3.inOut'},0)
      .fromTo(image,{opacity:0},{opacity:1,duration:.12,ease:'none'},.94)
      .to(bands,{opacity:0,duration:.14,ease:'none'},1.05)
      .fromTo(trace,{x:()=>direction>0?0:link.clientWidth,autoAlpha:0,scaleY:.35},
        {x:()=>direction>0?link.clientWidth:0,autoAlpha:.8,scaleY:1,duration:.62,ease:'power3.inOut'},.28)
      .to(trace,{autoAlpha:0,duration:.15},.88)
      .fromTo(screen.querySelector('figcaption'),{y:8,opacity:0},{y:0,opacity:1,duration:.28},.88);
    // Keyboard users receive the fully readable capture immediately.
    const focus=()=>{score.scrollTrigger?.kill();score.progress(1);};
    link.addEventListener('focus',focus);
    const heading=section.querySelector('.reveal-heading');
    const words=heading?.querySelectorAll('.word');
    if(words?.length){
      gsap.fromTo(words,{yPercent:108,rotationX:-settings.headlineTurn,transformOrigin:'50% 100%'},
        {yPercent:0,rotationX:0,duration:.72,stagger:settings.headlineStagger,ease:'power3.out',scrollTrigger:{trigger:heading,start:'top 89%',end:'top 56%',scrub:settings.scrub}});
    }
    cleanups.push(()=>{link.removeEventListener('focus',focus);aperture.remove();screen.classList.remove('media-directed');});
  });
  // A line connects each ownership promise as the partnership enters view.
  document.querySelectorAll('.values-strip>span').forEach((row,index)=>{
    const line=document.createElement('i');line.className='promise-trace';
    line.setAttribute('aria-hidden','true');row.append(line);
    gsap.fromTo(line,{scaleX:0,transformOrigin:index%2?'100% 50%':'0% 50%'},
      {scaleX:1,ease:'power2.inOut',scrollTrigger:{trigger:row,start:'top 87%',end:'top 63%',scrub:settings.scrub}});
    cleanups.push(()=>line.remove());
  });
  return()=>cleanups.forEach(clean=>clean());
}
