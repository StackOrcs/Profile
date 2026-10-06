export function splitWords(element){
  if(element.dataset.split)return;
  element.dataset.split='true';
  const visit=node=>{
    [...node.childNodes].forEach(child=>{
      if(child.nodeType===3){
        const fragment=document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part=>{
          if(!part)return;
          if(/^\s+$/.test(part)){fragment.append(document.createTextNode(part));return;}
          const mask=document.createElement('span');mask.className='word-mask';
          const word=document.createElement('span');word.className='word';word.textContent=part;
          mask.append(word);fragment.append(mask);
        });
        child.replaceWith(fragment);
      }else if(child.nodeType===1&&child.tagName!=='BR')visit(child);
    });
  };
  visit(element);
}
