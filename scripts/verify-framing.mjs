import assert from 'node:assert/strict';
import {BoxGeometry,Group,Mesh,MeshBasicMaterial,PerspectiveCamera} from 'three';
import fs from 'node:fs/promises';
import polygonClipping from 'polygon-clipping';
import {createFramer,samplePose} from '../src/framing.js';
import {scene} from '../src/config.js';
import {sampleStage} from '../src/stage.js';
import {directScene} from '../src/director.js';
import {nodePose} from '../src/forms.js';
import {createSystems,createPartnership} from '../src/forms.js';
import {createBrand} from '../src/brand.js';

// A conservative fixture includes the full panel plus its separated rear layers.
const subject=new Mesh(new BoxGeometry(3.8,3.9,3.4),new MeshBasicMaterial());
let checks=0;
for(const [width,height] of [[320,740],[390,844],[768,1024],[1280,720],[1440,900],[1920,1080]]){
  for(const fov of [25,scene.fov,55]){
    const camera=new PerspectiveCamera(fov,width/height,.1,80);
    camera.position.z=width<=760?scene.mobileCameraZ:scene.cameraZ;
    const fit=createFramer(subject,camera);
    for(let progress=0;progress<=14;progress+=.04){
      const stage=width<=760?scene.mobileStage:sampleStage(scene.stages,progress);
      const pose=samplePose(scene.shots,progress);
      subject.rotation.set(pose[0],pose[1],pose[2]);subject.scale.setScalar(pose[3]);
      const [left,top,right,bottom]=fit(stage);
      assert(left>=stage[0]-.004&&right<=stage[2]+.004&&top>=stage[1]-.004&&bottom<=stage[3]+.004,`Clipped at ${width}x${height}, FOV ${fov}, pose ${progress}: ${[left,top,right,bottom]}`);
      checks++;
    }
  }
}
for(const {at:boundary} of scene.shots.slice(1,-1)){
  const epsilon=.0001,left=samplePose(scene.shots,boundary-epsilon),middle=samplePose(scene.shots,boundary),right=samplePose(scene.shots,boundary+epsilon);
  for(let axis=0;axis<5;axis++)assert(Math.abs((middle[axis]-left[axis])/epsilon-(right[axis]-middle[axis])/epsilon)<.03,'Pose velocity must remain continuous across chapter and inner-layer beats.');
}
assert(samplePose(scene.shots,3)[1]-samplePose(scene.shots,0)[1]>Math.PI*2,'The opening must complete a real rotation.');
for(let chapter=4;chapter<8;chapter++)assert.notDeepEqual(nodePose(chapter-4,0),nodePose((chapter-3)%4,0),'Each discipline must have a distinct formation.');
for(let position=8;position<11.94;position+=.1)assert.equal(directScene(position).opacity,0,'Real project screens must own the stage.');
assert(directScene(3.5).division>.9,'Craft must physically separate the logo.');
assert(directScene(12.5).partnership>.9,'Partnership needs its own sculpture.');
assert(directScene(12.98).brand>.9,'The closing must resolve through the identity before the final handoff.');
assert(directScene(13.6).opacity<.005,'The final handoff must release the 3D stage to the closing mark.');
const group=new Group();group.add(subject);const hidden=new Mesh(new BoxGeometry(100,100,100),subject.material);hidden.visible=false;group.add(hidden);
const camera=new PerspectiveCamera(scene.fov,1.6,.1,80);camera.position.z=scene.cameraZ;group.scale.setScalar(1);subject.scale.setScalar(1);subject.position.set(0,0,0);subject.rotation.set(0,0,0);
createFramer(group,camera)(scene.desktopStage);assert(group.scale.x>.4,'An inactive sculpture must not shrink the visible sculpture.');
const source=JSON.parse(await fs.readFile(new URL('../src/brand-contours.json',import.meta.url),'utf8'));
const sliced=JSON.parse(await fs.readFile(new URL('../src/brand-fragments.json',import.meta.url),'utf8'));
assert.equal(sliced.sourceSha256,source.sourceSha256);assert.equal(sliced.fragments.length,6);
const polygons=shapes=>shapes.map(shape=>[shape.outline,...shape.holes]);
const original=polygonClipping.union(polygons(source.shapes)),pieces=polygonClipping.union(...sliced.fragments.map(fragment=>polygons(fragment.shapes)));
const ringArea=ring=>Math.abs(ring.reduce((sum,p,i)=>{const q=ring[(i+1)%ring.length];return sum+p[0]*q[1]-q[0]*p[1];},0))/2;
const area=polygons=>polygons.reduce((sum,rings)=>sum+ringArea(rings[0])-rings.slice(1).reduce((holes,ring)=>holes+ringArea(ring),0),0);
assert(area(polygonClipping.xor(original,pieces))<1e-9,'The six pieces must reproduce the logo within floating-point precision.');
// Exercise the actual fragments, tiers, enclosure and paired couplings too.
const material=new MeshBasicMaterial(),materials={enamel:material,copper:material,chrome:material,graphite:material,glass:material};
const actual=new Group(),identity=createBrand(materials),systems=createSystems(materials),partnership=createPartnership(materials);actual.add(identity.group,systems.group,partnership.group);
let actualChecks=0;
for(const [width,height] of [[320,740],[390,844],[768,1024],[1280,720],[1440,900],[1920,1080]]){
  const camera=new PerspectiveCamera(scene.fov,width/height,.1,80);camera.position.z=width<=760?scene.mobileCameraZ:scene.cameraZ;const fit=createFramer(actual,camera);
  for(let position=0;position<=14;position+=.04){
    const direction=directScene(position);if(direction.opacity<.005)continue;
    const pose=samplePose(scene.shots,position),stage=width<=760?scene.mobileStage:sampleStage(scene.stages,position);
    actual.rotation.set(pose[0],pose[1],pose[2]);actual.scale.setScalar(pose[3]);identity.group.visible=direction.brand>.015;identity.group.scale.setScalar(direction.brand);systems.group.visible=direction.systems>.015;partnership.group.visible=direction.partnership>.015;
    identity.update(Math.max(0,pose[4]),direction.division);systems.update(direction.form,direction.systems);partnership.update(Math.max(0,Math.min(1,position-12)),direction.partnership);
    const bounds=fit(stage);assert(bounds.every(Number.isFinite),'Every active actor needs finite projected bounds.');
    assert(bounds[0]>=stage[0]-.004&&bounds[2]<=stage[2]+.004&&bounds[1]>=stage[1]-.004&&bounds[3]<=stage[3]+.004,`Actual sculpture clipped at ${width}x${height}, chapter ${position}`);actualChecks++;
  }
}
const geometries=new Set();actual.traverse(object=>{if(object.geometry)geometries.add(object.geometry);});geometries.forEach(geometry=>geometry.dispose());material.dispose();
hidden.geometry.dispose();
subject.geometry.dispose();subject.material.dispose();
console.log(`${checks} fixture checks and ${actualChecks} actual-sculpture checks passed; rotations, hand-offs, hidden actors and exact fragments verified.`);
