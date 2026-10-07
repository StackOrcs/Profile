const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const button = document.getElementById('motion-toggle');
const chapters = [...document.querySelectorAll('.story-act')];
const chapterLinks = [...document.querySelectorAll('.chapter-nav a')];
const ending = document.querySelector('.closing-sequence');
let manuallyPaused = false;
let progress = 0;
let storyPosition = 0;
let tickPending = false;
let sceneStarted = false;
let motionStarted = false;
const isPaused = () => reduced.matches || manuallyPaused;
const clamp = (value,low=0,high=1) => Math.max(low,Math.min(high,value));
const smooth = (value,low,high) => {const t=clamp((value-low)/(high-low));return t*t*(3-2*t);};

function syncMotion() {
  const paused = isPaused();
  document.body.classList.toggle('motion-off', paused);
  document.body.classList.toggle('motion-enabled', !paused && motionStarted);
  button.setAttribute('aria-pressed', String(paused));
  button.disabled = reduced.matches;
  button.innerHTML = reduced.matches ? 'Reduced motion <span>—</span>' : paused ? 'Motion off <span>▶</span>' : 'Motion on <span>Ⅱ</span>';
  button.setAttribute('aria-label', reduced.matches ? 'Reduced motion follows your device setting' : paused ? 'Resume animation' : 'Pause animation');
  document.dispatchEvent(new CustomEvent('experience:motion', {detail:{paused}}));
}
function update() {
  tickPending = false;
  const height = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  progress = Math.max(0, Math.min(1, scrollY / height));
  let shot = 0;
  chapters.forEach((chapter,i)=>{if(chapter.getBoundingClientRect().top<=1)shot=i;});
  const rect=chapters[shot].getBoundingClientRect();
  storyPosition=shot+Math.max(0,Math.min(.999,-rect.top/rect.height));
  document.getElementById('flight-progress').textContent = String(Math.round(progress * 100)).padStart(3, '0');
  document.getElementById('progress-fill').style.transform = `scaleX(${progress})`;
  let index = 0;
  chapters.forEach((chapter, i) => {if (chapter.getBoundingClientRect().top <= innerHeight * .48) index = i;});
  document.getElementById('chapter-name').textContent = chapters[index].dataset.chapter;
  document.getElementById('chapter-index').textContent = `${String(index+1).padStart(2,'0')} / ${chapters.length}`;
  document.body.dataset.theme=chapters[index].classList.contains('paper')?'light':'dark';
  if (!isPaused()) document.getElementById('universe').style.setProperty('--dawn',progress.toFixed(3));
  chapterLinks.forEach((link, i) => {
    link.classList.toggle('active', index === i);
    if (index === i) link.setAttribute('aria-current','step'); else link.removeAttribute('aria-current');
  });
  document.getElementById('scene-host').dataset.progress = progress.toFixed(3);
  if (ending) {
    const travel=Math.max(1,ending.offsetHeight-innerHeight);
    const endingProgress=clamp(-ending.getBoundingClientRect().top/travel);
    const word=smooth(endingProgress,.82,.995);
    ending.style.setProperty('--ending-p',endingProgress.toFixed(4));
    ending.style.setProperty('--ending-scale',(0.5+endingProgress*12).toFixed(4));
    ending.style.setProperty('--ending-ring-scale',(0.35+endingProgress*3.2).toFixed(4));
    ending.style.setProperty('--ending-mark',(1-smooth(endingProgress,.72,.93)).toFixed(4));
    ending.style.setProperty('--ending-word',word.toFixed(4));
    ending.style.setProperty('--ending-ring',((1-word)*.7).toFixed(4));
    ending.style.setProperty('--ending-y',((1-word)*18).toFixed(2)+'px');
    ending.style.setProperty('--ending-caption',(1-smooth(endingProgress,.54,.82)).toFixed(4));
    ending.dataset.phase=word>.98?'wordmark':endingProgress>.72?'expansion':'mark';
  }
  document.dispatchEvent(new CustomEvent('experience:scroll'));
}
function scheduleUpdate() {if (!tickPending) {tickPending = true; requestAnimationFrame(update);}}
window.addEventListener('scroll', scheduleUpdate, {passive:true});
window.addEventListener('resize', scheduleUpdate, {passive:true});
document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('motion-paused', document.hidden));
button.addEventListener('click', () => {manuallyPaused = !manuallyPaused; syncMotion(); startEnhancements();});
reduced.addEventListener('change', () => {syncMotion(); startEnhancements();});
syncMotion();
update();

async function startEnhancements() {
  if (reduced.matches) return;
  const pending=[];
  if (!motionStarted) {
    motionStarted = true;
    pending.push(import('./motion.js').then(({initMotion})=>initMotion(isPaused)).catch(()=>{motionStarted=false;document.body.classList.remove('motion-enabled');}));
  }
  if (!sceneStarted) {
    sceneStarted = true;
    pending.push(import('./scene.js').then(({initScene})=>initScene({story:()=>storyPosition,isPaused})).catch(()=>{document.getElementById('scene-host').dataset.scene='fallback';document.body.classList.add('scene-failed');}));
  }
  await Promise.all(pending);
}
// Core content and project images take priority. 3D/motion arrive independently.
if ('requestIdleCallback' in window) requestIdleCallback(startEnhancements, {timeout:900});
else setTimeout(startEnhancements, 200);

// Opt-in local art-direction controls, absent from the public journey by default.
if(new URLSearchParams(location.search).has('tune'))import('./controls.js').then(({initControls})=>initControls());
