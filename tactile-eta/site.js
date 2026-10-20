document.documentElement.classList.add('js');
const root=document.documentElement;
function setLang(l){root.dataset.lang=l;root.lang=l==='zh'?'zh-CN':'en';try{localStorage.setItem('te-lang',l)}catch(e){}const u=new URL(location.href);if(l==='zh')u.searchParams.set('lang','zh');else u.searchParams.delete('lang');history.replaceState(null,'',u);}
document.querySelectorAll('[data-set-lang]').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.setLang)));

const visibleText=el=>{if(!el)return'';const c=el.cloneNode(true);c.querySelectorAll('[data-l]').forEach(n=>{if(n.dataset.l!==root.dataset.lang)n.remove()});return c.textContent.trim();};
const dialog=document.querySelector('#lightbox');
document.querySelectorAll('.image-button').forEach(button=>button.addEventListener('click',()=>{const img=button.querySelector('img');dialog.querySelector('img').src=img.src;dialog.querySelector('img').alt=img.alt;dialog.querySelector('p').textContent=visibleText(button.parentElement.querySelector('figcaption'));dialog.showModal();}));
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});

document.querySelectorAll('.copy-btn').forEach(btn=>btn.addEventListener('click',async()=>{const t=document.querySelector(btn.dataset.copy).textContent;try{await navigator.clipboard.writeText(t);btn.classList.add('done');setTimeout(()=>btn.classList.remove('done'),1600);}catch(e){}}));

const bar=document.querySelector('.topbar');
const onScroll=()=>bar.classList.toggle('scrolled',scrollY>220);
addEventListener('scroll',onScroll,{passive:true});onScroll();

const links=[...document.querySelectorAll('.nav-links a')];
const targets=links.map(a=>document.querySelector(a.getAttribute('href')));
if('IntersectionObserver' in window){
  const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));}}),{rootMargin:'-45% 0px -50% 0px'});
  targets.forEach(t=>t&&spy.observe(t));
  const rv=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rv.unobserve(e.target);}}),{rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('main>section:not(.stats), .bars, .steps li, .ablation').forEach(el=>{if(!el.classList.contains('bars'))el.classList.add('reveal');rv.observe(el);});
}else{document.querySelectorAll('.bars').forEach(b=>b.classList.add('in'));}
