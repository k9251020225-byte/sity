(function(){
  function $(id){return document.getElementById(id)}
  function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}

  // ===== PIN =====
  var isNew=true;
  var pinInput=$('pin-input'),pinError=$('pin-error'),pinToggle=$('pin-toggle'),pinDesc=$('pin-desc');
  pinToggle.onclick=function(){
    isNew=!isNew;
    pinDesc.innerHTML=isNew?'Придумайте код для вашего дневника.<br>Запомните его — по этому коду вы будете входить.':'Введите ваш код для входа в дневник.';
    pinToggle.textContent=isNew?'У меня уже есть код':'Создать новый дневник';
    pinError.textContent='';
  };
  $('pin-go').onclick=tryPin;
  pinInput.onkeydown=function(e){if(e.key==='Enter')tryPin()};

  function tryPin(){
    var code=pinInput.value.trim();
    if(code.length<3){pinError.textContent='Минимум 3 символа';return}
    var sk='goals_pin_'+code;
    if(isNew){
      if(localStorage.getItem(sk+'_goals')){pinError.textContent='Такой код уже занят.';return}
      localStorage.setItem(sk+'_goals','[]');
    }else{
      if(!localStorage.getItem(sk+'_goals')){pinError.textContent='Дневник не найден.';return}
    }
    $('pin-screen').style.display='none';
    $('app').style.display='block';
    initApp(sk);
  }

  // ===== IndexedDB helper =====
  function openDB(name,cb){
    var req=indexedDB.open(name,1);
    req.onupgradeneeded=function(e){
      var db=e.target.result;
      if(!db.objectStoreNames.contains('daily'))db.createObjectStore('daily');
      if(!db.objectStoreNames.contains('weekly'))db.createObjectStore('weekly');
    };
    req.onsuccess=function(e){cb(e.target.result)};
    req.onerror=function(){cb(null)};
  }

  function dbPut(db,store,key,val,cb){
    var tx=db.transaction(store,'readwrite');
    tx.objectStore(store).put(val,key);
    tx.oncomplete=function(){if(cb)cb()};
  }

  function dbGet(db,store,key,cb){
    var tx=db.transaction(store,'readonly');
    var req=tx.objectStore(store).get(key);
    req.onsuccess=function(){cb(req.result||null)};
  }

  function dbGetAll(db,store,cb){
    var tx=db.transaction(store,'readonly');
    var req=tx.objectStore(store).getAll();
    var reqK=tx.objectStore(store).getAllKeys();
    var results=[];
    reqK.onsuccess=function(){
      req.onsuccess=function(){
        var keys=reqK.result,vals=req.result;
        for(var i=0;i<keys.length;i++)results.push({key:keys[i],val:vals[i]});
        cb(results);
      };
    };
  }

  function dbClear(db,store,cb){
    var tx=db.transaction(store,'readwrite');
    tx.objectStore(store).clear();
    tx.oncomplete=function(){if(cb)cb()};
  }

  // ===== MAIN APP =====
  function initApp(sk){
    var GKEY=sk+'_goals';
    var PKEY=sk+'_profile';
    var db=null;

    openDB(sk+'_db',function(d){
      db=d;
      renderDay();
    });

    function loadG(){try{return JSON.parse(localStorage.getItem(GKEY))||[]}catch(e){return[]}}
    function saveG(d){localStorage.setItem(GKEY,JSON.stringify(d))}

    // Letter
    var letterWrap=$('letter-wrap'),letterEl=$('letter');
    var letterBtn=document.createElement('button');
    letterBtn.className='btn btn-secondary btn-sm';
    letterBtn.textContent='Письмо';
    letterBtn.style.cssText='display:none;margin:16px auto 0;width:max-content';
    letterWrap.parentNode.insertBefore(letterBtn,letterWrap.nextSibling);
    $('letter-close').onclick=function(){letterWrap.style.display='none';letterBtn.style.display='block'};
    letterBtn.onclick=function(){letterWrap.style.display='block';letterBtn.style.display='none';letterEl.classList.remove('smoke-in');void letterEl.offsetWidth;letterEl.classList.add('smoke-in')};

    // Tabs
    document.querySelectorAll('.tab').forEach(function(t){
      t.onclick=function(){
        document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('active')});
        t.classList.add('active');
        document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('active')});
        $('panel-'+t.dataset.tab).classList.add('active');
        if(t.dataset.tab==='day')renderDay();
        if(t.dataset.tab==='week')renderWeek();
        if(t.dataset.tab==='goals')renderGoals();
      };
    });

    // ===== DAY =====
    var dayDateEl=$('day-date');
    dayDateEl.value=new Date().toISOString().split('T')[0];
    dayDateEl.onchange=function(){renderDay()};

    function renderDay(){
      var goals=loadG(),el=$('day-goals'),date=dayDateEl.value;
      if(!goals.length){
        el.innerHTML='<div class="empty"><div class="empty-text">Сначала добавьте цели во вкладке "+ Цель".</div></div>';
        return;
      }
      if(!db){el.innerHTML='<div class="empty-text">Загрузка...</div>';return}

      // Load all daily entries for this date
      var loaded=0,entries={};
      goals.forEach(function(g){
        var key=date+'_'+g.id;
        dbGet(db,'daily',key,function(val){
          entries[g.id]=val||{};
          loaded++;
          if(loaded===goals.length)buildDayForm(goals,entries,date);
        });
      });
    }

    function buildDayForm(goals,entries,date){
      var el=$('day-goals'),h='';
      goals.forEach(function(g){
        var e=entries[g.id]||{};
        h+='<div class="day-goal" data-gid="'+g.id+'">';
        h+='<div class="day-goal-name">'+esc(g.name)+' <span style="font-size:.65rem;color:var(--tm)">'+esc(g.cat)+'</span></div>';

        h+='<div class="day-section">';
        h+='<div class="day-section-label">Утро — мой план</div>';
        h+='<textarea class="form-textarea dg-morning" data-gid="'+g.id+'" placeholder="Мои конкретные шаги к этой цели сегодня">'+esc(e.morning||'')+'</textarea>';
        h+='</div>';

        h+='<div class="day-section">';
        h+='<div class="day-section-label">Вечер — мой итог</div>';
        h+='<textarea class="form-textarea dg-success" data-gid="'+g.id+'" placeholder="Что удалось? Какое действие привело к результату?">'+esc(e.success||'')+'</textarea>';
        h+='<textarea class="form-textarea dg-fail" data-gid="'+g.id+'" placeholder="Что не получилось? Какое действие или бездействие к этому привело?" style="margin-top:8px">'+esc(e.fail||'')+'</textarea>';
        h+='<textarea class="form-textarea dg-feel" data-gid="'+g.id+'" placeholder="Что я сейчас чувствую?" style="margin-top:8px">'+esc(e.feel||'')+'</textarea>';
        h+='<div style="margin-top:8px"><div class="form-label">Удовлетворённость (1-10)</div>';
        h+='<div class="slider-wrap"><input type="range" min="1" max="10" value="'+(e.sat||5)+'" class="dg-sat" data-gid="'+g.id+'"><span class="slider-val">'+(e.sat||5)+'</span></div>';
        h+='</div>';
        h+='</div>';

        h+='</div>';
      });
      el.innerHTML=h;

      // Slider events
      el.querySelectorAll('.dg-sat').forEach(function(s){
        s.oninput=function(){s.nextElementSibling.textContent=s.value};
      });
    }

    $('btn-save-day').onclick=function(){
      if(!db)return;
      var date=dayDateEl.value,goals=loadG();
      var saved=0;
      goals.forEach(function(g){
        var key=date+'_'+g.id;
        var morning=(document.querySelector('.dg-morning[data-gid="'+g.id+'"]')||{}).value||'';
        var success=(document.querySelector('.dg-success[data-gid="'+g.id+'"]')||{}).value||'';
        var fail=(document.querySelector('.dg-fail[data-gid="'+g.id+'"]')||{}).value||'';
        var feel=(document.querySelector('.dg-feel[data-gid="'+g.id+'"]')||{}).value||'';
        var sat=parseInt((document.querySelector('.dg-sat[data-gid="'+g.id+'"]')||{}).value)||5;
        var entry={morning:morning.trim(),success:success.trim(),fail:fail.trim(),feel:feel.trim(),sat:sat,date:date,goalId:g.id,goalName:g.name};
        dbPut(db,'daily',key,entry,function(){
          saved++;
          if(saved===goals.length)alert('День сохранён!');
        });
      });
    };

    // ===== WEEK =====
    function getWeekKey(d){
      var date=new Date(d),jan1=new Date(date.getFullYear(),0,1);
      var days=Math.floor((date-jan1)/86400000);
      var wn=Math.ceil((days+jan1.getDay()+1)/7);
      return date.getFullYear()+'-W'+String(wn).padStart(2,'0');
    }
    function wkLabel(wk){var p=wk.split('-W');return 'Неделя '+parseInt(p[1])+', '+p[0]}
    function offsetWk(wk,off){var p=wk.split('-W'),y=parseInt(p[0]),w=parseInt(p[1]);w+=off;if(w<1){y--;w=52}if(w>52){y++;w=1}return y+'-W'+String(w).padStart(2,'0')}
    function getWeekDates(wk){
      var p=wk.split('-W'),y=parseInt(p[0]),w=parseInt(p[1]);
      var jan1=new Date(y,0,1);
      var dayOfWeek=jan1.getDay()||7;
      var start=new Date(jan1);
      start.setDate(jan1.getDate()+(w-1)*7-dayOfWeek+1);
      var dates=[];
      for(var i=0;i<7;i++){
        var d=new Date(start);d.setDate(start.getDate()+i);
        dates.push(d.toISOString().split('T')[0]);
      }
      return dates;
    }

    var curWk=getWeekKey(new Date());
    $('wk-prev').onclick=function(){curWk=offsetWk(curWk,-1);renderWeek()};
    $('wk-next').onclick=function(){curWk=offsetWk(curWk,1);renderWeek()};

    function renderWeek(){
      $('wk-label').textContent=wkLabel(curWk);
      if(!db){$('wk-entries').innerHTML='Загрузка...';return}

      // Load weekly review
      dbGet(db,'weekly',curWk,function(review){
        $('wk-blocked').value=(review&&review.blocked)||'';
        $('wk-helped').value=(review&&review.helped)||'';
        $('wk-feelings').value=(review&&review.feelings)||'';
        $('wk-letter').value=(review&&review.letter)||'';
      });

      // Load all daily entries for this week
      var dates=getWeekDates(curWk);
      var goals=loadG();
      dbGetAll(db,'daily',function(all){
        var byDate={};
        all.forEach(function(item){
          var d=item.val.date;
          if(dates.indexOf(d)>=0){
            if(!byDate[d])byDate[d]=[];
            byDate[d].push(item.val);
          }
        });
        buildWeekReview(dates,byDate,goals);
      });
    }

    function buildWeekReview(dates,byDate,goals){
      var el=$('wk-entries'),h='';
      var dayNames=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
      var hasAny=false;

      dates.forEach(function(date){
        var entries=byDate[date];
        if(!entries||!entries.length)return;
        var nonEmpty=entries.filter(function(e){return e.morning||e.success||e.fail||e.feel});
        if(!nonEmpty.length)return;
        hasAny=true;

        var d=new Date(date);
        var dayName=dayNames[d.getDay()];
        h+='<div class="review-day">';
        h+='<div class="review-day-title">'+dayName+', '+d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})+'</div>';

        nonEmpty.forEach(function(e){
          h+='<div class="review-entry">';
          h+='<div class="review-goal-name">'+esc(e.goalName||'Цель')+'</div>';
          if(e.morning)h+='<div class="review-field"><strong>План:</strong> '+esc(e.morning)+'</div>';
          if(e.success)h+='<div class="review-field"><strong>Удалось:</strong> '+esc(e.success)+'</div>';
          if(e.fail)h+='<div class="review-field"><strong>Не получилось:</strong> '+esc(e.fail)+'</div>';
          if(e.feel)h+='<div class="review-field"><strong>Чувства:</strong> '+esc(e.feel)+'</div>';
          h+='<div class="review-field"><strong>Удовлетворённость:</strong> '+e.sat+'/10</div>';
          h+='</div>';
        });
        h+='</div>';
      });

      if(!hasAny)h='<div class="review-empty">На этой неделе пока нет записей. Заполняйте вкладку "День" каждый день.</div>';
      el.innerHTML=h;
    }

    $('btn-save-week').onclick=function(){
      if(!db)return;
      var review={
        blocked:$('wk-blocked').value.trim(),
        helped:$('wk-helped').value.trim(),
        feelings:$('wk-feelings').value.trim(),
        letter:$('wk-letter').value.trim(),
        week:curWk
      };
      dbPut(db,'weekly',curWk,review,function(){alert('Обзор недели сохранён!')});
    };

    // ===== GOALS =====
    $('btn-add-goal').onclick=function(){
      var name=$('g-name').value.trim();
      if(!name){alert('Введите название цели');return}
      var goal={id:Date.now(),name:name,desc:$('g-desc').value.trim(),cat:$('g-cat').value,steps:$('g-steps').value.trim().split('\n').filter(function(s){return s.trim()}),created:new Date().toISOString()};
      var g=loadG();g.push(goal);saveG(g);
      $('g-name').value='';$('g-desc').value='';$('g-steps').value='';
      alert('Цель добавлена!');
      document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('active')});
      document.querySelector('[data-tab="goals"]').classList.add('active');
      document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('active')});
      $('panel-goals').classList.add('active');
      renderGoals();
    };

    function renderGoals(){
      var goals=loadG(),el=$('goals-list');
      if(!goals.length){
        el.innerHTML='<div class="empty"><div class="empty-text">Пока нет целей.</div><button class="btn btn-primary" style="margin-top:16px" onclick="document.querySelectorAll(\'.tab\').forEach(function(x){x.classList.remove(\'active\')});document.querySelector(\'[data-tab=add]\').classList.add(\'active\');document.querySelectorAll(\'.panel\').forEach(function(p){p.classList.remove(\'active\')});document.getElementById(\'panel-add\').classList.add(\'active\')">Добавить первую цель</button></div>';
        return;
      }
      var h='';
      goals.forEach(function(g){
        h+='<div class="goal-card">';
        h+='<div class="goal-head"><div class="goal-name">'+esc(g.name)+'</div><div class="goal-cat">'+esc(g.cat)+'</div></div>';
        if(g.desc)h+='<div class="goal-desc">'+esc(g.desc)+'</div>';
        if(g.steps&&g.steps.length){h+='<div style="margin-top:8px">';g.steps.forEach(function(s){h+='<div style="font-size:.78rem;color:var(--tm);padding:2px 0">'+esc(s)+'</div>'});h+='</div>'}
        h+='<div class="goal-actions"><button class="btn btn-danger btn-sm" onclick="window._delGoal('+g.id+')">Удалить</button></div>';
        h+='</div>';
      });
      el.innerHTML=h;
    }

    window._delGoal=function(id){
      if(!confirm('Удалить цель?'))return;
      saveG(loadG().filter(function(g){return g.id!==id}));renderGoals();
    };

    // Export
    $('btn-export').onclick=function(){
      if(!db)return;
      dbGetAll(db,'daily',function(daily){
        dbGetAll(db,'weekly',function(weekly){
          var data=JSON.stringify({goals:loadG(),daily:daily,weekly:weekly},null,2);
          if(navigator.clipboard){navigator.clipboard.writeText(data).then(function(){$('modal').classList.add('show')})}
          else{prompt('Скопируйте:',data)}
        });
      });
    };
    $('btn-nuke').onclick=function(){
      if(!confirm('Удалить ВСЕ данные? Необратимо!'))return;
      if(!confirm('Точно?'))return;
      saveG([]);
      if(db){dbClear(db,'daily',function(){dbClear(db,'weekly',function(){renderGoals()})})}
    };

    renderGoals();

    // ===== PROFILE =====
    function loadProfile(){try{return JSON.parse(localStorage.getItem(PKEY))||{name:'',birth:'',rules:[],values:[]}}catch(e){return{name:'',birth:'',rules:[],values:[]}}}
    function saveProfile(p){localStorage.setItem(PKEY,JSON.stringify(p))}
    var prof=loadProfile();
    $('p-name').value=prof.name||'';
    $('p-birth').value=prof.birth||'';

    function renderPList(items,cid,type){
      var el=$(cid),h='';
      items.forEach(function(item,i){h+='<div class="list-item"><span>'+esc(item)+'</span><button onclick="window._rmPI(\''+type+'\','+i+')">&times;</button></div>'});
      el.innerHTML=h;
    }
    function renderPLists(){renderPList(prof.rules,'p-rules-list','rules');renderPList(prof.values,'p-values-list','values');renderPP()}
    function renderPP(){
      var el=$('p-preview');
      if(!prof.name&&!prof.birth&&!prof.rules.length&&!prof.values.length){el.innerHTML='';return}
      var h='<div class="profile-card">';
      if(prof.name)h+='<div class="profile-name">'+esc(prof.name)+'</div>';
      if(prof.birth){var bd=new Date(prof.birth);h+='<div class="profile-birth">'+bd.toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})+'</div>'}
      if(prof.rules.length){h+='<div class="profile-section">Мои жизненные правила</div>';prof.rules.forEach(function(r){h+='<div class="profile-item">'+esc(r)+'</div>'})}
      if(prof.values.length){h+='<div class="profile-section">Мои ценности</div>';prof.values.forEach(function(v){h+='<div class="profile-item">'+esc(v)+'</div>'})}
      h+='</div>';el.innerHTML=h;
    }
    renderPLists();
    function addPI(iid,type){var inp=$(iid),val=inp.value.trim();if(!val)return;prof[type].push(val);inp.value='';renderPLists()}
    $('p-rule-add').onclick=function(){addPI('p-rule-input','rules')};
    $('p-value-add').onclick=function(){addPI('p-value-input','values')};
    $('p-rule-input').onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();addPI('p-rule-input','rules')}};
    $('p-value-input').onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();addPI('p-value-input','values')}};
    window._rmPI=function(type,i){prof[type].splice(i,1);renderPLists()};
    $('p-save').onclick=function(){prof.name=$('p-name').value.trim();prof.birth=$('p-birth').value;saveProfile(prof);renderPP();alert('Профиль сохранён!')};
  }
})();
