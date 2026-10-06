const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const button = document.getElementById('motion-toggle');
const chapters = [...document.querySelectorAll('.story-act')];
const chapterLinks = [...document.querySelectorAll('.chapter-nav a')];
let manuallyPaused = false;
let progress = 0;
let tickPending = false;
let sceneStarted = false;
let motionStarted = false;
const isPaused = () => reduced.matches || manuallyPaused;

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
  document.getElementById('flight-progress').textContent = String(Math.round(progress * 100)).padStart(3, '0');
  document.getElementById('progress-fill').style.transform = `scaleX(${progress})`;
  let index = 0;
  chapters.forEach((chapter, i) => {if (chapter.getBoundingClientRect().top <= innerHeight * .48) index = i;});
  document.getElementById('chapter-name').textContent = chapters[index].dataset.chapter;
  document.getElementById('chapter-index').textContent = `${String(index+1).padStart(2,'0')} / ${chapters.length}`;
  if (!isPaused()) document.getElementById('universe').style.setProperty('--dawn',progress.toFixed(3));
  chapterLinks.forEach((link, i) => {
    link.classList.toggle('active', index === i);
    if (index === i) link.setAttribute('aria-current','step'); else link.removeAttribute('aria-current');
  });
  document.getElementById('scene-host').dataset.progress = progress.toFixed(3);
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
  if (!motionStarted) {
    motionStarted = true;
    try {const {initMotion} = await import('./motion.js'); initMotion(isPaused);}
    catch {motionStarted = false; document.body.classList.remove('motion-enabled');}
  }
  if (!sceneStarted) {
    sceneStarted = true;
    try {const {initScene} = await import('./scene.js'); await initScene({progress:()=>progress,isPaused});}
    catch {document.getElementById('scene-host').dataset.scene = 'fallback';}
  }
}
// Core content and project images take priority. 3D/motion arrive independently.
if ('requestIdleCallback' in window) requestIdleCallback(startEnhancements, {timeout:900});
else setTimeout(startEnhancements, 200);
