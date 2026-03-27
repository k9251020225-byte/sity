(function(){
function $(id){return document.getElementById(id)}
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}

// PIN
var isNew=true;
$('pin-toggle').onclick=function(){
  isNew=!isNew;
  $('pin-desc').innerHTML=isNew?'Придумайте код для вашего дневника.':'Введите ваш код для входа.';
  $('pin-toggle').textContent=isNew?'У меня уже есть код':'Создать новый дневник';
  $('pin-error').textContent='';
};
$('pin-go').onclick=tryPin;
$('pin-input').onkeydown=function(e){if(e.key==='Enter')tryPin()};
function tryPin(){
  var code=$('pin-input').value.trim();
  if(code.length<3){$('pin-error').textContent='Минимум 3 символа';return}
  var sk='money_pin_'+code;
  if(isNew){
    if(localStorage.getItem(sk+'_data')){$('pin-error').textContent='Код занят.';return}
    localStorage.setItem(sk+'_data','{}');
  }else{
    if(!localStorage.getItem(sk+'_data')){$('pin-error').textContent='Не найден.';return}
  }
  $('pin-screen').style.display='none';
  $('app').style.display='block';
  initApp(sk);
}

// IndexedDB
function openDB(name,cb){
  var req=indexedDB.open(name,1);
  req.onupgradeneeded=function(e){
    var db=e.target.result;
    if(!db.objectStoreNames.contains('expenses'))db.createObjectStore('expenses',{keyPath:'id'});
    if(!db.objectStoreNames.contains('weekly'))db.createObjectStore('weekly');
  };
  req.onsuccess=function(e){cb(e.target.result)};
  req.onerror=function(){cb(null)};
}
function dbPut(db,store,val,cb){
  var tx=db.transaction(store,'readwrite');
  tx.objectStore(store).put(val);
  tx.oncomplete=function(){if(cb)cb()};
}
function dbPutKey(db,store,key,val,cb){
  var tx=db.transaction(store,'readwrite');
  tx.objectStore(store).put(val,key);
  tx.oncomplete=function(){if(cb)cb()};
}
function dbGet(db,store,key,cb){
  var tx=db.transaction(store,'readonly');
  var r=tx.objectStore(store).get(key);
  r.onsuccess=function(){cb(r.result||null)};
}
function dbGetAll(db,store,cb){
  var tx=db.transaction(store,'readonly');
  var r=tx.objectStore(store).getAll();
  r.onsuccess=function(){cb(r.result||[])};
}
function dbClear(db,store,cb){
  var tx=db.transaction(store,'readwrite');
  tx.objectStore(store).clear();
  tx.oncomplete=function(){if(cb)cb()};
}

function initApp(sk){
  var DKEY=sk+'_data';
  var db=null;
  openDB(sk+'_db',function(d){db=d;renderDay()});

  function loadD(){try{return JSON.parse(localStorage.getItem(DKEY))||{}}catch(e){return{}}}
  function saveD(d){localStorage.setItem(DKEY,JSON.stringify(d))}

  // Letter
  $('letter-text').innerHTML=MC.letter;
  var lw=$('letter-wrap'),le=$('letter-el');
  var lb=document.createElement('button');lb.className='btn btn-secondary btn-sm';lb.textContent='Письмо';lb.style.cssText='display:none;margin:16px auto 0;width:max-content';
  lw.parentNode.insertBefore(lb,lw.nextSibling);
  $('letter-close').onclick=function(){lw.style.display='none';lb.style.display='block'};
  lb.onclick=function(){lw.style.display='block';lb.style.display='none'};

  // Tabs
  document.querySelectorAll('.tab').forEach(function(t){
    t.onclick=function(){
      document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('active')});
      t.classList.add('active');
      document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('active')});
      $('panel-'+t.dataset.tab).classList.add('active');
      if(t.dataset.tab==='day')renderDay();
      if(t.dataset.tab==='week')renderWeek();
      if(t.dataset.tab==='result')renderResult();
    };
  });

  // === INTRO ===
  $('intro-content').innerHTML=MC.intro;

  // === FOUNDATION ===
  var data=loadD();
  var fhtml='<div class="sec-title">Часть первая. Фундамент</div><div class="divider"></div>';
  fhtml+='<div class="card"><div class="card-title">Этап 1. «Что для меня деньги?»</div><div class="card-dim">300 пунктов. Без цензуры. Без пауз. Первые 100 — поверхность. 101-200 — сопротивление. 201-300 — правда.</div>';
  fhtml+='<div class="progress-wrap"><div class="progress-fill" id="p300-bar" style="width:0%"></div></div><div class="progress-label" id="p300-label">0 / 300</div>';
  fhtml+='<div class="form-group"><textarea class="form-textarea" id="f-300" rows="12" placeholder="1. &#10;2. &#10;3. &#10;...пишите по одному пункту на строку" style="min-height:200px">'+(data.list300||'')+'</textarea></div>';
  fhtml+='<div class="card-text" style="margin:16px 0"><p>Перечитайте все 300 пунктов. Не спеша. Отметьте те, от которых что-то шевельнулось — мурашки, сжатие в груди, злость, стыд, слёзы, желание вычеркнуть. Особенно — желание вычеркнуть.</p><p><strong>Выберите 4.</strong> Это ваши ключевые убеждения о деньгах. Они будут с вами весь месяц — как маяки. Каждый раз, когда вы будете записывать трату, вы будете сверяться: какое из этих четырёх убеждений сейчас управляет мной? Это не упражнение «для галочки». Это диагностика. Четыре слова, в которых закодирован ваш денежный сценарий.</p><p style="font-size:.78rem;color:var(--tx3)">Если вы проходили мои программы или индивидуальные сессии — откройте аналитический отчёт. Посмотрите, совпадают ли эти 4 убеждения с тем, что мы находили вместе. Часто совпадают. Иногда — удивляют.</p></div>';
  fhtml+='<div class="form-group"><label class="form-label">Мои 4 ключевых убеждения</label><textarea class="form-textarea" id="f-300-keys" rows="4" placeholder="Запишите 4 убеждения, которые повторялись чаще всего">'+(data.keys300||'')+'</textarea></div></div>';

  fhtml+='<div class="card" style="margin-top:16px"><div class="card-title">Этап 2. «Чем жертвуют те, у кого получилось?»</div><div class="card-dim">70 пунктов. Какую цену я готов(-а) заплатить?</div>';
  fhtml+='<div class="progress-wrap"><div class="progress-fill" id="p70-bar" style="width:0%"></div></div><div class="progress-label" id="p70-label">0 / 70</div>';
  fhtml+='<div class="form-group"><textarea class="form-textarea" id="f-70" rows="8" placeholder="1. &#10;2. &#10;...по одному пункту на строку" style="min-height:150px">'+(data.list70||'')+'</textarea></div>';
  fhtml+='<div class="card-text" style="margin:16px 0"><p>Перечитайте. Выберите <strong>4 пункта</strong>, которые вызвали самый сильный отклик — те, где вы почувствовали: «Вот это я точно не готов(-а)» или наоборот — «Да, именно это».</p><p>Запишите их рядом с 4 убеждениями из этапа 1. Теперь у вас <strong>8 ключевых слов</strong>. 4 — про то, что для вас деньги. 4 — про цену, которую вы готовы или не готовы платить. Это ваш компас на следующие 30 дней. Вы будете возвращаться к ним снова и снова — в тестах, в ежедневных записях, в обзорах. Они будут проявляться в ваших тратах, в ваших отказах, в ваших импульсах. Не потому что вы их ищете — а потому что они всегда были. Просто теперь вы их видите.</p></div>';
  fhtml+='<div class="form-group"><label class="form-label">Мои 4 ключевых пункта цены</label><textarea class="form-textarea" id="f-70-keys" rows="4" placeholder="4 пункта, которые вызвали самый сильный отклик">'+(data.keys70||'')+'</textarea></div></div>';
  fhtml+='<div class="btn-row"><button class="btn btn-primary" id="btn-save-found">Сохранить фундамент</button></div>';
  $('foundation-content').innerHTML=fhtml;

  function updateProgress(){
    var v300=($('f-300').value.match(/\n/g)||[]).length+($('f-300').value.trim()?1:0);
    var v70=($('f-70').value.match(/\n/g)||[]).length+($('f-70').value.trim()?1:0);
    $('p300-bar').style.width=Math.min(100,v300/300*100)+'%';$('p300-label').textContent=Math.min(300,v300)+' / 300';
    $('p70-bar').style.width=Math.min(100,v70/70*100)+'%';$('p70-label').textContent=Math.min(70,v70)+' / 70';
  }
  $('f-300').oninput=updateProgress;$('f-70').oninput=updateProgress;updateProgress();
  $('btn-save-found').onclick=function(){
    data.list300=$('f-300').value;data.keys300=$('f-300-keys').value;
    data.list70=$('f-70').value;data.keys70=$('f-70-keys').value;
    saveD(data);alert('Фундамент сохранён!');
  };

  // === TESTS ===
  var thtml='<div class="sec-title">Часть вторая. Исследование</div><div class="divider"></div>';

  // Test 1: metaphors
  thtml+='<div class="card"><div class="card-title">Тест 1. «Портрет моих денег»</div><div class="card-dim">Выберите 3 образа, которые описывают ваши отношения с деньгами сейчас.</div>';
  thtml+='<div class="meta-chips" id="meta-now">';
  MC.metaphors.forEach(function(m){thtml+='<button class="meta-chip" data-m="'+m+'">'+m+'</button>'});
  thtml+='</div><div class="card-dim">Теперь 3 образа — отношения, которые вы хотите.</div>';
  thtml+='<div class="meta-chips" id="meta-want">';
  MC.metaphors.forEach(function(m){thtml+='<button class="meta-chip" data-m="'+m+'">'+m+'</button>'});
  thtml+='</div><div class="form-group"><label class="form-label">Что должно измениться внутри, чтобы первый набор стал вторым?</label><textarea class="form-textarea" id="t1-diff" rows="3">'+(data.t1diff||'')+'</textarea></div></div>';

  // Test 2: situations
  thtml+='<div class="card" style="margin-top:16px"><div class="card-title">Тест 2. «Кто тратит — я или ребёнок?»</div><div class="card-dim">10 ситуаций. Выберите честно — не как правильно, а как будет.</div><div id="sit-list">';
  MC.situations.forEach(function(s,i){
    thtml+='<div class="sit-card"><div class="sit-q">'+(i+1)+'. '+esc(s.q)+'</div>';
    thtml+='<button class="sit-opt" data-si="'+i+'" data-v="a">🔵 '+esc(s.a)+'</button>';
    thtml+='<button class="sit-opt" data-si="'+i+'" data-v="b">🟡 '+esc(s.b)+'</button>';
    thtml+='<button class="sit-opt" data-si="'+i+'" data-v="c">🔴 '+esc(s.c)+'</button></div>';
  });
  thtml+='</div><div class="stat-grid" id="sit-stats" style="margin-top:12px"></div>';
  thtml+='<div class="form-group"><label class="form-label">В ситуациях, где решает ребёнок, работает убеждение:</label><textarea class="form-textarea" id="t2-belief" rows="2">'+(data.t2belief||'')+'</textarea></div></div>';

  // Test 3: states
  thtml+='<div class="card" style="margin-top:16px"><div class="card-title">Тест 3. «5 состояний, которые ты покупаешь»</div><div class="card-dim">Прочитай все пять. Вернись к той, которая отозвалась.</div>';
  MC.states.forEach(function(s,i){
    thtml+='<div class="state-card"><div class="state-header" data-si="'+i+'"><span class="state-icon">'+s.icon+'</span><span class="state-name">'+s.name+'</span><span class="state-arrow">▸</span></div>';
    thtml+='<div class="state-body" id="sb-'+i+'"><div class="card-dim" style="margin-bottom:10px">'+esc(s.sub)+'</div><div class="card-text" style="margin-bottom:12px">'+esc(s.desc)+'</div>';
    s.qs.forEach(function(q,qi){
      thtml+='<div class="form-group"><label class="form-label">'+esc(q)+'</label><textarea class="form-textarea" id="s'+i+'q'+qi+'" rows="2">'+(data['s'+i+'q'+qi]||'')+'</textarea></div>';
    });
    thtml+='</div></div>';
  });
  thtml+='<div class="form-group" style="margin-top:12px"><label class="form-label">Мой главный мотив покупок:</label><textarea class="form-textarea" id="t3-main" rows="2">'+(data.t3main||'')+'</textarea></div></div>';

  // Test 4: family voice
  thtml+='<div class="card" style="margin-top:16px"><div class="card-title">Тест 4. «Денежный голос семьи»</div><div class="card-dim">5 фраз про деньги, которые звучали в доме до 15 лет.</div>';
  for(var fi=1;fi<=5;fi++){
    thtml+='<div class="form-group"><label class="form-label">Фраза '+fi+' (от кого, в какой ситуации)</label><input class="form-input" id="fam-'+fi+'" value="'+(data['fam'+fi]||'')+'"></div>';
    thtml+='<div class="form-group"><label class="form-label">Перевод с языка денег на язык чувств</label><input class="form-input" id="fam-tr-'+fi+'" value="'+(data['famtr'+fi]||'')+'"></div>';
  }
  thtml+='<div class="form-group"><label class="form-label">Свободная запись (10 минут)</label><textarea class="form-textarea" id="t4-free" rows="6">'+(data.t4free||'')+'</textarea></div></div>';
  thtml+='<div class="btn-row"><button class="btn btn-primary" id="btn-save-tests">Сохранить тесты</button></div>';
  $('tests-content').innerHTML=thtml;

  // Metaphor chips
  ['meta-now','meta-want'].forEach(function(gid){
    var sel=data[gid]||[];
    $(gid).querySelectorAll('.meta-chip').forEach(function(c){
      if(sel.indexOf(c.dataset.m)>=0)c.classList.add('selected');
      c.onclick=function(){
        if(c.classList.contains('selected')){c.classList.remove('selected');sel=sel.filter(function(x){return x!==c.dataset.m})}
        else if(sel.length<3){c.classList.add('selected');sel.push(c.dataset.m)}
        data[gid]=sel;
      };
    });
  });

  // Situation clicks
  var sitAnswers=data.sitAnswers||{};
  document.querySelectorAll('.sit-opt').forEach(function(b){
    var si=b.dataset.si,v=b.dataset.v;
    if(sitAnswers[si]===v)b.classList.add(v==='a'?'sel-blue':v==='b'?'sel-yellow':'sel-red');
    b.onclick=function(){
      document.querySelectorAll('.sit-opt[data-si="'+si+'"]').forEach(function(x){x.className='sit-opt'});
      b.classList.add(v==='a'?'sel-blue':v==='b'?'sel-yellow':'sel-red');
      sitAnswers[si]=v;data.sitAnswers=sitAnswers;updateSitStats();
    };
  });
  function updateSitStats(){
    var a=0,b=0,c=0;
    Object.values(sitAnswers).forEach(function(v){if(v==='a')a++;if(v==='b')b++;if(v==='c')c++});
    $('sit-stats').innerHTML='<div class="stat-card"><div class="stat-num" style="color:var(--blue)">'+a+'</div><div class="stat-label">🔵 Взрослый</div></div><div class="stat-card"><div class="stat-num" style="color:var(--yellow)">'+b+'</div><div class="stat-label">🟡 Адаптивный</div></div>';
  }
  updateSitStats();

  // State card toggles
  document.querySelectorAll('.state-header').forEach(function(h){
    h.onclick=function(){
      var body=$('sb-'+h.dataset.si);
      body.classList.toggle('open');
      h.querySelector('.state-arrow').textContent=body.classList.contains('open')?'▾':'▸';
    };
  });

  $('btn-save-tests').onclick=function(){
    data.t1diff=$('t1-diff').value;data.t2belief=$('t2-belief').value;data.t3main=$('t3-main').value;data.t4free=$('t4-free').value;
    for(var fi=1;fi<=5;fi++){data['fam'+fi]=$('fam-'+fi).value;data['famtr'+fi]=$('fam-tr-'+fi).value}
    MC.states.forEach(function(s,i){s.qs.forEach(function(q,qi){data['s'+i+'q'+qi]=$('s'+i+'q'+qi).value})});
    data.sitAnswers=sitAnswers;saveD(data);alert('Тесты сохранены!');
  };

  // === SCENARIO ===
  var shtml='<div class="sec-title">Часть третья. Денежный сценарий</div><div class="divider"></div>';
  shtml+='<div class="card"><div class="card-title">Маски</div><div class="card-dim">Какое описание ближе — по своим записям?</div>';
  MC.masks.forEach(function(m,i){
    shtml+='<div class="state-card"><div class="state-header" data-mi="'+i+'"><span class="state-name">'+esc(m.name)+'</span><span class="state-arrow">▸</span></div>';
    shtml+='<div class="state-body" id="mb-'+i+'"><div class="card-text">'+esc(m.desc)+'</div></div></div>';
  });
  shtml+='<div class="form-group"><label class="form-label">Моя маска — _____. Она защищает от _____.</label><textarea class="form-textarea" id="sc-mask" rows="2">'+(data.scmask||'')+'</textarea></div></div>';

  shtml+='<div class="card" style="margin-top:16px"><div class="card-title">Стили трат</div><div class="card-dim">4 стиля, связанных с базовым страхом. Узнай свои привычки.</div>';
  MC.spendStyles.forEach(function(s,i){
    shtml+='<div class="state-card"><div class="state-header" data-ssi="'+i+'"><span>'+s.icon+'</span><span class="state-name" style="margin-left:8px">'+esc(s.name)+'</span><span class="state-arrow">▸</span></div>';
    shtml+='<div class="state-body" id="ssb-'+i+'"><div class="card-dim" style="margin-bottom:8px">'+esc(s.sub)+'</div>';
    shtml+='<div style="margin-bottom:10px">';s.traits.forEach(function(t){shtml+='<div style="font-size:.8rem;color:var(--tx2);padding:3px 0;padding-left:10px;border-left:1px solid var(--bd)">'+esc(t)+'</div>'});shtml+='</div>';
    shtml+='<div class="card-dim">Фраза: '+esc(s.phrase)+'</div>';
    shtml+='<div class="card-dim" style="margin-top:8px;color:var(--gold)">'+esc(s.question)+'</div></div></div>';
  });
  shtml+='<div class="form-group"><label class="form-label">Мой стиль трат. Базовый страх. Пустота про _____.</label><textarea class="form-textarea" id="sc-style" rows="3">'+(data.scstyle||'')+'</textarea></div></div>';
  shtml+='<div class="btn-row"><button class="btn btn-primary" id="btn-save-sc">Сохранить сценарий</button></div>';
  $('scenario-content').innerHTML=shtml;

  document.querySelectorAll('[data-mi]').forEach(function(h){h.onclick=function(){var b=$('mb-'+h.dataset.mi);b.classList.toggle('open');h.querySelector('.state-arrow').textContent=b.classList.contains('open')?'▾':'▸'}});
  document.querySelectorAll('[data-ssi]').forEach(function(h){h.onclick=function(){var b=$('ssb-'+h.dataset.ssi);b.classList.toggle('open');h.querySelector('.state-arrow').textContent=b.classList.contains('open')?'▾':'▸'}});
  $('btn-save-sc').onclick=function(){data.scmask=$('sc-mask').value;data.scstyle=$('sc-style').value;saveD(data);alert('Сценарий сохранён!')};

  // === DAY ===
  function renderDay(){
    var h='<div class="sec-title">Ежедневный дневник</div><div class="divider"></div>';
    h+='<div class="form-group"><input type="date" class="form-input" id="day-date" value="'+new Date().toISOString().split('T')[0]+'"></div>';
    h+='<div class="card"><div class="card-title">Добавить трату</div>';
    h+='<div class="form-group"><label class="form-label">Что купил(-а)?</label><input class="form-input" id="ex-what"></div>';
    h+='<div class="form-group"><label class="form-label">Сколько ₽</label><input class="form-input" id="ex-amount" type="number"></div>';
    h+='<div class="form-group"><label class="form-label">Решение взрослого или импульс ребёнка?</label><div style="display:flex;gap:8px"><button class="btn btn-sm btn-secondary" id="ex-adult" style="flex:1">🔵 Взрослый</button><button class="btn btn-sm btn-secondary" id="ex-child" style="flex:1">🔴 Ребёнок</button></div></div>';
    h+='<div class="form-group"><label class="form-label">Какое состояние я покупал(-а)?</label><select class="form-input" id="ex-state" style="padding:10px"><option>Безопасность</option><option>Утешение</option><option>Одобрение</option><option>Контроль</option><option>Награда</option><option>Осознанная покупка</option></select></div>';
    h+='<div class="form-group"><label class="form-label">Эта покупка будет служить завтра?</label><textarea class="form-textarea" id="ex-serve" rows="2"></textarea></div>';
    h+='<div class="btn-row"><button class="btn btn-primary" id="btn-add-ex">Добавить</button></div></div>';
    h+='<div id="ex-list" style="margin-top:16px"></div>';
    h+='<div class="card" style="margin-top:16px"><div class="card-title">Вечерний итог</div>';
    h+='<div class="form-group"><label class="form-label">Какое убеждение (этап 1) сработало сегодня?</label><textarea class="form-textarea" id="ev-belief" rows="2"></textarea></div>';
    h+='<div class="form-group"><label class="form-label">Что мне было нужно на самом деле?</label><textarea class="form-textarea" id="ev-need" rows="2"></textarea></div>';
    h+='<div class="form-group"><label class="form-label">Была ли минута, когда я выдержал(-а) пустоту?</label><textarea class="form-textarea" id="ev-void" rows="2"></textarea></div>';
    h+='<div class="btn-row"><button class="btn btn-primary" id="btn-save-ev">Сохранить вечер</button></div></div>';

    // Bank
    h+='<div class="card" style="margin-top:16px"><div class="card-title">Банк состояний</div><div class="card-dim">Чем заменить импульсивную трату:</div>';
    Object.keys(MC.bankStates).forEach(function(k){h+='<div style="margin-top:10px"><strong style="color:var(--gold);font-size:.78rem">'+k+':</strong><div style="font-size:.8rem;color:var(--tx2);line-height:1.6">'+MC.bankStates[k]+'</div></div>'});
    h+='</div>';
    $('day-content').innerHTML=h;

    var exType='adult';
    $('ex-adult').onclick=function(){exType='adult';$('ex-adult').style.borderColor='var(--gold)';$('ex-child').style.borderColor='var(--bd)'};
    $('ex-child').onclick=function(){exType='child';$('ex-child').style.borderColor='var(--gold)';$('ex-adult').style.borderColor='var(--bd)'};

    $('btn-add-ex').onclick=function(){
      if(!db)return;
      var ex={id:Date.now(),date:$('day-date').value,what:$('ex-what').value.trim(),amount:parseInt($('ex-amount').value)||0,type:exType,state:$('ex-state').value,serve:$('ex-serve').value.trim()};
      if(!ex.what){alert('Что купили?');return}
      dbPut(db,'expenses',ex,function(){$('ex-what').value='';$('ex-amount').value='';$('ex-serve').value='';loadExpenses()});
    };
    $('btn-save-ev').onclick=function(){
      if(!db)return;
      var date=$('day-date').value;
      dbPutKey(db,'weekly','ev_'+date,{belief:$('ev-belief').value,need:$('ev-need').value,void_:$('ev-void').value},function(){alert('Вечер сохранён!')});
    };
    $('day-date').onchange=loadExpenses;
    loadExpenses();
  }

  function loadExpenses(){
    if(!db){$('ex-list').innerHTML='';return}
    dbGetAll(db,'expenses',function(all){
      var date=$('day-date').value;
      var dayEx=all.filter(function(e){return e.date===date});
      if(!dayEx.length){$('ex-list').innerHTML='<div class="empty-text">Нет трат за этот день.</div>';return}
      var h='',total=0,adult=0,child=0;
      dayEx.forEach(function(e){
        total+=e.amount;if(e.type==='adult')adult+=e.amount;else child+=e.amount;
        h+='<div class="expense-item"><div style="display:flex;justify-content:space-between"><div class="expense-what">'+esc(e.what)+'</div><div class="expense-amount">'+e.amount+' ₽</div></div>';
        h+='<span class="expense-tag '+(e.type==='adult'?'adult':'child')+'">'+(e.type==='adult'?'🔵 Взрослый':'🔴 Ребёнок')+'</span> <span class="expense-tag" style="background:rgba(201,169,110,.1);color:var(--gold)">'+esc(e.state)+'</span></div>';
      });
      h='<div class="stat-grid"><div class="stat-card"><div class="stat-num">'+total+'</div><div class="stat-label">₽ за день</div></div><div class="stat-card"><div class="stat-num">'+Math.round(adult/(total||1)*100)+'%</div><div class="stat-label">🔵 Взрослый</div></div></div>'+h;
      $('ex-list').innerHTML=h;
    });
  }

  // === WEEK ===
  function renderWeek(){
    var h='<div class="sec-title">Обзор каждые 5 дней</div><div class="divider"></div>';
    h+='<div class="sec-sub" style="color:var(--tx3)">Перечитайте записи за последние 5 дней и ответьте на вопросы.</div>';
    h+='<div class="form-group"><label class="form-label">Паттерны недели — что я вижу?</label><textarea class="form-textarea" id="wk-pattern" rows="3"></textarea></div>';
    h+='<div class="form-group"><label class="form-label">Самая импульсивная покупка — какое состояние я покупал(-а)?</label><textarea class="form-textarea" id="wk-impulse" rows="2"></textarea></div>';
    h+='<div class="form-group"><label class="form-label">Самая осознанная покупка — что я выбрал(-а)?</label><textarea class="form-textarea" id="wk-conscious" rows="2"></textarea></div>';
    h+='<div class="form-group"><label class="form-label">Какое убеждение работало на этой неделе?</label><textarea class="form-textarea" id="wk-belief" rows="2"></textarea></div>';
    h+='<div class="form-group"><label class="form-label">Чем я могу заменить импульсивную трату?</label><textarea class="form-textarea" id="wk-replace" rows="2"></textarea></div>';
    h+='<div class="btn-row"><button class="btn btn-primary" id="btn-save-wk">Сохранить обзор</button></div>';
    $('week-content').innerHTML=h;
    $('btn-save-wk').onclick=function(){
      if(!db)return;
      var wk={pattern:$('wk-pattern').value,impulse:$('wk-impulse').value,conscious:$('wk-conscious').value,belief:$('wk-belief').value,replace:$('wk-replace').value,date:new Date().toISOString()};
      dbPutKey(db,'weekly','week_'+Date.now(),wk,function(){alert('Обзор сохранён!')});
    };
  }

  // === RESULT ===
  function renderResult(){
    var h='<div class="sec-title">Итог за 30 дней</div><div class="divider"></div>';
    h+='<div class="form-group"><label class="form-label">Какой процент трат — про вещи, а какой — про эмоции?</label><textarea class="form-textarea" id="res-pct" rows="2"></textarea></div>';
    h+='<div class="form-group"><label class="form-label">Какое состояние покупал(-а) чаще всего?</label><textarea class="form-textarea" id="res-state" rows="2"></textarea></div>';
    h+='<div class="form-group"><label class="form-label">Какое убеждение — самое сильное и незаметное?</label><textarea class="form-textarea" id="res-belief" rows="2"></textarea></div>';
    h+='<div class="form-group"><label class="form-label">Что изменилось за 30 дней?</label><textarea class="form-textarea" id="res-change" rows="3"></textarea></div>';
    h+='<div class="form-group"><label class="form-label">Научился(-ась) ли ты выдерживать пустоту?</label><textarea class="form-textarea" id="res-void" rows="2"></textarea></div>';
    h+='<div class="form-group"><label class="form-label">Как я хочу обращаться со своими жизненными силами?</label><textarea class="form-textarea" id="res-final" rows="4" placeholder="Это твоя инструкция к себе."></textarea></div>';
    h+='<div class="btn-row"><button class="btn btn-primary" id="btn-save-res">Сохранить итог</button></div>';
    $('result-content').innerHTML=h;
    $('btn-save-res').onclick=function(){
      data.resPct=$('res-pct').value;data.resState=$('res-state').value;data.resBelief=$('res-belief').value;
      data.resChange=$('res-change').value;data.resVoid=$('res-void').value;data.resFinal=$('res-final').value;
      saveD(data);alert('Итог сохранён!');
    };
  }

  // Profile
  $('p-name').value=data.pname||'';$('p-birth').value=data.pbirth||'';
  $('p-save').onclick=function(){data.pname=$('p-name').value;data.pbirth=$('p-birth').value;saveD(data);alert('Профиль сохранён!')};
}
})();
