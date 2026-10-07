import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import contours from './brand-contours.json' with {type:'json'};
import fragmentData from './brand-fragments.json' with {type:'json'};
const makeShapes=data=>data.map(item=>{const shape=new THREE.Shape(item.outline.map(p=>new THREE.Vector2(...p)));item.holes.forEach(points=>shape.holes.push(new THREE.Path(points.map(p=>new THREE.Vector2(...p)))));return shape;});

// Original logo contours, with closed, independently machined fragments.
export function createBrand({enamel,copper,chrome,graphite,glass}){
  const sculpture=new THREE.Group();
  const face=new THREE.Group();sculpture.add(face);
  const shapes=contours.shapes.map(data=>{
    const shape=new THREE.Shape(data.outline.map(p=>new THREE.Vector2(...p)));
    data.holes.forEach(points=>shape.holes.push(new THREE.Path(points.map(p=>new THREE.Vector2(...p)))));
    return shape;
  });
  const brandGeometry=new THREE.ExtrudeGeometry(shapes,{depth:.18,steps:1,bevelEnabled:true,bevelThickness:.016,bevelSize:.011,bevelSegments:5,curveSegments:1});
  brandGeometry.computeBoundingBox();
  const origin=brandGeometry.boundingBox.getCenter(new THREE.Vector3());
  brandGeometry.translate(-origin.x,-origin.y,-origin.z);
  const brand=new THREE.Mesh(brandGeometry,[enamel,copper]);face.add(brand);
  const backing=new THREE.Mesh(brandGeometry,chrome);backing.position.z=-.12;backing.scale.set(1.002,1.002,.58);face.add(backing);

  const roundedShape=(w,h,r)=>{
    const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);
    s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s;
  };
  const frameShape=roundedShape(3.76,3.84,.24);
  const inner=roundedShape(3.56,3.64,.17);frameShape.holes.push(new THREE.Path(inner.getPoints(12)));
  const frameGeometry=new THREE.ExtrudeGeometry(frameShape,{depth:.095,bevelEnabled:true,bevelSize:.015,bevelThickness:.018,bevelSegments:4,steps:1,curveSegments:12});frameGeometry.center();
  const frameMesh=new THREE.Mesh(frameGeometry,chrome);frameMesh.position.z=-.38;sculpture.add(frameMesh);
  const window=new THREE.Mesh(new RoundedBoxGeometry(3.57,3.65,.055,4,.12),glass);window.position.z=-.41;sculpture.add(window);
  const chassis=new THREE.Group();sculpture.add(chassis);
  const plate=new THREE.Mesh(new RoundedBoxGeometry(3.5,3.6,.15,5,.2),graphite);chassis.add(plate);
  const core=new THREE.Mesh(new RoundedBoxGeometry(1.25,1.25,.19,4,.1),chrome);core.position.z=.16;chassis.add(core);
  const coreFace=new THREE.Mesh(new RoundedBoxGeometry(1.05,1.05,.035,3,.07),graphite);coreFace.position.z=.275;chassis.add(coreFace);
  const coreBadge=new THREE.Mesh(new THREE.ExtrudeGeometry(shapes,{depth:.025,bevelEnabled:false,curveSegments:1}),enamel);
  coreBadge.geometry.center();coreBadge.scale.setScalar(.21);coreBadge.position.z=.31;chassis.add(coreBadge);
  const pins=new THREE.InstancedMesh(new THREE.BoxGeometry(.045,.115,.035),chrome,64);
  const dummy=new THREE.Object3D();let pin=0;
  for(let side=0;side<4;side++)for(let i=0;i<16;i++){
    dummy.position.set((i-7.5)*.061,side%2?-.72:.72,.17);dummy.rotation.z=0;
    if(side>=2){dummy.position.set(side===2?-.72:.72,(i-7.5)*.061,.17);dummy.rotation.z=Math.PI/2;}
    dummy.updateMatrix();pins.setMatrixAt(pin++,dummy.matrix);
  }
  chassis.add(pins);
  const traces=[];
  for(let side=0;side<4;side++)for(let i=0;i<8;i++){
    const a=(i-3.5)*.17,distance=1.22+(i%3)*.08;
    const route=[[a,.8,.086],[a,distance,.086],[a+(i%2?.17:-.17),distance+.16,.086],[a+(i%2?.17:-.17),1.65,.086]];
    const angle=side*Math.PI/2;
    for(let j=0;j<route.length-1;j++)for(const point of [route[j],route[j+1]])traces.push(new THREE.Vector3(point[0]*Math.cos(angle)-point[1]*Math.sin(angle),point[0]*Math.sin(angle)+point[1]*Math.cos(angle),point[2]));
  }
  chassis.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(traces),new THREE.LineBasicMaterial({color:0xae5f30,transparent:true,opacity:.72})));
  const fasteners=new THREE.InstancedMesh(new THREE.CylinderGeometry(.05,.05,.028,20),chrome,4);
  [[-1.55,-1.6],[1.55,-1.6],[-1.55,1.6],[1.55,1.6]].forEach(([x,y],i)=>{dummy.position.set(x,y,.095);dummy.rotation.set(Math.PI/2,0,0);dummy.updateMatrix();fasteners.setMatrixAt(i,dummy.matrix);});chassis.add(fasteners);
  const base=new THREE.Mesh(frameGeometry,copper);base.position.z=-1;sculpture.add(base);

  const fragments=new THREE.Group();face.add(fragments);
  const pieces=fragmentData.fragments.map(data=>{
    const geometry=new THREE.ExtrudeGeometry(makeShapes(data.shapes),{depth:.18,steps:1,bevelEnabled:true,bevelThickness:.016,bevelSize:.011,bevelSegments:5,curveSegments:1});
    geometry.computeBoundingBox();const center=geometry.boundingBox.getCenter(new THREE.Vector3());
    geometry.translate(-center.x,-center.y,-center.z);
    const mesh=new THREE.Mesh(geometry,[enamel,copper]),home=center.sub(origin);fragments.add(mesh);return {mesh,home,row:data.row,column:data.column};
  });
  const rearBadge=new THREE.Mesh(brandGeometry,copper);rearBadge.scale.setScalar(.63);rearBadge.rotation.y=Math.PI;rearBadge.position.z=-.105;chassis.add(rearBadge);
  return {group:sculpture,update(gap,division){
    face.position.z=.03+gap*.38;frameMesh.position.z=-.38-gap*.18;window.position.z=-.41-gap*.18;chassis.position.z=-.78-gap*.65;base.position.z=-1-gap;
    brand.visible=backing.visible=division<.005;fragments.visible=division>=.005;
    pieces.forEach(({mesh,home,row,column})=>{mesh.position.copy(home);mesh.position.x+=home.x*division*.50;mesh.position.y+=home.y*division*.38;mesh.position.z+=division*(row*.14+(column?-.16:.16));mesh.rotation.set(division*(row-1)*.12,division*(column?-.22:.22),division*(column?-.04:.04));});
  }};
}
