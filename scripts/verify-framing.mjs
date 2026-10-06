import assert from 'node:assert/strict';
import {BoxGeometry,Mesh,MeshBasicMaterial,PerspectiveCamera} from 'three';
import {createFramer,samplePose} from '../src/framing.js';
import {scene} from '../src/config.js';

// A conservative fixture includes the full panel plus its separated rear layers.
const subject=new Mesh(new BoxGeometry(3.8,3.9,3.4),new MeshBasicMaterial());
let checks=0;
for(const [width,height] of [[320,740],[390,844],[768,1024],[1280,720],[1440,900],[1920,1080]]){
  for(const fov of [25,scene.fov,55]){
    const camera=new PerspectiveCamera(fov,width/height,.1,80);
    camera.position.z=width<=760?scene.mobileCameraZ:scene.cameraZ;
    const fit=createFramer(subject,camera),stage=width<=760?scene.mobileStage:scene.desktopStage;
    for(let progress=0;progress<=4.16;progress+=.04){
      const pose=samplePose(scene.shots,progress);
      subject.rotation.set(pose[0],pose[1],pose[2]);subject.scale.setScalar(pose[3]);
      const [left,top,right,bottom]=fit(stage);
      assert(left>=stage[0]-.004&&right<=stage[2]+.004&&top>=stage[1]-.004&&bottom<=stage[3]+.004,`Clipped at ${width}x${height}, FOV ${fov}, pose ${progress}: ${[left,top,right,bottom]}`);
      checks++;
    }
  }
}
for(let boundary=1;boundary<4;boundary++){
  const epsilon=.0001,left=samplePose(scene.shots,boundary-epsilon),middle=samplePose(scene.shots,boundary),right=samplePose(scene.shots,boundary+epsilon);
  for(let axis=0;axis<5;axis++)assert(Math.abs((middle[axis]-left[axis])/epsilon-(right[axis]-middle[axis])/epsilon)<.005,'Pose velocity must remain continuous.');
}
subject.geometry.dispose();subject.material.dispose();
console.log(`${checks} camera/pose containment checks and chapter-boundary continuity checks passed.`);
