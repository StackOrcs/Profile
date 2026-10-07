const byId=id=>document.getElementById(id);
// Existing shared project hashes resolve directly to their single case study.
const aliases={modastitch:'work',rivixa:'mission-rivixa',meetgrid:'mission-meetgrid',chatsaver:'mission-chatsaver'};
const resolveProject=()=>{const id=aliases[location.hash.slice(1)];if(id)document.getElementById(id).scrollIntoView({behavior:'instant'});};
resolveProject();window.addEventListener('hashchange',resolveProject);
let toastTimer;
function showToast(message){const status=byId('share-status');status.textContent=message;status.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>status.classList.remove('visible'),3500);}
function shareUrl(){const url=new URL(location.href);url.search='';return url.href;}
async function copyLink(){try{await navigator.clipboard.writeText(shareUrl());showToast('Link copied. Ready to share.');if(byId('share-dialog').open)byId('share-dialog').close();}catch{byId('share-url').value=shareUrl();if(!byId('share-dialog').open)byId('share-dialog').showModal();byId('share-url').focus();byId('share-url').select();showToast('Select the link, then copy it.');}}
byId('share-page').addEventListener('click',async()=>{if(navigator.share){try{await navigator.share({title:'StackOrcs Studio · Built with intent.',text:'Strategy, design, engineering, and real work by StackOrcs.',url:shareUrl()});return;}catch(error){if(error.name==='AbortError')return;}}await copyLink();});
byId('copy-share').addEventListener('click',copyLink);
document.querySelector('.dialog-close').addEventListener('click',()=>byId('share-dialog').close());
byId('share-dialog').addEventListener('click',event=>{if(event.target===byId('share-dialog')){const rect=event.target.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.target.close();}});
