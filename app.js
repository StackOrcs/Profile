const projects = {
  modastitch: {title:'ModaStitch',kind:'COMMERCE PLATFORM',category:'ECOMMERCE / CLIENT WORK',description:'A clothing storefront with product discovery, cart and checkout, inventory controls, and an admin workspace.',tags:['Storefront & checkout','Inventory & admin','Customer analytics'],image:'assets/modastitch.webp',alt:'Actual ModaStitch clothing storefront with shopping navigation and collection imagery',label:'modastitch.com',href:'https://modastitch.com',link:'Visit project'},
  rivixa: {title:'Rivixa',kind:'HEALTHCARE WEBSITE',category:'LIFESCIENCES / CLIENT WORK',description:'A healthcare company website with three therapeutic areas, a searchable product catalogue, and product enquiry flows.',tags:['146 product records','Search & filters','Company & enquiries'],image:'assets/rivixa.webp',alt:'Actual Rivixa Lifesciences website with the headline Advancing science, Caring for life and clinical imagery',label:'Rivixa Lifesciences / website preview',href:'assets/rivixa.webp',link:'View preview'},
  meetgrid: {title:'MeetGrid',kind:'SCHEDULING PRODUCT',category:'TEAM SCHEDULING / PRODUCT ENGINEERING',description:'One workspace to match team availability with the right room. Includes recurring meetings, bookings, and plan-based tools.',tags:['People + room matching','Recurring meetings','Billing & reports'],image:'assets/meetgrid.webp',alt:'Actual MeetGrid website with a team availability preview and people plus place scheduling',label:'meetgrid.stackorcs.com',href:'https://meetgrid.stackorcs.com',link:'Visit project'},
  chatsaver: {title:'ChatSaver',kind:'KNOWLEDGE PRODUCT',category:'OFFLINE-FIRST / PRODUCT ENGINEERING',description:'A knowledge vault that turns ChatGPT exports into editable, searchable notes, with offline access and cross-device recovery.',tags:['Offline-first PWA','Notes & search','Sync & recovery'],image:'assets/chatsaver.webp',alt:'Actual ChatSaver interface with ChatGPT import, blank note creation, and vault recovery controls',label:'chatsaver.stackorcs.com',href:'https://chatsaver.stackorcs.com',link:'Visit project'}
};
const tabs = [...document.querySelectorAll('.project-tab')];
const keys = Object.keys(projects);
const byId = id => document.getElementById(id);
const media = document.querySelector('.project-media');
const images = new Map([...media.querySelectorAll('img')].map(image => [image.dataset.project, image]));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let activeProject = 'modastitch';
let detailAnimation;
function updateMediaState() {
  const image = images.get(activeProject);
  const pending = !image.classList.contains('is-ready');
  media.classList.toggle('is-loading', pending);
  media.classList.toggle('is-error', image.dataset.failed === 'true');
  media.setAttribute('aria-busy', String(pending && image.dataset.failed !== 'true'));
  byId('preview-status').textContent = image.dataset.failed === 'true' ? 'Preview unavailable. Use the project link below.' : 'Loading project preview…';
}
// Keep the actual image elements mounted and decode once, before any tab click.
images.forEach(image => {
  const ready = async () => {
    try { await image.decode(); } catch { if (!image.naturalWidth) return failed(); }
    image.classList.add('is-ready');
    delete image.dataset.failed;
    if (image.dataset.project === activeProject) updateMediaState();
  };
  const failed = () => {
    image.dataset.failed = 'true';
    if (image.dataset.project === activeProject) updateMediaState();
  };
  image.addEventListener('load', ready, {once:true});
  image.addEventListener('error', failed, {once:true});
  if (image.complete) { if (image.naturalWidth) ready(); else failed(); }
});
updateMediaState();
function chooseProject(key, updateUrl = true) {
  const data = projects[key]; if(!data) return;
  const changed = activeProject !== key;
  activeProject = key;
  tabs.forEach(tab => {const selected=tab.dataset.project===key;tab.classList.toggle('active',selected);tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});
  byId('project-panel').setAttribute('aria-labelledby','tab-'+key);
  byId('project-title').textContent=data.title;
  byId('project-category').textContent=data.category;
  byId('project-description').textContent=data.description;
  byId('preview-kind').textContent=data.kind;
  byId('browser-label').textContent=data.label;
  byId('project-link').href=data.href;
  byId('project-link').setAttribute('aria-label',data.link+' — '+data.title);
  byId('project-link-label').textContent=data.link;
  byId('project-tags').replaceChildren(...data.tags.map(tag=>{const li=document.createElement('li');li.textContent=tag;return li;}));
  document.querySelector('.work-count').textContent=`0${keys.indexOf(key)+1} / 04`;
  document.querySelector('.preview-stage').dataset.theme=key;
  images.forEach((image, imageKey) => {
    const selected = imageKey === key;
    image.classList.toggle('is-active', selected);
    image.setAttribute('aria-hidden', String(!selected));
    image.fetchPriority = selected ? 'high' : 'auto';
  });
  updateMediaState();
  if (changed && !reducedMotion.matches && !document.body.classList.contains('motion-off')) {
    detailAnimation?.cancel();
    detailAnimation = document.querySelector('.project-detail').animate(
      [{transform:'translateY(5px)'}, {transform:'translateY(0)'}],
      {duration:150, easing:'cubic-bezier(.2,.75,.25,1)'}
    );
  }
  if(updateUrl) history.replaceState(null,'','#'+key);
}

document.addEventListener('experience:motion', event => {if (event.detail.paused) detailAnimation?.cancel();});
tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>chooseProject(tab.dataset.project));
  tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next===undefined)return;event.preventDefault();tabs[next].focus();chooseProject(tabs[next].dataset.project);});
});
const fromHash=()=>{const key=location.hash.slice(1);if(projects[key]){chooseProject(key,false);document.getElementById('work').scrollIntoView({behavior:'instant'});}};
fromHash();window.addEventListener('hashchange',fromHash);
let toastTimer;
function showToast(message){const status=byId('share-status');status.textContent=message;status.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>status.classList.remove('visible'),3500);}
function shareUrl(){const url=new URL(location.href);url.search='';return url.href;}
async function copyLink(){try{await navigator.clipboard.writeText(shareUrl());showToast('Link copied. Ready to share.');if(byId('share-dialog').open)byId('share-dialog').close();}catch{byId('share-url').value=shareUrl();if(!byId('share-dialog').open)byId('share-dialog').showModal();byId('share-url').focus();byId('share-url').select();showToast('Select the link, then copy it.');}}
byId('share-page').addEventListener('click',async()=>{if(navigator.share){try{await navigator.share({title:'StackOrcs Studio — Built with intent.',text:'Strategy, design, engineering, and real work by StackOrcs.',url:shareUrl()});return;}catch(error){if(error.name==='AbortError')return;}}await copyLink();});
byId('copy-share').addEventListener('click',copyLink);
document.querySelector('.dialog-close').addEventListener('click',()=>byId('share-dialog').close());
byId('share-dialog').addEventListener('click',event=>{if(event.target===byId('share-dialog')){const rect=event.target.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.target.close();}});
