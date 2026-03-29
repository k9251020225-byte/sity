(function(){
var $=function(id){return document.getElementById(id)};
var esc=function(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML};

// PIN
var isNew=true;
$('pin-toggle').onclick=function(){isNew=!isNew;$('pin-desc').innerHTML=isNew?'Придумайте код для вашего дневника.':'Введите ваш код для входа.';$('pin-toggle').textContent=isNew?'У меня уже есть код':'Создать новый';$('pin-error').textContent=''};
$('pin-go').onclick=tryPin;$('pin-input').onkeydown=function(e){if(e.key==='Enter')tryPin()};
function tryPin(){var c=$('pin-input').value.trim();if(c.length<3){$('pin-error').textContent='Минимум 3 символа';return}var sk='opora_'+c;if(isNew){if(localStorage.getItem(sk+'_d')){$('pin-error').textContent='Код занят.';return}localStorage.setItem(sk+'_d','{}')}else{if(!localStorage.getItem(sk+'_d')){$('pin-error').textContent='Не найден.';return}}$('pin-screen').style.display='none';$('app').style.display='block';window.OPORA_SK=sk;window.OPORA_$=$;window.OPORA_esc=esc;initAll(sk)}

// DB
function openDB(n,cb){var r=indexedDB.open(n,1);r.onupgradeneeded=function(e){var db=e.target.result;if(!db.objectStoreNames.contains('daily'))db.createObjectStore('daily');if(!db.objectStoreNames.contains('reviews'))db.createObjectStore('reviews')};r.onsuccess=function(e){cb(e.target.result)};r.onerror=function(){cb(null)}}
window.dbPut=function(db,s,k,v,cb){var tx=db.transaction(s,'readwrite');tx.objectStore(s).put(v,k);tx.oncomplete=function(){if(cb)cb()}};
window.dbGet=function(db,s,k,cb){var tx=db.transaction(s,'readonly');var r=tx.objectStore(s).get(k);r.onsuccess=function(){cb(r.result||null)}};
window.dbGetAll=function(db,s,cb){var tx=db.transaction(s,'readonly');var rk=tx.objectStore(s).getAllKeys();var rv=tx.objectStore(s).getAll();rk.onsuccess=function(){rv.onsuccess=function(){var res=[];for(var i=0;i<rk.result.length;i++)res.push({key:rk.result[i],val:rv.result[i]});cb(res)}}};

function initAll(sk){
  var DKEY=sk+'_d';var db=null;
  window.OPORA_DB=null;
  window.loadD=function(){try{return JSON.parse(localStorage.getItem(DKEY))||{}}catch(e){return{}}};
  window.saveD=function(d){localStorage.setItem(DKEY,JSON.stringify(d))};
  openDB(sk+'_db',function(d){db=d;window.OPORA_DB=d;if(window.initDay)initDay();if(window.initGoals)initGoals();if(window.initHabits)initHabits()});

  // Letter
  var lw=$('letter-wrap'),le=$('letter-el');
  var lb=document.createElement('button');lb.className='btn btn-secondary btn-sm';lb.textContent='Письмо';lb.style.cssText='display:none;margin:16px auto 0;width:max-content';
  lw.parentNode.insertBefore(lb,lw.nextSibling);
  $('letter-close').onclick=function(){lw.style.display='none';lb.style.display='block'};
  lb.onclick=function(){lw.style.display='block';lb.style.display='none'};

  // Tabs
  document.querySelectorAll('.tab').forEach(function(t){t.onclick=function(){
    document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('active')});t.classList.add('active');
    document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('active')});$('panel-'+t.dataset.tab).classList.add('active');
    if(t.dataset.tab==='day'&&window.renderDay)renderDay();
    if(t.dataset.tab==='review'&&window.renderReview)renderReview();
    if(t.dataset.tab==='goals'&&window.renderGoals)renderGoals();
    if(t.dataset.tab==='habits'&&window.renderHabits)renderHabits();
    if(t.dataset.tab==='start'&&window.renderStart)renderStart();
    if(t.dataset.tab==='add'&&window.renderAdd)renderAdd();
  }});

  // Profile
  var data=loadD();
  $('p-name').value=data.pname||'';$('p-birth').value=data.pbirth||'';
  var prof={rules:data.rules||[],values:data.values||[]};
  function rPL(items,cid,type){var el=$(cid),h='';items.forEach(function(item,i){h+='<div class="list-item"><span>'+esc(item)+'</span><button onclick="window._rmP(\''+type+'\','+i+')">&times;</button></div>'});el.innerHTML=h}
  function rPLs(){rPL(prof.rules,'p-rules-list','rules');rPL(prof.values,'p-values-list','values')}
  rPLs();
  function addP(iid,type){var inp=$(iid),v=inp.value.trim();if(!v)return;prof[type].push(v);inp.value='';rPLs()}
  $('p-rule-add').onclick=function(){addP('p-rule-input','rules')};
  $('p-value-add').onclick=function(){addP('p-value-input','values')};
  $('p-rule-input').onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();addP('p-rule-input','rules')}};
  $('p-value-input').onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();addP('p-value-input','values')}};
  window._rmP=function(type,i){prof[type].splice(i,1);rPLs()};
  $('p-save').onclick=function(){data.pname=$('p-name').value;data.pbirth=$('p-birth').value;data.rules=prof.rules;data.values=prof.values;saveD(data);alert('Сохранено!')};

  // Init other modules
  if(window.initStart)initStart();
  if(window.initAdd)initAdd();
  if(window.renderDay)renderDay();
}
})();
