import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {smooth} from './director.js';
import fragments from './brand-fragments.json' with {type:'json'};

// The same six machined surfaces have a distinct, business-relevant arrangement.
export function nodePose(form,index){
  const column=index%2,row=Math.floor(index/2),x=column ? .64 : -.64,y=(1-row)*1.23;
  if(form===0)return {position:[x,y,(row-1)*.13],rotation:[-.08,column ? .12 : -.12,0],scale:[1,1,1]};
  if(form===1)return {position:[x,(1-row)*.86,(row-1)*.83],rotation:[-Math.PI*.38,0,0],scale:[1.15,1.1,1]};
  if(form===2){const angle=index*Math.PI/3;return {position:[Math.cos(angle)*1.32,Math.sin(angle)*1.32,(index%2?-.25:.25)],rotation:[-.18,Math.sin(angle)*.28,angle-Math.PI/2],scale:[.83,.83,1]};}
  const positions=[[0,0,1],[0,0,-1],[-1,0,0],[1,0,0],[0,1,0],[0,-1,0]];
  const rotations=[[0,0,0],[0,Math.PI,0],[0,-Math.PI/2,0],[0,Math.PI/2,0],[-Math.PI/2,0,0],[Math.PI/2,0,0]];
  return {position:positions[index],rotation:rotations[index],scale:[1.72,1.53,1]};
}

export function createSystems(materials){
  const group=new THREE.Group(),tiles=[],accents=[];
  const shellGeometry=new RoundedBoxGeometry(1.12,1.10,.12,3,.07);
  const faceGeometry=new RoundedBoxGeometry(1.02,1,.033,3,.045);
  const stripeGeometry=new RoundedBoxGeometry(.53,.027,.025,2,.01);
  const screwGeometry=new THREE.CylinderGeometry(.022,.022,.025,12);
  for(let i=0;i<6;i++){
    const tile=new THREE.Group();
    tile.add(new THREE.Mesh(shellGeometry,materials.chrome));
    const face=new THREE.Mesh(faceGeometry,materials.graphite);face.position.z=.074;tile.add(face);
    const accent=new THREE.Mesh(stripeGeometry,materials.enamel);accent.position.set(0,-.34,.10);tile.add(accent);accents.push(accent);
    // Each discipline carries one actual piece of the identity it came from.
    const shapes=fragments.fragments[i].shapes.map(data=>{const shape=new THREE.Shape(data.outline.map(p=>new THREE.Vector2(...p)));data.holes.forEach(ring=>shape.holes.push(new THREE.Path(ring.map(p=>new THREE.Vector2(...p)))));return shape;});
    const engraving=new THREE.ExtrudeGeometry(shapes,{depth:.025,bevelEnabled:true,bevelSize:.005,bevelThickness:.005,bevelSegments:2,curveSegments:1});engraving.center();
    const emblem=new THREE.Mesh(engraving,materials.enamel);emblem.scale.setScalar(.44);emblem.position.set(0,.06,.106);tile.add(emblem);
    for(const x of [-.42,.42])for(const y of [-.39,.39]){const screw=new THREE.Mesh(screwGeometry,materials.chrome);screw.rotation.x=Math.PI/2;screw.position.set(x,y,.104);tile.add(screw);}
    tiles.push(tile);group.add(tile);
  }
  const core=new THREE.Mesh(new RoundedBoxGeometry(.62,.62,.35,3,.08),materials.copper);group.add(core);
  const rails=[],up=new THREE.Vector3(0,1,0),difference=new THREE.Vector3(),destination=new THREE.Vector3(),unit=new THREE.Vector3();
  const railGeometry=new THREE.CylinderGeometry(.018,.018,1,12);
  for(const [from,to] of [[0,1],[0,2],[1,3],[2,3],[2,4],[3,5],[4,5]]){const mesh=new THREE.Mesh(railGeometry,materials.copper);group.add(mesh);rails.push({mesh,from,to});}
  const q1=new THREE.Quaternion(),q2=new THREE.Quaternion(),euler=new THREE.Euler();
  const formations=Array.from({length:4},(_,form)=>Array.from({length:6},(_,index)=>nodePose(form,index)));
  return {group,update(form,weight,focus=-1){
    const before=Math.min(2,Math.floor(form)),after=Math.min(3,before+1),mix=smooth(form,before,after);
    tiles.forEach((tile,index)=>{
      const a=formations[before][index],b=formations[after][index];
      tile.position.set(...a.position).lerp(destination.set(...b.position),mix);
      tile.position.z+=focus===index ? .19 : 0;
      q1.setFromEuler(euler.set(...a.rotation));q2.setFromEuler(euler.set(...b.rotation));tile.quaternion.copy(q1).slerp(q2,mix);
      tile.scale.set(...a.scale).lerp(destination.set(...b.scale),mix).multiplyScalar(weight);
      accents[index].scale.x=focus===index?1.42:1;
    });
    core.scale.setScalar(weight*(.72+smooth(form,1.2,2.8)*.4));core.rotation.set(form*.4,form*.7,form*.2);
    rails.forEach(({mesh,from,to})=>{const a=tiles[from].position,b=tiles[to].position;difference.copy(b).sub(a);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(up,unit.copy(difference).normalize());mesh.scale.set(weight,difference.length(),weight);});
  }};
}

export function createPartnership(materials){
  const group=new THREE.Group();
  const shape=new THREE.Shape(),w=1.85,h=2.70,r=.34;
  const round=(target,width,height,radius)=>{target.moveTo(-width/2+radius,-height/2);target.lineTo(width/2-radius,-height/2);target.quadraticCurveTo(width/2,-height/2,width/2,-height/2+radius);target.lineTo(width/2,height/2-radius);target.quadraticCurveTo(width/2,height/2,width/2-radius,height/2);target.lineTo(-width/2+radius,height/2);target.quadraticCurveTo(-width/2,height/2,-width/2,height/2-radius);target.lineTo(-width/2,-height/2+radius);target.quadraticCurveTo(-width/2,-height/2,-width/2+radius,-height/2);};
  round(shape,w,h,r);const hole=new THREE.Path();round(hole,w-.28,h-.28,r-.07);shape.holes.push(hole);
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:true,bevelSize:.045,bevelThickness:.045,bevelSegments:4,curveSegments:14});geometry.center();
  const left=new THREE.Mesh(geometry,materials.chrome),right=new THREE.Mesh(geometry,materials.copper);group.add(left,right);
  return {group,update(progress,weight){
    left.position.set(-.54,0,.20);right.position.set(.54,0,-.20);
    left.rotation.set(.22+progress*.3,-.5+progress*.35,-.28);
    right.rotation.set(-.22-progress*.3,.65-progress*.25,.28);
    left.scale.setScalar(weight);right.scale.setScalar(weight);
  }};
}
