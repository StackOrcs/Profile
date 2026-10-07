import {Box3,Vector3,MathUtils} from 'three';

// Continuous cubic poses preserve velocity across chapter boundaries.
export function samplePose(poses,position){
  const point=MathUtils.clamp(position,poses[0].at,poses.at(-1).at);
  let index=0;
  while(index<poses.length-2&&point>poses[index+1].at)index++;
  const first=poses[index],last=poses[index+1],duration=last.at-first.at;
  const before=poses[Math.max(0,index-1)],after=poses[Math.min(poses.length-1,index+2)];
  const t=(point-first.at)/duration,t2=t*t,t3=t2*t;
  return first.pose.map((value,axis)=>{
    const v1=(last.pose[axis]-before.pose[axis])/(last.at-before.at);
    const v2=(after.pose[axis]-value)/(after.at-first.at);
    return (2*t3-3*t2+1)*value+(t3-2*t2+t)*duration*v1+(-2*t3+3*t2)*last.pose[axis]+(t3-t2)*duration*v2;
  });
}

// Project the whole assembly, including separated rear layers, into a safe stage.
// The reusable bounds/vectors keep this fitting pass allocation-free.
export function createFramer(subject,camera){
  const box=new Box3(),part=new Box3(),corner=new Vector3();
  const measure=()=>{
    subject.updateMatrixWorld(true);box.makeEmpty();
    // Hidden actors must not make the current sculpture shrink into the gutter.
    subject.traverseVisible(object=>{
      if(!object.geometry)return;
      if(object.isInstancedMesh){if(!object.boundingBox)object.computeBoundingBox();part.copy(object.boundingBox);}
      else{if(!object.geometry.boundingBox)object.geometry.computeBoundingBox();part.copy(object.geometry.boundingBox);}
      box.union(part.applyMatrix4(object.matrixWorld));
    });
    let left=Infinity,right=-Infinity,top=-Infinity,bottom=Infinity;
    for(let i=0;i<8;i++){
      corner.set(i&1?box.max.x:box.min.x,i&2?box.max.y:box.min.y,i&4?box.max.z:box.min.z).project(camera);
      left=Math.min(left,corner.x);right=Math.max(right,corner.x);top=Math.max(top,corner.y);bottom=Math.min(bottom,corner.y);
    }
    return {left,right,top,bottom};
  };
  return(stage)=>{
    const [l,t,r,b]=stage,left=l*2-1,right=r*2-1,top=1-t*2,bottom=1-b*2;
    const centerX=(left+right)/2,centerY=(top+bottom)/2;
    subject.position.set(0,0,0);camera.updateMatrixWorld(true);
    let rect;
    for(let pass=0;pass<5;pass++){
      rect=measure();
      const ratio=Math.min(1,(right-left)/(rect.right-rect.left),(top-bottom)/(rect.top-rect.bottom));
      if(ratio<.999)subject.scale.multiplyScalar(ratio*.985);
      if(ratio<.999)rect=measure();
      const distance=camera.position.z-(box.min.z+box.max.z)/2;
      const unit=Math.tan(MathUtils.degToRad(camera.fov)/2)*distance;
      subject.position.x+=(centerX-(rect.left+rect.right)/2)*unit*camera.aspect;
      subject.position.y+=(centerY-(rect.top+rect.bottom)/2)*unit;
    }
    rect=measure();
    return [(rect.left+1)/2,(1-rect.top)/2,(rect.right+1)/2,(1-rect.bottom)/2];
  };
}
