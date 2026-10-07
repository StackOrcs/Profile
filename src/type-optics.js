import {vertex,fragment} from './shaders/type-optics.js';
import {ending as settings} from './config.js';

// One lazily created, demand-rendered surface. The accessible DOM type stays
// authoritative, and the ordinary outline reveal is the GPU-free fallback.
export function createTypeOptics(section,name){
  const canvas=section.querySelector('.closing-optics');
  const stage=section.querySelector('.closing-stage');
  let gl,program,texture,buffer,uniforms,shaders=[],failed=false,disposed=false;
  let progress=0,pointer=0,frame=0,textureWidth=0,textureHeight=0,lastSize='';
  const compile=(type,source)=>{
    const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);throw new Error('Type optics unavailable');}
    shaders.push(shader);return shader;
  };
  const paintInk=()=>{
    const style=getComputedStyle(name),fontSize=parseFloat(style.fontSize);
    const width=name.offsetWidth,height=name.offsetHeight;
    if(!width||!height)return;
    const scale=Math.min(3,2048/width);
    const ink=document.createElement('canvas');
    ink.width=Math.ceil(width*scale);ink.height=Math.ceil(height*scale);
    const context=ink.getContext('2d');
    context.scale(scale,scale);context.font=`${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
    context.fillStyle='#fff';context.textBaseline='alphabetic';
    const letters=[...name.querySelectorAll('.ending-glyph')];
    const metrics=context.measureText('STACKORCS');
    const baseline=(height-metrics.actualBoundingBoxAscent)/2+metrics.actualBoundingBoxAscent;
    let x=0;
    letters.forEach(letter=>{context.fillText(letter.textContent,x,baseline);x+=letter.parentElement.offsetWidth;});
    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,ink);
    textureWidth=ink.width;textureHeight=ink.height;
  };
  const init=()=>{
    gl=canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:true,powerPreference:'low-power'});
    if(!gl)throw new Error('Type optics unavailable');
    program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Type optics unavailable');
    gl.useProgram(program);
    buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const position=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    uniforms=Object.fromEntries(['rect','texel','progress','strength','bands','density','pointer'].map(key=>[key,gl.getUniformLocation(program,`u_${key}`)]));
    gl.clearColor(0,0,0,0);paintInk();
    section.classList.add('optics-ready');
  };
  const draw=()=>{
    frame=0;if(disposed||failed)return;
    if(!gl&&progress>.005&&progress<.76){try{init();}catch{failed=true;section.classList.remove('optics-ready');return;}}
    if(!gl)return;
    const stageRect=stage.getBoundingClientRect();
    const size=`${stageRect.width.toFixed(1)}/${stageRect.height.toFixed(1)}/${name.offsetWidth}`;
    if(lastSize!==size){
      lastSize=size;canvas.width=Math.round(stageRect.width*settings.opticsPixelRatio);canvas.height=Math.round(stageRect.height*settings.opticsPixelRatio);
      gl.viewport(0,0,canvas.width,canvas.height);paintInk();
    }
    gl.clear(gl.COLOR_BUFFER_BIT);
    if(progress<=.005||progress>=.76)return;
    const rect=name.getBoundingClientRect();
    gl.uniform4f(uniforms.rect,(rect.left-stageRect.left)/stageRect.width,(rect.top-stageRect.top)/stageRect.height,rect.width/stageRect.width,rect.height/stageRect.height);
    gl.uniform2f(uniforms.texel,1/textureWidth,1/textureHeight);
    gl.uniform1f(uniforms.progress,progress);gl.uniform1f(uniforms.pointer,pointer);
    const compact=stageRect.width<=760;
    gl.uniform1f(uniforms.strength,compact?settings.mobileOpticsStrength:settings.opticsStrength);
    gl.uniform1f(uniforms.bands,compact?settings.mobileOpticsBands:settings.opticsBands);
    gl.uniform1f(uniforms.density,compact?14:92);
    gl.drawArrays(gl.TRIANGLES,0,6);
  };
  const schedule=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(draw);};
  const move=event=>{if(event.pointerType==='touch'||progress<=.005||progress>=.76)return;pointer=event.clientX/innerWidth*2-1;schedule();};
  const lost=event=>{event.preventDefault();failed=true;section.classList.remove('optics-ready');};
  stage.addEventListener('pointermove',move,{passive:true});canvas.addEventListener('webglcontextlost',lost);
  document.fonts.ready.then(()=>{if(!disposed&&gl&&!failed){paintInk();schedule();}});
  return{
    render(value){progress=value;schedule();},
    destroy(){
      disposed=true;cancelAnimationFrame(frame);stage.removeEventListener('pointermove',move);canvas.removeEventListener('webglcontextlost',lost);section.classList.remove('optics-ready');
      if(gl){gl.clear(gl.COLOR_BUFFER_BIT);if(texture)gl.deleteTexture(texture);if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program);shaders.forEach(shader=>gl.deleteShader(shader));}
    }
  };
}
