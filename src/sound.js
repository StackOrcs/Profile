export function initSound(){
  const score=document.getElementById('score-audio');
  if(!score||score.dataset.soundInitialized)return;
  score.dataset.soundInitialized='true';
  let toggle;
  let enabled=true,blocked=false,pending=false;
  const render=()=>{
    score.dataset.playback=!enabled?'off':blocked?'blocked':score.paused?'loading':'playing';
    if(!toggle)return;
    toggle.setAttribute('aria-pressed',String(enabled&&!score.paused));
    toggle.setAttribute('aria-label',blocked?'Start sound':enabled?'Turn sound off':'Turn sound on');
    toggle.innerHTML=blocked?'Start sound <span>▶</span>':enabled?'Sound on <span>◉</span>':'Sound off <span>◼</span>';
    toggle.dataset.sound=enabled?'on':'off';
  };
  const start=()=>{
    if(!enabled||pending||!score.paused)return;
    pending=true;score.muted=document.hidden;
    score.play().then(()=>{pending=false;blocked=false;delete score.dataset.playbackError;if(!enabled)score.pause();render();}).catch(error=>{pending=false;blocked=enabled;score.dataset.playbackError=error.name;render();});
  };
  const gesture=event=>{if(!event.target.closest?.('#sound-toggle'))start();};
  const bindControl=()=>{
    toggle=document.getElementById('sound-toggle');
    if(!toggle)return;
    toggle.addEventListener('click',()=>{
      if(enabled&&!blocked){enabled=false;score.autoplay=false;score.pause();}
      else{enabled=true;blocked=false;score.autoplay=true;start();}
      render();
    });
    render();
  };
  // Touch activation arrives on release. Capture also handles controls that
  // stop bubbling, without restarting audio when the sound button is used.
  ['pointerdown','pointerup','touchend','click','keydown'].forEach(type=>document.addEventListener(type,gesture,{passive:true,capture:true}));
  document.addEventListener('visibilitychange',()=>{score.muted=document.hidden;if(!document.hidden)start();});
  window.addEventListener('pageshow',start);
  score.addEventListener('canplay',start);score.addEventListener('playing',render);
  score.addEventListener('pause',render);
  score.volume=.3;score.preload='auto';score.loop=true;score.autoplay=enabled;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindControl,{once:true});
  else bindControl();
  // This small script runs directly after the audio element is parsed, before
  // the remainder of the page, curtain, layout calculations, and 3D imports.
  render();if(enabled)start();
}
