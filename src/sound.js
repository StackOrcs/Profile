export function initSound(){
  const toggle=document.getElementById('sound-toggle'),score=document.getElementById('score-audio');
  if(!toggle||!score)return;
  let enabled=true,blocked=false,pending=false;
  const render=()=>{
    toggle.setAttribute('aria-pressed',String(enabled&&!score.paused));
    toggle.setAttribute('aria-label',blocked?'Start sound':enabled?'Turn sound off':'Turn sound on');
    toggle.innerHTML=blocked?'Start sound <span>▶</span>':enabled?'Sound on <span>◉</span>':'Sound off <span>◼</span>';
    toggle.dataset.sound=enabled?'on':'off';
  };
  const start=()=>{
    if(!enabled||pending||!score.paused)return;
    pending=true;score.muted=document.hidden;
    score.play().then(()=>{pending=false;blocked=false;if(!enabled)score.pause();render();}).catch(()=>{pending=false;blocked=enabled;render();});
  };
  const gesture=event=>{if(!event.target.closest?.('#sound-toggle'))start();};
  toggle.addEventListener('click',()=>{
    if(enabled&&!blocked){enabled=false;score.autoplay=false;score.pause();}
    else{enabled=true;blocked=false;score.autoplay=true;start();}
    render();
  });
  document.addEventListener('pointerdown',gesture,{passive:true});
  document.addEventListener('keydown',gesture);
  document.addEventListener('visibilitychange',()=>{score.muted=document.hidden;if(!document.hidden)start();});
  score.addEventListener('canplay',start);score.addEventListener('playing',render);
  score.volume=.3;score.preload='auto';score.loop=true;score.autoplay=enabled;
  // Runs before the curtain opens, independently of 3D and animation loading.
  render();if(enabled)start();
}
