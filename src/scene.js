import * as THREE from 'three';
import {createBrand} from './brand.js';
import {createSystems,createPartnership} from './forms.js';
import {directScene} from './director.js';
import {scene as settings} from './config.js';
import {createFramer,samplePose} from './framing.js';
import {createStage} from './stage.js';
import {sampleSignal} from './signal-state.js';

// A physical brand sculpture. All front outlines are traced from the user's PNG.
export async function initScene({story,isPaused}) {
  const host = document.getElementById('scene-host');
  document.body.appendChild(host);
  const compact = matchMedia('(max-width:760px)');
  let renderer;
  try {renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance',stencil:false});}
  catch {host.dataset.scene='fallback';document.body.classList.add('scene-failed');return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,compact.matches?settings.mobilePixelRatio:settings.desktopPixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = settings.exposure;
  renderer.setClearColor(0x000000,0);
  renderer.domElement.setAttribute('aria-hidden','true');
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(settings.fov,innerWidth/innerHeight,.1,80);
  camera.position.set(0,0,settings.cameraZ);

  // Rectangular photographic softboxes produce long, readable edge reflections.
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(0x252525);
  const softbox=(x,y,z,w,h,color,intensity,rx=0,ry=0)=>{
    const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(intensity),side:THREE.DoubleSide}));
    panel.position.set(x,y,z);panel.rotation.set(rx,ry,0);studio.add(panel);
  };
  softbox(-4,1,2,3,8,0xfff5e4,4,0,Math.PI/3);
  softbox(4,0,1,1.2,7,0xffffff,7,0,-Math.PI/3);
  softbox(0,5,0,7,2,0xffffff,5,Math.PI/2);
  softbox(-2,-1,-4,2,6,0xff6a22,3);
  const pmrem=new THREE.PMREMGenerator(renderer);
  const environment=pmrem.fromScene(studio,.015,.1,50);
  scene.environment=environment.texture;
  studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xf2f5ff,0x21170f,1.25));
  const key=new THREE.DirectionalLight(0xfff5e7,4.2);key.position.set(-3,5,6);scene.add(key);
  const edge=new THREE.DirectionalLight(0xffffff,5);edge.position.set(5,2,-2);scene.add(edge);
  const warmth=new THREE.PointLight(0xff641d,4,12,2);warmth.position.set(-4,-3,4);scene.add(warmth);

  const enamel=new THREE.MeshPhysicalMaterial({color:0xff6500,metalness:.48,roughness:.23,clearcoat:1,clearcoatRoughness:.12,envMapIntensity:1.35});
  const copper=new THREE.MeshStandardMaterial({color:0x873914,metalness:.9,roughness:.22,envMapIntensity:1.4});
  const chrome=new THREE.MeshStandardMaterial({color:0xd6d6d0,metalness:1,roughness:.16,envMapIntensity:1.5});
  const graphite=new THREE.MeshPhysicalMaterial({color:0x171918,metalness:.72,roughness:.25,clearcoat:1,clearcoatRoughness:.12});
  const glass=new THREE.MeshPhysicalMaterial({color:0x212423,metalness:.35,roughness:.12,clearcoat:1,clearcoatRoughness:.08,transparent:true,opacity:.86});
  const materials={enamel,copper,chrome,graphite,glass};
  const sculpture=new THREE.Group();scene.add(sculpture);
  const identity=createBrand(materials),systems=createSystems(materials),partnership=createPartnership(materials);
  sculpture.add(identity.group,systems.group,partnership.group);
  const signalSection=document.querySelector('#clarity');
  const endingSection=document.querySelector('.closing-sequence');
  let signal=null,signalPending=false,closed=false;
  const warmSignal=()=>{
    if(signalPending)return;signalPending=true;
    import('./signal-scene.js').then(({createSignal})=>{
      if(closed)return;
      const candidate=createSignal(materials);
      const prewarm=renderer.compileAsync?.(candidate.group,camera,scene);
      return Promise.resolve(prewarm).catch(()=>{}).then(()=>{
        if(closed)return;
        signal=candidate;sculpture.add(signal.group);signalSection.dataset.signalScene='ready';previousState='';start();
      });
    }).catch(()=>{signalSection.dataset.signalScene='fallback';});
  };
  const signalObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){warmSignal();signalObserver.disconnect();}},{rootMargin:'75% 0px'});signalObserver.observe(signalSection);

  // A readable front → inner layers → front sequence continues through the story.
  const shots=settings.shots,fit=createFramer(sculpture,camera),getStage=createStage(settings),craft=document.querySelector('#craft');
  let renderedStory=story(),focus=-1;
  const focusCleanup=[...document.querySelectorAll('.system-node')].map((node,index)=>{const enter=()=>{focus=index;start();};const leave=()=>{focus=-1;start();};node.addEventListener('pointerenter',enter);node.addEventListener('pointerleave',leave);node.addEventListener('focus',enter);node.addEventListener('blur',leave);return()=>{node.removeEventListener('pointerenter',enter);node.removeEventListener('pointerleave',leave);node.removeEventListener('focus',enter);node.removeEventListener('blur',leave);};});
  const pointer={x:0,y:0};let targetX=0,targetY=0;
  const onPointer=e=>{if(!compact.matches){targetX=(e.clientX/innerWidth-.5)*settings.pointerDepth;targetY=(e.clientY/innerHeight-.5)*settings.pointerDepth*.67;start();}};
  const resetPointer=()=>{targetX=0;targetY=0;start();};
  window.addEventListener('pointermove',onPointer,{passive:true});document.addEventListener('pointerleave',resetPointer);
  let frame=0,lastFrame=0,visible=true,lost=false,slow=0,draws=0,previousState='';
  const draw=(delta=1/60,force=false)=>{
    const target=Math.min(14,Math.max(0,story()));
    renderedStory=force?target:THREE.MathUtils.damp(renderedStory,target,settings.scrollDamping,delta);
    if(Math.abs(renderedStory-target)<.00005)renderedStory=target;
    const s=renderedStory,direction=directScene(s),index=Math.min(13,Math.floor(s)),pose=samplePose(shots,s);
    if(s>=1.85&&s<3&&!signal)warmSignal();
    pointer.x=THREE.MathUtils.damp(pointer.x,targetX,14,delta);pointer.y=THREE.MathUtils.damp(pointer.y,targetY,14,delta);
    if(Math.abs(pointer.x-targetX)<.00005)pointer.x=targetX;
    if(Math.abs(pointer.y-targetY)<.00005)pointer.y=targetY;
    const endingActive=endingSection?.dataset.active==='true';
    const endingProgress=endingSection?Math.max(0,Math.min(1,Number(endingSection.dataset.progress||0))):0;
    const stage=endingActive?{bounds:[.12,.08,.88,.92],opacity:1}:getStage(compact.matches,compact.matches?target:s,host.clientHeight);
    const state=[s,pointer.x,pointer.y,settings.fov,settings.exposure,settings.desktopScale,settings.mobileScale,settings.layerSeparation,...stage.bounds,stage.opacity,focus,endingActive?1:0,endingProgress].map(n=>n.toFixed(5)).join('/');
    if(state===previousState)return false;
    previousState=state;
    const opacity=stage.opacity*direction.opacity;
    host.style.opacity=String(opacity);host.style.setProperty('--scene-opacity',String(opacity));host.dataset.shot=String(index+1);
    host.dataset.story=s.toFixed(3);host.dataset.form=direction.kind;
    craft.dataset.phase=String(s<3.2?0:s<3.6?1:s<3.82?2:3);
    // An invisible phone gap still needs to finish following the scroll target.
    // Stopping here too early can strand the scene before its next visible slot.
    if(opacity<.005){const following=Math.abs(s-target)>.00005;host.dataset.running=String(following);return following;}
    sculpture.rotation.set(pose[0]+pointer.y,pose[1]+pointer.x,pose[2]);
    sculpture.scale.setScalar(pose[3]*(compact.matches?settings.mobileScale:settings.desktopScale));
    const gap=Math.max(0,pose[4])*settings.layerSeparation/1.4;
    const signalState=signal?sampleSignal(s,signalSection.offsetHeight,host.clientHeight):{progress:0,weight:0};
    const identityWeight=direction.brand*(1-signalState.weight);
    identity.group.visible=identityWeight>.015;identity.group.scale.setScalar(identityWeight);
    if(signal){signal.group.visible=signalState.weight>.015;if(signal.group.visible)signal.update(signalState.progress,signalState.weight,pose);}
    host.dataset.signal=signalState.progress.toFixed(3);
    systems.group.visible=direction.systems>.015;partnership.group.visible=direction.partnership>.015;
    identity.update(gap,direction.division);systems.update(direction.form,direction.systems,focus);partnership.update(Math.max(0,Math.min(1,s-12)),direction.partnership);
    camera.fov=settings.fov;camera.updateProjectionMatrix();
    const bounds=fit(stage.bounds);
    if(endingActive){
      sculpture.position.multiplyScalar(1-endingProgress);
      sculpture.scale.multiplyScalar(1+endingProgress*9);
    }
    host.dataset.bounds=bounds.map(n=>n.toFixed(4)).join(',');
    host.dataset.stage=stage.bounds.join(',');
    host.dataset.explosion=gap.toFixed(2);host.dataset.rotation=pose[1].toFixed(3);
    host.dataset.running='true';
    renderer.toneMappingExposure=settings.exposure;
    renderer.render(scene,camera);
    if(++draws%60===0)host.dataset.triangles=String(renderer.info.render.triangles);
    return true;
  };
  const tick=now=>{
    frame=0;if(document.hidden||!visible||isPaused()||lost){host.dataset.running='false';return;}
    if(now-lastFrame>=1000/(compact.matches?settings.mobileFps:settings.desktopFps)-1){
      const delta=Math.min(.05,(now-lastFrame)/1000);lastFrame=now;const before=performance.now();const rendered=draw(delta);const cost=performance.now()-before;
      if(!rendered){host.dataset.running='false';return;}
      slow=cost>24?slow+1:Math.max(0,slow-1);
      if(slow>15&&renderer.getPixelRatio()>1){renderer.setPixelRatio(1);renderer.setSize(host.clientWidth,host.clientHeight,false);host.dataset.quality='adaptive';slow=0;}
      if(draws%60===0)host.dataset.renderMs=cost.toFixed(1);
    }
    frame=requestAnimationFrame(tick);
  };
  const start=()=>{if(!frame&&!document.hidden&&visible&&!isPaused()&&!lost){host.dataset.running='true';lastFrame=performance.now();frame=requestAnimationFrame(tick);}};
  const stop=()=>{cancelAnimationFrame(frame);frame=0;host.dataset.running='false';};
  const sync=()=>{if(document.hidden||!visible||isPaused())stop();else{renderedStory=story();previousState='';start();}};
  const resize=()=>{previousState='';const width=host.clientWidth,height=host.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/height;camera.position.z=compact.matches?settings.mobileCameraZ:settings.cameraZ;camera.updateProjectionMatrix();draw(1/60,true);start();};
  const direction=()=>{previousState='';camera.position.z=compact.matches?settings.mobileCameraZ:settings.cameraZ;start();};
  document.addEventListener('experience:scroll',start);document.addEventListener('experience:direction',direction);
  window.addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',sync);document.addEventListener('experience:motion',sync);
  const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(host);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});observer.observe(document.querySelector('main'));
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;stop();document.body.classList.remove('scene-ready');document.body.classList.add('scene-failed');host.dataset.scene='fallback';});
  resize();host.dataset.scene='brand-sculpture';host.dataset.quality='balanced';host.dataset.triangles=String(renderer.info.render.triangles);
  document.body.classList.add('scene-ready');start();
  return ()=>{closed=true;signalObserver.disconnect();focusCleanup.forEach(clean=>clean());stop();observer.disconnect();sizeObserver.disconnect();window.removeEventListener('resize',resize);document.removeEventListener('experience:scroll',start);window.removeEventListener('pointermove',onPointer);document.removeEventListener('experience:direction',direction);document.removeEventListener('pointerleave',resetPointer);document.removeEventListener('visibilitychange',sync);document.removeEventListener('experience:motion',sync);scene.traverse(o=>{o.geometry?.dispose();if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());});environment.dispose();renderer.dispose();renderer.domElement.remove();};
}
