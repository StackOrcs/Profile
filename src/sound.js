const choiceKey='stackorcs-sound-choice';
const tempo=140;
const stepDuration=60/tempo/4;

export function initSound(){
  const overlay=document.getElementById('sound-consent');
  const enable=document.getElementById('sound-enable');
  const dismiss=document.getElementById('sound-dismiss');
  const toggle=document.getElementById('sound-toggle');
  const score=document.getElementById('score-audio');
  if(!overlay||!enable||!dismiss||!toggle)return;
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  let context=null,master=null,noiseBuffer=null,timer=null,nextTime=0,step=0,active=false;

  const readChoice=()=>{try{return localStorage.getItem(choiceKey)||'';}catch{return '';}};
  const writeChoice=value=>{try{localStorage.setItem(choiceKey,value);}catch{}};
  const setButton=()=>{
    toggle.setAttribute('aria-pressed',String(active));
    toggle.setAttribute('aria-label',active?'Turn sound off':'Turn sound on');
    toggle.innerHTML=active?'Sound on <span>◉</span>':'Sound off <span>◼</span>';
    toggle.dataset.sound=active?'on':'off';
  };
  const setOverlay=visible=>{
    overlay.hidden=!visible;
    document.body.classList.toggle('sound-consent-pending',visible);
  };
  const makeNoise=()=>{
    noiseBuffer=context.createBuffer(1,context.sampleRate,context.sampleRate);
    const data=noiseBuffer.getChannelData(0);
    for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
  };
  const gainEnvelope=(node,time,level,duration,attack=.003)=>{
    node.gain.setValueAtTime(.0001,time);
    node.gain.exponentialRampToValueAtTime(Math.max(.0001,level),time+attack);
    node.gain.exponentialRampToValueAtTime(.0001,time+duration);
  };
  const kick=time=>{
    const osc=context.createOscillator(),gain=context.createGain();
    osc.type='sine';osc.frequency.setValueAtTime(150,time);osc.frequency.exponentialRampToValueAtTime(42,time+.16);
    gainEnvelope(gain,time,.72,.24,.002);osc.connect(gain).connect(master);osc.start(time);osc.stop(time+.27);
  };
  const snare=time=>{
    const noise=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();
    noise.buffer=noiseBuffer;filter.type='bandpass';filter.frequency.value=1800;filter.Q.value=.7;gainEnvelope(gain,time,.22,.16,.002);noise.connect(filter).connect(gain).connect(master);noise.start(time);noise.stop(time+.19);
    const osc=context.createOscillator(),toneGain=context.createGain();osc.type='triangle';osc.frequency.setValueAtTime(190,time);gainEnvelope(toneGain,time,.13,.11,.002);osc.connect(toneGain).connect(master);osc.start(time);osc.stop(time+.13);
  };
  const hat=(time,level=.06)=>{
    const noise=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();
    noise.buffer=noiseBuffer;filter.type='highpass';filter.frequency.value=6200;gainEnvelope(gain,time,level,.045,.001);noise.connect(filter).connect(gain).connect(master);noise.start(time);noise.stop(time+.06);
  };
  const bass=(time,frequency)=>{
    if(!frequency)return;
    const osc=context.createOscillator(),filter=context.createBiquadFilter(),gain=context.createGain();
    osc.type='sawtooth';osc.frequency.value=frequency;filter.type='lowpass';filter.frequency.setValueAtTime(420,time);filter.frequency.exponentialRampToValueAtTime(120,time+.28);filter.Q.value=4;gainEnvelope(gain,time,.2,.3,.006);osc.connect(filter).connect(gain).connect(master);osc.start(time);osc.stop(time+.34);
  };
  const bell=time=>{
    const bus=context.createGain(),filter=context.createBiquadFilter();filter.type='bandpass';filter.frequency.value=1100;filter.Q.value=4;bus.gain.value=.11;bus.connect(filter).connect(master);
    for(const [frequency,level] of [[560,.9],[845,.55]]){const osc=context.createOscillator(),gain=context.createGain();osc.type='square';osc.frequency.value=frequency;gainEnvelope(gain,time,level,.12,.001);osc.connect(gain).connect(bus);osc.start(time);osc.stop(time+.14);}
  };
  const bassPattern=[36.71,0,36.71,43.65,0,32.70,36.71,0,36.71,0,43.65,0,32.70,0,36.71,0];
  const scheduleStep=(time,index)=>{
    const beat=index%16;
    if([0,3,6,8,11,14].includes(beat))kick(time);
    if(beat===4||beat===12)snare(time);
    if(index%2===0)hat(time,index%4===2?.075:.052);
    if(beat%2===0)bass(time,bassPattern[beat]);
    if(beat===3||beat===7||beat===11||beat===15)bell(time);
  };
  const pump=()=>{
    if(!context||!active)return;
    while(nextTime<context.currentTime+.12){scheduleStep(nextTime,step);nextTime+=stepDuration;step=(step+1)%32;}
  };
  const start=()=>{
    if(active)return;
    if(score){
      active=true;score.volume=.22;score.currentTime=0;
      const play=score.play();
      if(play?.catch)play.catch(()=>{active=false;setButton();});
      setButton();
      return;
    }
    if(!AudioContextClass)return;
    active=true;context=new AudioContextClass();master=context.createGain();master.gain.value=.0001;master.connect(context.destination);makeNoise();
    const now=context.currentTime;master.gain.exponentialRampToValueAtTime(.18,now+.35);nextTime=now+.05;step=0;timer=setInterval(pump,25);pump();setButton();
  };
  const stop=()=>{
    if(!active)return;
    active=false;clearInterval(timer);timer=null;
    if(score){score.pause();score.currentTime=0;}
    const oldContext=context,oldMaster=master;context=null;master=null;
    if(oldMaster&&oldContext){oldMaster.gain.cancelScheduledValues(oldContext.currentTime);oldMaster.gain.setValueAtTime(Math.max(.0001,oldMaster.gain.value),oldContext.currentTime);oldMaster.gain.exponentialRampToValueAtTime(.0001,oldContext.currentTime+.12);setTimeout(()=>oldContext.close(),220);}
    setButton();
  };
  const stored=readChoice();setOverlay(!stored);setButton();
  enable.addEventListener('click',()=>{writeChoice('enabled');setOverlay(false);start();});
  dismiss.addEventListener('click',()=>{writeChoice('dismissed');setOverlay(false);stop();});
  toggle.addEventListener('click',()=>{if(active){stop();writeChoice('dismissed');}else{start();writeChoice('enabled');}});
  document.addEventListener('visibilitychange',()=>{
    if(score)score.muted=document.hidden;
    if(master&&context){const time=context.currentTime;master.gain.cancelScheduledValues(time);master.gain.setTargetAtTime(document.hidden ? .0001 : .18,time,.04);}
  });
  return()=>{stop();enable.removeEventListener('click',start);dismiss.removeEventListener('click',stop);};
}
