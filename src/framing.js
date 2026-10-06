import {Box3,Vector3,MathUtils} from 'three';

// Continuous cubic poses preserve velocity across chapter boundaries.
export function samplePose(poses,position){
  const index=Math.min(poses.length-2,Math.floor(position)),t=position-index;
  return poses[index].map((_,axis)=>{
    const p0=poses[Math.max(0,index-1)][axis],p1=poses[index][axis];
    const p2=poses[index+1][axis],p3=poses[Math.min(poses.length-1,index+2)][axis];
    return .5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t*t*t);
  });
}

// Project the whole assembly, including separated rear layers, into a safe stage.
// The reusable bounds/vectors keep this fitting pass allocation-free.
export function createFramer(subject,camera){
  const box=new Box3(),corner=new Vector3();
  const measure=()=>{
    subject.updateMatrixWorld(true);box.setFromObject(subject);
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
