import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import polygonClipping from 'polygon-clipping';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=JSON.parse(await fs.readFile(path.join(root,'src/brand-contours.json'),'utf8'));
const polygons=source.shapes.map(shape=>[shape.outline,...shape.holes]);
const fragments=[];
for(let row=0;row<3;row++)for(let column=0;column<2;column++){
  const left=column?0:-2,right=column?2:0,top=2-row*4/3,bottom=2-(row+1)*4/3;
  const result=polygonClipping.intersection(polygons,[[[left,bottom],[right,bottom],[right,top],[left,top],[left,bottom]]]);
  fragments.push({row,column,shapes:result.map(rings=>({outline:rings[0],holes:rings.slice(1)}))});
}
await fs.writeFile(path.join(root,'src/brand-fragments.json'),JSON.stringify({sourceSha256:source.sourceSha256,fragments}));
const ring=points=>`M${points.map(([x,y])=>`${x},${-y}`).join('L')}Z`;
const paths=source.shapes.map(shape=>ring(shape.outline)+shape.holes.map(ring).join('')).join('');
await fs.writeFile(path.join(root,'assets/brand-cursor.svg'),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.75 -1.75 3.5 3.5"><path fill="#ff6400" fill-rule="evenodd" d="${paths}"/></svg>`);
console.log('Prepared six closed brand fragments and the exact-outline cursor.');
