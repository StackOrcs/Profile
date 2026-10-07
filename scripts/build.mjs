import {build} from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
await import('./slice-brand.mjs');
const result = await build({
  absWorkingDir:root,entryPoints:[path.join(root,'src/experience.js')],bundle:true,splitting:true,
  format:'esm',target:['es2022'],outdir:root,entryNames:'experience',chunkNames:'assets/[name]-[hash]',
  minify:true,metafile:true,legalComments:'linked',logLevel:'info'
});
const outputs = new Set(Object.keys(result.metafile.outputs).map(file=>path.resolve(root,file)));
const assetRoot = path.join(root,'assets');
for (const file of await fs.readdir(assetRoot)) {
  if (!/^(scene|motion|controls|cursor|chunk)-[A-Z0-9]{8}\.js(?:\.LEGAL\.txt)?$/.test(file)) continue;
  const target = path.resolve(assetRoot,file);
  const related = target.endsWith('.LEGAL.txt') ? target.slice(0,-10) : target;
  if (!outputs.has(target) && !outputs.has(related) && path.dirname(target)===assetRoot) await fs.unlink(target);
}
await fs.mkdir(path.join(root,'verification'),{recursive:true});
await fs.writeFile(path.join(root,'verification/build-meta.json'),JSON.stringify(result.metafile,null,2));
