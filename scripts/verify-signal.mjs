import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {Group,MeshBasicMaterial,PerspectiveCamera} from 'three';
import {scene} from '../src/config.js';
import {signalConfig} from '../src/signal-config.js';
import {sampleSignal,signalPerformance,wavePerformance} from '../src/signal-state.js';
import {createSignal} from '../src/signal-scene.js';
import {samplePose,createFramer} from '../src/framing.js';

assert.equal(signalConfig.duration,7);
for(let story=0;story<14;story+=.01)if(story<2||story>=3)assert.equal(sampleSignal(story,3744,720).weight,0,'The performance may only replace chapter 03.');
const atEnd=sampleSignal(2+(signalConfig.scrollScreens-1)/signalConfig.scrollScreens,3744,720);assert(Math.abs(atEnd.progress-1)<1e-12);
for(let progress=0;progress<=1;progress+=.002){
  for(let index=0;index<3;index++)assert(wavePerformance(progress,index).radius<=signalConfig.waveRadius,'Wavefronts must stay inside their stage.');
}
assert(signalPerformance(.56).jaw>.07,'The silent growl must articulate the lower ribbons.');
assert.equal(signalPerformance(.95).jaw,0,'The final signal must settle.');
assert.equal(wavePerformance(0,0).opacity,0);assert.equal(wavePerformance(1,2).opacity,0);
const source=JSON.parse(await fs.readFile(new URL('../src/brand-contours.json',import.meta.url),'utf8'));
const ribbons=JSON.parse(await fs.readFile(new URL('../src/signal-contours.json',import.meta.url),'utf8'));
assert.equal(ribbons.sourceSha256,source.sourceSha256);assert.equal(ribbons.bands.length,signalConfig.bands);
assert(ribbons.bands.every(band=>band.shapes.length&&band.shapes.every(shape=>shape.outline.length>=4)));
const material=new MeshBasicMaterial(),materials={enamel:material,copper:material,chrome:material,graphite:material,glass:material};
const root=new Group(),signal=createSignal(materials);root.add(signal.group);let checks=0;
const pose=samplePose(scene.shots,2.4),state=()=>{signal.group.updateMatrixWorld(true);const values=[];signal.group.traverse(object=>{values.push(...object.matrixWorld.elements,object.visible);if(object.isInstancedMesh)values.push(...object.instanceMatrix.array);if(object.material&&!Array.isArray(object.material))values.push(object.material.opacity);});return values;};
signal.update(.28,1,pose);const earlier=state();signal.update(.65,1,pose);signal.update(.28,1,pose);assert.deepEqual(state(),earlier,'Reverse scrolling must restore the same transforms and material state.');
for(const [width,height] of [[320,740],[390,844],[768,1024],[1280,720],[1440,900],[1920,1080]]){
  const camera=new PerspectiveCamera(scene.fov,width/height,.1,80);camera.position.z=width<=760?scene.mobileCameraZ:scene.cameraZ;const fit=createFramer(root,camera);
  for(let progress=.015;progress<1;progress+=.005){
    const story=2+progress*(signalConfig.scrollScreens-1)/signalConfig.scrollScreens,pose=samplePose(scene.shots,story);
    root.rotation.set(pose[0],pose[1],pose[2]);root.scale.setScalar(pose[3]);signal.update(progress,1,pose);
    const stage=width<=760?[.08,.57,.92,.94]:signalConfig.desktopStage,bounds=fit(stage);
    assert(bounds.every(Number.isFinite));assert(bounds[0]>=stage[0]-.004&&bounds[2]<=stage[2]+.004&&bounds[1]>=stage[1]-.004&&bounds[3]<=stage[3]+.004,`Signal clipped at ${width}x${height}, progress ${progress}`);checks++;
  }
}
const geometries=new Set(),materialsToDispose=new Set();root.traverse(object=>{if(object.geometry)geometries.add(object.geometry);if(object.material)for(const item of Array.isArray(object.material)?object.material:[object.material])materialsToDispose.add(item);});geometries.forEach(item=>item.dispose());materialsToDispose.forEach(item=>item.dispose());
console.log(`${checks} signal-sculpture checks passed; chapter isolation, deterministic scrubbing, pressure waves and source-logo provenance verified.`);
