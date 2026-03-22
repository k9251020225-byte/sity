
try{
// Nav scroll
window.addEventListener('scroll',function(){
  var nav=document.getElementById('nav');
  if(nav)nav.classList.toggle('sc',window.scrollY>50);
});
// Hamburger
var mtb=document.getElementById('mtb');
var mo=document.getElementById('mo');
if(mtb&&mo){
  mtb.onclick=function(){mo.classList.toggle('open')};
  var links=mo.getElementsByTagName('a');
  for(var i=0;i<links.length;i++){links[i].onclick=function(){mo.classList.remove('open')}}
}
// Reveal
var revs=document.querySelectorAll('.reveal');
for(var r=0;r<revs.length;r++){revs[r].classList.add('v')}
}catch(e){
var f=document.querySelectorAll('.reveal');
for(var fi=0;fi<f.length;fi++){f[fi].classList.add('v')}
}
