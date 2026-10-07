import * as THREE from 'three';
import contours from './brand-contours.json' with {type:'json'};
import slices from './signal-contours.json' with {type:'json'};
import {signalConfig} from './signal-config.js';
import {signalPerformance} from './signal-state.js';
const shapesOf=data=>data.map(item=>{const shape=new THREE.Shape(item.outline.map(point=>new THREE.Vector2(...point)));item.holes.forEach(ring=>shape.holes.push(new THREE.Path(ring.map(point=>new THREE.Vector2(...point)))));return shape;});

// Interference gathers into the original bear and holds its completed form.
export function createSignal(materials){
  const group=new THREE.Group(),ribbons=new THREE.Group();group.add(ribbons);
  const silver=materials.enamel.clone();silver.roughness=.24;
  const noiseColor=new THREE.Color(0xc3c5bd),signalColor=new THREE.Color(0xff6500);
  const amber=materials.enamel.clone();amber.metalness=.78;amber.roughness=.22;
  const bands=slices.bands.map((data,index)=>{
    const geometry=new THREE.ExtrudeGeometry(shapesOf(data.shapes),{depth:.11,steps:1,bevelEnabled:true,bevelThickness:.009,bevelSize:.006,bevelSegments:3,curveSegments:1});
    geometry.translate(-.004,-data.y,-.055);
    const mesh=new THREE.Mesh(geometry,[index%4===0?amber:silver,materials.copper]);ribbons.add(mesh);
    return {mesh,y:data.y+.008,index};
  });
  const carrierMaterial=new THREE.MeshStandardMaterial({color:0x8c8f85,metalness:.85,roughness:.28,transparent:true,opacity:.5,depthWrite:false});
  const carriers=new THREE.InstancedMesh(new THREE.BoxGeometry(1,.012,.025),carrierMaterial,bands.length);group.add(carriers);const carrierPose=new THREE.Object3D();
  const eyeMaterial=new THREE.MeshPhysicalMaterial({color:0xff6400,emissive:0xff5300,emissiveIntensity:.4,metalness:.55,roughness:.22,clearcoat:1,transparent:true,opacity:0,depthWrite:false});
  const eyeGeometry=new THREE.ExtrudeGeometry(shapesOf(contours.shapes.slice(1)),{depth:.025,bevelEnabled:true,bevelSize:.006,bevelThickness:.006,bevelSegments:3,curveSegments:1});eyeGeometry.translate(-.004,.008,0);
  const eyes=new THREE.Mesh(eyeGeometry,eyeMaterial);eyes.position.z=.12;group.add(eyes);
  // Stable framing lets the bear lean and breathe without the camera pumping.
  const proxy=new THREE.Mesh(new THREE.BoxGeometry(4.95,4.45,1.8),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,colorWrite:false}));group.add(proxy);
  return {group,update(progress,weight,parentPose){
    const performance=signalPerformance(progress),noise=(1-performance.focus)*signalConfig.noiseAmount;
    silver.color.lerpColors(noiseColor,signalColor,performance.focus);silver.metalness=.92-performance.focus*.38;
    group.rotation.set(performance.pitch-parentPose[0],performance.yaw-parentPose[1],performance.roll-parentPose[2]);
    group.scale.setScalar(weight);ribbons.scale.setScalar(performance.scale);
    carriers.visible=performance.focus<.995;carrierMaterial.opacity=(1-performance.focus)*.52;
    bands.forEach(({mesh,y,index})=>{
      const q=index/Math.max(1,bands.length-1),angle=q*19+progress*7;
      const jaw=y<-.40?performance.jaw:0;
      mesh.position.set(Math.sin(angle)*noise,y+Math.cos(q*13+progress*5)*noise*.17-jaw,Math.sin(q*17+progress*9)*noise*signalConfig.noiseDepth+jaw*.8);
      mesh.rotation.set(Math.cos(angle)*noise*.18,Math.sin(q*12+progress*6)*noise*.80,Math.cos(q*15+progress*6)*noise*.08);
      mesh.scale.set(1+Math.sin(q*18)*noise*.23,1,1);
      carrierPose.position.set(Math.sin(q*9+progress*7)*noise*.3,y,Math.cos(q*12+progress*6)*noise*.45-.18);
      carrierPose.rotation.set(0,Math.sin(angle)*noise*.22,Math.cos(angle)*noise*.015);
      carrierPose.scale.set((3.2+Math.sin(q*Math.PI)*1.35)*(1-performance.focus),1,1);carrierPose.updateMatrix();carriers.setMatrixAt(index,carrierPose.matrix);
    });
    if(carriers.visible){carriers.instanceMatrix.needsUpdate=true;carriers.computeBoundingBox();}
    proxy.scale.set(1-performance.focus*.26,1-performance.focus*.17,1-performance.focus*.30);
    eyes.scale.setScalar(performance.scale);eyes.position.y=-performance.jaw*.08;
    eyeMaterial.opacity=performance.focus*(.30+performance.breath*.70);eyeMaterial.emissiveIntensity=.35+performance.breath*.95;
  }};
}
