import {scene,motion} from './config.js';
export function initControls(){
  const panel=document.createElement('details');panel.className='direction-controls';panel.open=true;
  const title=document.createElement('summary');title.textContent='Art direction';panel.append(title);
  const controls=[['Camera FOV',scene,'fov',25,55,1],['Exposure',scene,'exposure',.5,2,.01],['Subject scale',scene,'desktopScale',.6,1.5,.01],['Layer separation',scene,'layerSeparation',0,2.4,.01],['Reveal duration',motion,'revealDuration',.3,2,.05],['Media tilt',motion,'mediaTilt',0,12,.5]];
  controls.forEach(([name,object,key,min,max,step])=>{
    const label=document.createElement('label');const text=document.createElement('span');text.textContent=name;
    const output=document.createElement('output');output.textContent=object[key];
    const input=document.createElement('input');input.type='range';input.min=min;input.max=max;input.step=step;input.value=object[key];input.setAttribute('aria-label',name);
    input.addEventListener('input',()=>{object[key]=Number(input.value);output.textContent=input.value;});
    input.addEventListener('change',()=>document.dispatchEvent(new CustomEvent('experience:direction')));
    label.append(text,output,input);panel.append(label);
  });
  const note=document.createElement('p');note.textContent='Live preview. Save chosen values in src/config.js.';panel.append(note);document.body.append(panel);
}
