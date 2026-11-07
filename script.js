'use strict';
const photos=JSON.parse(document.querySelector('#photo-data').textContent);
const dialog=document.querySelector('#lightbox');
const grid=[...document.querySelectorAll('#photo-grid figure')];
let visible=photos.slice(),current=0,lastTrigger=null;
const byFile=new Map(photos.map(p=>[p.file,p]));
function showPhoto(){
 const p=visible[current];
 const img=document.querySelector('#lb-img');
 img.src=p.src;img.alt=p.camera+' — '+p.file;
 document.querySelector('#lb-title').textContent=p.camera+' / '+p.file;
 document.querySelector('#lb-meta').textContent=p.meta;
 document.querySelector('#lb-count').textContent=String(current+1).padStart(2,'0')+' / '+visible.length;
 document.querySelector('#original').href='pictures/'+p.file;
}
document.querySelectorAll('.photo-open').forEach(button=>button.addEventListener('click',()=>{
 lastTrigger=button;
 const file=button.dataset.file;
 visible=button.closest('#photo-grid')?grid.filter(f=>!f.hidden).map(f=>byFile.get(f.querySelector('button').dataset.file)):photos;
 current=visible.findIndex(p=>p.file===file);
 showPhoto();dialog.showModal();document.body.style.overflow='hidden';
}));
document.querySelector('#close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.style.overflow='';lastTrigger?.focus({preventScroll:true});});
function step(n){current=(current+n+visible.length)%visible.length;showPhoto();}
document.querySelector('#prev').addEventListener('click',()=>step(-1));
document.querySelector('#next').addEventListener('click',()=>step(1));
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}if(e.key==='ArrowRight'){e.preventDefault();step(1);}});
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-filter]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 const filter=button.dataset.filter;
 grid.forEach(f=>{f.hidden=!(filter==='all'||filter===f.dataset.type||filter==='wide'&&f.dataset.type==='sony'&&Number(f.dataset.focal)===16||filter==='tele'&&f.dataset.type==='sony'&&Number(f.dataset.focal)===50);});
 document.querySelector('#count').textContent=grid.filter(f=>!f.hidden).length+' photographs';
}));
function progress(){const total=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.width=(total>0?scrollY/total*100:0)+'%';}
addEventListener('scroll',progress,{passive:true});addEventListener('resize',progress);progress();
