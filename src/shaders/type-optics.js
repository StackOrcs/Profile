export const vertex=`
attribute vec2 a_position;
varying vec2 v_uv;
void main(){v_uv=(a_position+1.0)*.5;gl_Position=vec4(a_position,0.0,1.0);}
`;

// Engraved, sliced letterforms. Every mark comes from the real brand typography.
export const fragment=`
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_ink;
uniform vec4 u_rect;
uniform vec2 u_texel;
uniform float u_progress;
uniform float u_strength;
uniform float u_bands;
uniform float u_density;
uniform float u_pointer;
float ink(vec2 uv){
  if(uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0)return 0.0;
  return texture2D(u_ink,uv).a;
}
void main(){
  vec2 uv=(vec2(v_uv.x,1.0-v_uv.y)-u_rect.xy)/u_rect.zw;
  if(uv.y<-.25||uv.y>1.25||uv.x<-.35||uv.x>1.35)discard;
  float p=u_progress;
  float settle=smoothstep(.08,.62,p);
  float band=floor(uv.y*u_bands);
  float gap=abs(fract(uv.y*u_bands)-.5);
  float direction=mod(band,2.0)*2.0-1.0;
  float spread=pow(abs((band+.5)/u_bands-.5)*2.0,1.2);
  uv.x+=direction*spread*u_strength*(1.0-settle);
  uv.y+=sin(uv.x*9.0+band)*.008*(1.0-settle);
  float a=ink(uv);
  float dx=ink(uv+vec2(u_texel.x,0.0))-ink(uv-vec2(u_texel.x,0.0));
  float dy=ink(uv+vec2(0.0,u_texel.y))-ink(uv-vec2(0.0,u_texel.y));
  float edge=clamp((abs(dx)+abs(dy))*2.5,0.0,1.0);
  float engraving=smoothstep(.44,.57,fract(uv.y*u_density+uv.x*3.0));
  float cut=1.0-smoothstep(.43,.49,gap)*(1.0-settle);
  float sweep=p*1.75-.3+u_pointer*.035;
  float beam=exp(-pow((uv.x-sweep)*9.0,2.0));
  float envelope=smoothstep(.005,.10,p)*(1.0-smoothstep(.48,.76,p));
  float alpha=max(a*(.16+engraving*.42),edge*.8)*cut*envelope;
  vec3 copper=vec3(1.0,.27,.015);
  vec3 foil=vec3(1.0,.85,.61);
  vec3 color=mix(copper,foil,clamp(beam*.9+edge*.12,0.0,1.0));
  gl_FragColor=vec4(color*alpha,alpha);
}
`;
