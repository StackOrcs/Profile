import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

export async function initScene({progress,isPaused}) {
  const host = document.getElementById('scene-host');
  const compact = matchMedia('(max-width: 760px)');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power',stencil:false});
  } catch {host.dataset.scene='fallback';return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,compact.matches ? 1.15 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.setClearColor(0x000000,0);
  renderer.domElement.setAttribute('aria-hidden','true');
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,100);
  camera.position.set(0,0,10);
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentMap = pmrem.fromScene(environment,.04);
  scene.environment = environmentMap.texture;
  environment.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xd9e6ff,0x261324,2.1));
  const sun = new THREE.DirectionalLight(0xffe0ba,5);sun.position.set(4,5,5);scene.add(sun);
  const rim = new THREE.DirectionalLight(0xb3c3ff,3);rim.position.set(-4,1,-1);scene.add(rim);

  const rocket = new THREE.Group();
  const ceramic = new THREE.MeshStandardMaterial({color:0xe2dcd4,metalness:.28,roughness:.28});
  const copper = new THREE.MeshStandardMaterial({color:0xff6508,metalness:.65,roughness:.28});
  const darkMetal = new THREE.MeshStandardMaterial({color:0x151924,metalness:.8,roughness:.27});
  const silver = new THREE.MeshStandardMaterial({color:0x9b9baf,metalness:.95,roughness:.22});
  const mesh = (geometry,material,y=0) => {const object=new THREE.Mesh(geometry,material);object.position.y=y;rocket.add(object);return object;};
  mesh(new THREE.CylinderGeometry(.43,.4,2.3,40),ceramic,.12);
  mesh(new THREE.ConeGeometry(.43,.83,40),copper,1.68);
  mesh(new THREE.CylinderGeometry(.44,.44,.10,40),darkMetal,1.22);
  mesh(new THREE.CylinderGeometry(.42,.42,.06,40),copper,-.88);
  mesh(new THREE.CylinderGeometry(.35,.27,.38,32),darkMetal,-1.14);
  mesh(new THREE.CylinderGeometry(.28,.34,.13,32),silver,-1.38);
  const windowRim = mesh(new THREE.TorusGeometry(.195,.033,8,32),copper,.62);windowRim.position.z=.425;
  const glass = mesh(new THREE.SphereGeometry(.163,24,16),new THREE.MeshStandardMaterial({color:0x182943,metalness:.9,roughness:.08}),.62);
  glass.position.z=.423;glass.scale.z=.45;
  const finShape = new THREE.Shape();
  finShape.moveTo(.37,-.35);finShape.lineTo(.94,-1.15);finShape.lineTo(.94,-1.52);finShape.lineTo(.37,-1.16);finShape.closePath();
  const finGeometry = new THREE.ExtrudeGeometry(finShape,{depth:.055,bevelEnabled:true,bevelThickness:.018,bevelSize:.018,bevelSegments:1,steps:1});
  for(let i=0;i<3;i++){const fin=new THREE.Mesh(finGeometry,copper);fin.rotation.y=i*Math.PI*2/3+.28;rocket.add(fin);}
  const rivetGeometry = new THREE.SphereGeometry(.014,6,4);
  for(let i=0;i<10;i++){const rivet=new THREE.Mesh(rivetGeometry,silver);const angle=i*Math.PI*2/10;rivet.position.set(Math.sin(angle)*.435,1.18,Math.cos(angle)*.435);rocket.add(rivet);}
  // Brand decal is the user's original image, with no recoloring or replacement.
  try {
    const logo = await new THREE.TextureLoader().loadAsync(new URL('../assets/StackOrcs.png',location.href).href);
    logo.colorSpace = THREE.SRGBColorSpace;
    const badge = mesh(new THREE.PlaneGeometry(.56,.56),new THREE.MeshBasicMaterial({map:logo,toneMapped:false}),-.21);
    badge.position.z=.441;
  } catch { /* The unchanged header logo remains available if the decal fails. */ }
  const flame = mesh(new THREE.ConeGeometry(.28,1.65,16,1,true),new THREE.MeshBasicMaterial({color:0xff712d,transparent:true,opacity:.6,depthWrite:false,side:THREE.DoubleSide}),-2.2);
  flame.rotation.z=Math.PI;
  const core = mesh(new THREE.ConeGeometry(.14,1.23,12,1,true),new THREE.MeshBasicMaterial({color:0xffe8bd,transparent:true,opacity:.88,depthWrite:false,side:THREE.DoubleSide}),-1.99);
  core.rotation.z=Math.PI;
  const engineLight = new THREE.PointLight(0xff6a24,7,5,2);engineLight.position.set(0,-1.45,.4);rocket.add(engineLight);
  scene.add(rocket);

  let seed=17;
  const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  const starCount=compact.matches?420:900;
  const starPositions=new Float32Array(starCount*3);
  for(let i=0;i<starCount;i++){starPositions[i*3]=(random()-.5)*48;starPositions[i*3+1]=(random()-.5)*32;starPositions[i*3+2]=-6-random()*35;}
  const starGeometry=new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.BufferAttribute(starPositions,3));
  const stars=new THREE.Points(starGeometry,new THREE.PointsMaterial({color:0xd6daff,size:.037,transparent:true,opacity:.68,depthWrite:false}));scene.add(stars);

  const planet = new THREE.Group();
  const planetGeometry=new THREE.IcosahedronGeometry(1.2,3);
  const positions=planetGeometry.attributes.position;
  for(let i=0;i<positions.count;i++){const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i);const amount=1+.017*Math.sin(x*18)*Math.cos(z*14)*Math.sin(y*21);positions.setXYZ(i,x*amount,y*amount,z*amount);}
  planetGeometry.computeVertexNormals();
  planet.add(new THREE.Mesh(planetGeometry,new THREE.MeshStandardMaterial({color:0x322c49,roughness:.97,metalness:.1})));
  const planetRing=new THREE.Mesh(new THREE.RingGeometry(1.6,2.15,80),new THREE.MeshStandardMaterial({color:0x847169,metalness:.5,roughness:.7,transparent:true,opacity:.5,side:THREE.DoubleSide,depthWrite:false}));
  planetRing.rotation.x=Math.PI*.44;planetRing.rotation.z=.3;planet.add(planetRing);planet.position.set(-4,.1,-4);planet.rotation.z=-.22;scene.add(planet);
  const orbit=new THREE.Mesh(new THREE.TorusGeometry(4.8,.008,4,100),new THREE.MeshBasicMaterial({color:0xc9886e,transparent:true,opacity:.19,depthWrite:false}));orbit.rotation.x=1.1;orbit.rotation.z=.38;orbit.position.z=-3;scene.add(orbit);
  const dawn=new THREE.Mesh(new THREE.SphereGeometry(2.6,40,24),new THREE.MeshBasicMaterial({color:0xffb77e,transparent:true,opacity:0,depthWrite:false}));dawn.position.set(0,-8,-18);scene.add(dawn);
  const constellationPoints=[[-5,2.2,-4],[-3.7,3.1,-4],[-3.7,3.1,-4],[-2.8,2.1,-4],[-2.8,2.1,-4],[-1.2,2.7,-4],[-1.2,2.7,-4],[-.5,1.7,-4]];
  const constellationGeometry=new THREE.BufferGeometry().setFromPoints(constellationPoints.map(point=>new THREE.Vector3(...point)));
  const constellation=new THREE.LineSegments(constellationGeometry,new THREE.LineBasicMaterial({color:0xaca9cc,transparent:true,opacity:.16}));scene.add(constellation);

  const desktopPath=[
    [0,2.75,-.05,0,-.35,.22,1.12],[.14,2.1,.65,-.3,-.12,.1,1.05],
    [.33,-3.6,1.4,-1.8,-.8,.55,.62],[.53,4,2.2,-3,-.5,.3,.52],
    [.72,-3.4,-.1,-.6,-.32,-.2,1.02],[1,3.8,2.8,-6,-.55,.4,.28]
  ];
  const mobilePath=[
    [0,1.05,-1.45,0,-.32,.12,.68],[.14,1.1,-.5,-1,-.2,.14,.62],
    [.33,1.1,2.1,-3,-.7,.3,.35],[.53,-1.4,2.8,-4,-.5,.3,.3],
    [.72,.9,1.3,-2,-.4,-.2,.55],[1,1.3,3,-6,-.5,.3,.2]
  ];
  const pointer={x:0,y:0};
  const onPointer=event=>{if(!compact.matches){pointer.x=(event.clientX/innerWidth-.5)*.16;pointer.y=(event.clientY/innerHeight-.5)*.12;}};
  window.addEventListener('pointermove',onPointer,{passive:true});
  let frame=0,lastFrame=0,elapsed=0,visible=true,lost=false,slowFrames=0;
  const pose=(time)=>{
    const p=progress(),path=compact.matches?mobilePath:desktopPath;
    let index=0;while(index<path.length-2&&p>path[index+1][0])index++;
    const a=path[index],b=path[index+1];let t=Math.max(0,Math.min(1,(p-a[0])/(b[0]-a[0])));t=t*t*(3-2*t);
    const lerp=i=>a[i]+(b[i]-a[i])*t;
    rocket.position.set(lerp(1),lerp(2)+Math.sin(time*.9)*.035,lerp(3));
    rocket.rotation.set(pointer.y,lerp(5)+pointer.x+Math.sin(time*.4)*.035,lerp(4));rocket.scale.setScalar(lerp(6));
    flame.scale.y=.8+Math.sin(time*18)*.1;core.scale.y=.85+Math.sin(time*23)*.06;
    flame.position.y=-1.45-.75*flame.scale.y;core.position.y=-1.45-.54*core.scale.y;
    planet.rotation.y=time*.035;planet.position.x=-4+Math.sin(p*Math.PI)*1.3;
    planet.position.y=Math.sin(p*Math.PI*2)*1.1;planet.scale.setScalar(compact.matches?.65:1);
    stars.rotation.y=p*.2;stars.position.y=p*1.2;orbit.rotation.z=.38+p*.55;
    dawn.position.y=-8+p*7;dawn.material.opacity=p*p*.32;sun.intensity=5+p*1.4;
    camera.position.x=pointer.x*.35;camera.position.y=pointer.y*.25;camera.lookAt(0,0,0);
  };
  const draw=()=>{pose(elapsed);renderer.render(scene,camera);};
  const tick=(now)=>{
    frame=0;
    if(document.hidden||!visible||isPaused()||lost){host.dataset.running='false';return;}
    const targetFrame=compact.matches?1000/30:1000/60;
    if(now-lastFrame>=targetFrame-1){
      elapsed+=Math.min((now-lastFrame)/1000,.06);lastFrame=now;
      const start=performance.now();draw();
      if(performance.now()-start>24){slowFrames++;}else slowFrames=Math.max(0,slowFrames-1);
      if(slowFrames>15&&renderer.getPixelRatio()>1){renderer.setPixelRatio(1);renderer.setSize(innerWidth,innerHeight,false);host.dataset.quality='adaptive';slowFrames=0;}
    }
    host.dataset.running='true';frame=requestAnimationFrame(tick);
  };
  const start=()=>{if(!frame&&!document.hidden&&visible&&!isPaused()&&!lost){lastFrame=performance.now();frame=requestAnimationFrame(tick);}};
  const stop=()=>{cancelAnimationFrame(frame);frame=0;host.dataset.running='false';};
  const sync=()=>{if(document.hidden||!visible||isPaused())stop();else start();};
  const resize=()=>{renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();draw();};
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',sync);
  document.addEventListener('experience:motion',sync);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});observer.observe(document.querySelector('main'));
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;stop();document.body.classList.remove('scene-ready');host.dataset.scene='fallback';});
  resize();draw();
  host.dataset.scene='three';host.dataset.quality='balanced';
  host.dataset.triangles=String(renderer.info.render.triangles);
  document.body.classList.add('scene-ready');start();
  return ()=>{stop();observer.disconnect();window.removeEventListener('resize',resize);window.removeEventListener('pointermove',onPointer);document.removeEventListener('visibilitychange',sync);document.removeEventListener('experience:motion',sync);scene.traverse(object=>{object.geometry?.dispose();if(object.material){const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(material=>{material.map?.dispose();material.dispose();});}});environmentMap.dispose();renderer.dispose();renderer.domElement.remove();};
}
