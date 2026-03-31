(function(){
var $=function(id){return document.getElementById(id)};
var esc=function(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML};

window.initDay=function(){renderDay()};

window.renderDay=function(){
  var db=window.OPORA_DB;var data=window.loadD();
  var goals=data.goals||[];
  var today=new Date().toISOString().split('T')[0];

  // Onboarding — no goals yet
  if(!goals.length){
    $('day-content').innerHTML='<div class="card smoke-in"><div class="card-text"><p><strong>Добро пожаловать.</strong></p><p>Прежде чем начать записывать дни — нужно поставить хотя бы одну цель. Это займёт 10-15 минут, но определит весь ваш путь.</p><p>Начните с вкладки <strong>Начало</strong> — там упражнение, которое поможет увидеть, чего вы на самом деле хотите. Потом — <strong>+ Цель</strong>.</p></div></div><div class="btn-row"><button class="btn btn-primary" onclick="document.querySelectorAll(\'.tab\').forEach(function(x){x.classList.remove(\'active\')});document.querySelector(\'[data-tab=start]\').classList.add(\'active\');document.querySelectorAll(\'.panel\').forEach(function(p){p.classList.remove(\'active\')});document.getElementById(\'panel-start\').classList.add(\'active\');if(window.renderStart)renderStart()">Перейти в Начало</button></div>';
    return;
  }

  var startDate=data.startDate||today;
  if(!data.startDate){data.startDate=today;saveD(data)}
  var dayNum=Math.floor((new Date(today)-new Date(startDate))/86400000)+1;
  if(dayNum<1)dayNum=1;
  var weekNum=Math.ceil(dayNum/7);if(weekNum>4)weekNum=((weekNum-1)%4)+1;
  var theme=GC.weekThemes[weekNum-1]||GC.weekThemes[0];
  var qIdx=(dayNum-1)%GC.dailyQuestions.length;
  var question=GC.dailyQuestions[qIdx];

  var h='';
  h+='<div class="week-badge">День '+dayNum+' · Неделя '+weekNum+' — '+theme.name+'</div>';
  h+='<div class="sec-sub" style="margin-bottom:16px">'+theme.desc+'</div>';

  // Missed checkpoints
  var allCpDays=[7,14,15,21,30];
  allCpDays.forEach(function(cpDay){
    if(cpDay<dayNum){
      var cp=GC.checkpoints[cpDay];
      if(cp){
        h+='<details class="checkpoint" style="margin-bottom:10px"><summary style="font-size:.82rem;color:var(--cr);cursor:pointer">'+cp.title+' (пройден)</summary><div style="font-size:.82rem;color:var(--td);line-height:1.7;margin-top:8px;white-space:pre-line">'+esc(cp.text)+'</div></details>';
      }
    }
  });

  // Current checkpoint
  var cp=GC.checkpoints[dayNum];
  if(cp){
    h+='<div class="checkpoint"><div class="checkpoint-title">'+cp.title+'</div><div style="font-size:.84rem;color:var(--td);line-height:1.75;white-space:pre-line">'+esc(cp.text)+'</div>';
    if(dayNum===14)h+='<div style="margin-top:12px"><a href="https://t.me/sudas_psy" target="_blank" class="btn btn-secondary btn-sm">Хочу разобрать это с Екатериной</a></div>';
    if(dayNum===30)h+='<div class="form-group" style="margin-top:14px"><label class="form-label">Моё письмо себе</label><textarea class="form-textarea" id="d-letter30" rows="8"></textarea></div>';
    h+='</div>';
  }

  // Crisis (days 8-20)
  if(dayNum>=8&&dayNum<=20){
    h+='<details class="crisis-card"><summary style="font-size:.85rem;color:var(--cr);cursor:pointer;font-family:Playfair Display,serif">Я хочу бросить</summary>';
    h+='<div style="font-size:.84rem;color:var(--td);line-height:1.75;margin-top:12px;white-space:pre-line">'+esc(GC.crisis.text)+'</div>';
    h+='<div class="form-group" style="margin-top:12px"><label class="form-label">Одно предложение. Любое.</label><textarea class="form-textarea" id="d-crisis" rows="2"></textarea></div></details>';
  }

  // Two letters (week 3)
  if(weekNum===3&&dayNum%7<=2){
    h+='<details class="card"><summary class="card-title" style="cursor:pointer">Два письма ▸</summary><div style="padding-top:12px">';
    h+='<div class="form-group"><label class="form-label">Письмо от взрослой части — ребёнку</label><textarea class="form-textarea" id="d-letter-adult" rows="4"></textarea></div>';
    h+='<div class="form-group"><label class="form-label">Письмо от ребёнка — взрослому</label><textarea class="form-textarea" id="d-letter-child" rows="4"></textarea></div>';
    h+='</div></details>';
  }

  // Empty page (day 28-29)
  if(dayNum===28||dayNum===29){
    h+='<div class="card" style="text-align:center;padding:40px 20px"><div style="font-family:Playfair Display,serif;font-size:1.1rem;color:var(--cr);margin-bottom:12px">Сегодня — пустая страница.</div><div style="font-size:.88rem;color:var(--tm);line-height:1.8">Ничего не надо. Просто побудьте. Это и есть опора.</div></div>';
  }

  h+='<div class="sec-title">День '+dayNum+'</div><div class="divider"></div>';
  h+='<div class="form-group"><input type="date" class="form-input" id="d-date" value="'+today+'"></div>';

  // MORNING — collapsible
  h+='<details class="card" open><summary class="card-title" style="cursor:pointer">Утро ▾</summary><div style="padding-top:12px">';
  h+='<div class="card-dim" style="margin-bottom:10px">1-2 минуты. Назови состояние — и ты уже не на автопилоте.</div>';
  h+='<div class="form-group"><label class="form-label">Как я себя чувствую прямо сейчас? (одно слово)</label><input class="form-input" id="d-feel"></div>';
  h+='<div class="form-group"><label class="form-label">Что я сегодня могу сделать только для себя?</label><input class="form-input" id="d-forme"></div>';
  h+='<div class="form-group"><label class="form-label">Один шаг к моей цели — честно, по силам</label><input class="form-input" id="d-step"></div>';
  h+='<div class="form-group"><label class="form-label">Что я решаю НЕ делать сегодня?</label><input class="form-input" id="d-notdo"></div>';
  h+='</div></details>';

  // EVENING — collapsible
  h+='<details class="card"><summary class="card-title" style="cursor:pointer">Вечер ▸</summary><div style="padding-top:12px">';
  h+='<div class="card-dim" style="margin-bottom:10px">Одним предложением. Правда помещается в одно предложение.</div>';
  h+='<div class="form-group"><label class="form-label">Что сегодня было трудно — и я всё равно прожил(-а) этот день?</label><textarea class="form-textarea" id="d-hard" rows="2"></textarea></div>';
  h+='<div class="form-group"><label class="form-label">Где я сегодня выбрал(-а) себя?</label><textarea class="form-textarea" id="d-chose" rows="2"></textarea></div>';
  h+='<div class="form-group"><label class="form-label">За что я могу себя поблагодарить — за попытку, не за результат?</label><textarea class="form-textarea" id="d-thanks" rows="2"></textarea></div>';
  h+='<div style="padding:12px;background:rgba(107,29,58,.04);border-radius:12px;border-left:2px solid var(--cr);margin-bottom:14px"><div class="form-label" style="color:var(--cr)">Вопрос дня</div><div style="font-size:.84rem;color:var(--td);margin-bottom:8px">'+esc(question)+'</div><textarea class="form-textarea" id="d-qday" rows="2"></textarea></div>';
  h+='</div></details>';

  // BODY — collapsible
  h+='<details class="card"><summary class="card-title" style="cursor:pointer">Тело ▸</summary><div style="padding-top:12px">';
  h+='<div class="form-group"><label class="form-label">Как моё тело чувствует себя прямо сейчас?</label><input class="form-input" id="d-body"></div>';
  h+='<div class="form-group"><label class="form-label">Было ли сегодня удовольствие — физическое, сенсорное, вкусовое?</label><input class="form-input" id="d-pleasure"></div>';
  h+='</div></details>';

  h+='<div class="btn-row"><button class="btn btn-primary" id="btn-save-day">Сохранить день</button></div>';

  // ARCHIVE — last entries
  h+='<div style="margin-top:30px"><div class="sec-title" style="font-size:1rem">Мои записи</div><div class="divider"></div><div id="d-archive">Загрузка...</div></div>';

  $('day-content').innerHTML=h;

  // Toggle arrows on details
  document.querySelectorAll('#day-content details').forEach(function(det){
    det.addEventListener('toggle',function(){
      var sum=det.querySelector('summary');
      if(sum){var t=sum.textContent;sum.textContent=det.open?t.replace('▸','▾'):t.replace('▾','▸')}
    });
  });

  // Load saved data for this date
  if(db){
    var loadDate=function(){
      var date=$('d-date').value;
      dbGet(db,'daily',date,function(val){
        if(!val)return;
        var fields={feel:'d-feel',forme:'d-forme',step:'d-step',notdo:'d-notdo',hard:'d-hard',chose:'d-chose',thanks:'d-thanks',qday:'d-qday',body:'d-body',pleasure:'d-pleasure'};
        Object.keys(fields).forEach(function(k){if($(fields[k]))$(fields[k]).value=val[k]||''});
      });
    };
    loadDate();
    $('d-date').onchange=loadDate;

    // Load archive
    dbGetAll(db,'daily',function(all){
      all.sort(function(a,b){return a.key>b.key?-1:1});
      var archEl=$('d-archive');if(!archEl)return;
      if(!all.length){archEl.innerHTML='<div class="empty-text">Пока нет записей.</div>';return}
      var ah='';
      var dayNames=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
      all.forEach(function(item){
        var v=item.val;var d=new Date(item.key);
        var dayName=dayNames[d.getDay()];
        ah+='<details class="card" style="padding:12px;margin-bottom:6px"><summary style="font-size:.72rem;color:var(--cr);cursor:pointer;letter-spacing:.1em">';
        ah+=dayName+', '+d.toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'});
        if(v.feel)ah+=' · '+esc(v.feel);
        ah+='</summary><div style="padding-top:10px">';
        if(v.forme)ah+='<div style="font-size:.8rem;color:var(--td);margin-bottom:4px"><strong>Для себя:</strong> '+esc(v.forme)+'</div>';
        if(v.step)ah+='<div style="font-size:.8rem;color:var(--td);margin-bottom:4px"><strong>Шаг:</strong> '+esc(v.step)+'</div>';
        if(v.notdo)ah+='<div style="font-size:.8rem;color:var(--tm);margin-bottom:4px"><strong>Не делать:</strong> '+esc(v.notdo)+'</div>';
        if(v.hard)ah+='<div style="font-size:.8rem;color:var(--tm);margin-bottom:4px"><strong>Трудно:</strong> '+esc(v.hard)+'</div>';
        if(v.chose)ah+='<div style="font-size:.8rem;color:var(--cr);margin-bottom:4px"><strong>Выбрал(-а) себя:</strong> '+esc(v.chose)+'</div>';
        if(v.thanks)ah+='<div style="font-size:.8rem;color:var(--tm);margin-bottom:4px"><strong>Благодарность:</strong> '+esc(v.thanks)+'</div>';
        if(v.qday)ah+='<div style="font-size:.78rem;color:var(--tl);font-style:italic;margin-bottom:4px">'+esc(v.question||'')+' — '+esc(v.qday)+'</div>';
        if(v.body)ah+='<div style="font-size:.78rem;color:var(--tm);margin-bottom:4px"><strong>Тело:</strong> '+esc(v.body)+'</div>';
        if(v.pleasure)ah+='<div style="font-size:.78rem;color:var(--tm)"><strong>Удовольствие:</strong> '+esc(v.pleasure)+'</div>';
        ah+='</div></details>';
      });
      archEl.innerHTML=ah;
    });
  }

  // Save
  $('btn-save-day').onclick=function(){
    if(!db)return;
    var date=$('d-date').value;
    var entry={date:date,dayNum:dayNum,feel:($('d-feel')||{}).value||'',forme:($('d-forme')||{}).value||'',step:($('d-step')||{}).value||'',notdo:($('d-notdo')||{}).value||'',hard:($('d-hard')||{}).value||'',chose:($('d-chose')||{}).value||'',thanks:($('d-thanks')||{}).value||'',qday:($('d-qday')||{}).value||'',question:question,body:($('d-body')||{}).value||'',pleasure:($('d-pleasure')||{}).value||''};
    if($('d-crisis'))entry.crisis=$('d-crisis').value||'';
    if($('d-letter-adult'))entry.letterAdult=$('d-letter-adult').value||'';
    if($('d-letter-child'))entry.letterChild=$('d-letter-child').value||'';
    if($('d-letter30'))entry.letter30=$('d-letter30').value||'';
    dbPut(db,'daily',date,entry,function(){
      alert('День сохранён!');
      renderDay(); // refresh archive
    });
  };
};

// Review
window.renderReview=function(){
  var db=window.OPORA_DB;
  var h='<div class="sec-title">Еженедельный обзор</div><div class="divider"></div>';
  h+='<div class="sec-sub">Перечитайте записи за неделю (они внизу вкладки «День»), затем ответьте.</div>';
  h+='<div class="form-group"><label class="form-label">Что мне мешало эти дни?</label><textarea class="form-textarea" id="rv-blocked" rows="3"></textarea></div>';
  h+='<div class="form-group"><label class="form-label">Что мне помогало?</label><textarea class="form-textarea" id="rv-helped" rows="3"></textarea></div>';
  h+='<div class="form-group"><label class="form-label">От чего я прятался(-ась)?</label><textarea class="form-textarea" id="rv-hiding" rows="2"></textarea></div>';
  h+='<div class="form-group"><label class="form-label">Что я чувствую, когда перечитываю свои записи?</label><textarea class="form-textarea" id="rv-feelings" rows="2"></textarea></div>';
  h+='<div class="form-group"><label class="form-label">Письмо от взрослой части — напутствие себе</label><textarea class="form-textarea" id="rv-letter" rows="4" placeholder="Что ты хочешь сказать себе на следующую неделю?"></textarea></div>';
  h+='<div class="form-group" style="padding:10px;background:rgba(107,29,58,.04);border-radius:12px"><label class="form-label" style="color:var(--cr)">Прикасался ли кто-то ко мне? Как это было?</label><textarea class="form-textarea" id="rv-touch" rows="2"></textarea></div>';
  h+='<div class="btn-row"><button class="btn btn-primary" id="btn-save-rv">Сохранить обзор</button></div>';

  // Stats
  h+='<div style="margin-top:24px"><div class="sec-title" style="font-size:1rem">Статистика</div><div class="divider"></div><div class="stat-grid" id="rv-stats"></div></div>';

  // Past reviews archive
  h+='<div style="margin-top:20px"><div class="sec-title" style="font-size:1rem">Прошлые обзоры</div><div class="divider"></div><div id="rv-archive">Загрузка...</div></div>';

  $('review-content').innerHTML=h;

  $('btn-save-rv').onclick=function(){
    if(!db)return;
    var rv={blocked:$('rv-blocked').value,helped:$('rv-helped').value,hiding:$('rv-hiding').value,feelings:$('rv-feelings').value,letter:$('rv-letter').value,touch:$('rv-touch').value,date:new Date().toISOString()};
    dbPut(db,'reviews','rv_'+Date.now(),rv,function(){alert('Обзор сохранён!');renderReview()});
  };

  if(db){
    // Stats
    dbGetAll(db,'daily',function(all){
      var total=all.length;var choseCount=0;var thanksCount=0;var feels={};var bodyCount=0;
      all.forEach(function(item){
        var v=item.val;
        if(v.chose&&v.chose.trim())choseCount++;
        if(v.thanks&&v.thanks.trim())thanksCount++;
        if(v.body&&v.body.trim())bodyCount++;
        if(v.feel){var f=v.feel.trim().toLowerCase();feels[f]=(feels[f]||0)+1}
      });
      var feelArr=Object.keys(feels).map(function(k){return{w:k,n:feels[k]}}).sort(function(a,b){return b.n-a.n});
      var topFeels=feelArr.slice(0,3).map(function(f){return esc(f.w)+' ('+f.n+')'}).join(', ')||'—';
      $('rv-stats').innerHTML=
        '<div class="stat-card"><div class="stat-num">'+total+'</div><div class="stat-label">Дней записано</div></div>'+
        '<div class="stat-card"><div class="stat-num">'+choseCount+'</div><div class="stat-label">Раз выбрал(-а) себя</div></div>'+
        '<div class="stat-card"><div class="stat-num">'+thanksCount+'</div><div class="stat-label">Благодарностей себе</div></div>'+
        '<div class="stat-card"><div class="stat-num">'+bodyCount+'</div><div class="stat-label">Дней с телом</div></div>'+
        '<div style="grid-column:1/-1;text-align:center;padding:10px;background:rgba(255,255,255,.5);border:1.5px solid var(--bd);border-radius:14px"><div style="font-size:.68rem;color:var(--tm);text-transform:uppercase;letter-spacing:.15em;margin-bottom:4px">Частые состояния</div><div style="font-size:.88rem;color:var(--td)">'+topFeels+'</div></div>';
    });

    // Past reviews
    dbGetAll(db,'reviews',function(all){
      all.sort(function(a,b){return a.key>b.key?-1:1});
      var el=$('rv-archive');if(!el)return;
      if(!all.length){el.innerHTML='<div class="empty-text">Пока нет обзоров.</div>';return}
      var rh='';
      all.forEach(function(item){
        var v=item.val;var d=new Date(v.date);
        rh+='<details class="card" style="padding:12px;margin-bottom:6px"><summary style="font-size:.72rem;color:var(--cr);cursor:pointer">Обзор от '+d.toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})+'</summary><div style="padding-top:10px">';
        if(v.blocked)rh+='<div style="font-size:.8rem;color:var(--td);margin-bottom:4px"><strong>Мешало:</strong> '+esc(v.blocked)+'</div>';
        if(v.helped)rh+='<div style="font-size:.8rem;color:var(--td);margin-bottom:4px"><strong>Помогало:</strong> '+esc(v.helped)+'</div>';
        if(v.hiding)rh+='<div style="font-size:.8rem;color:var(--tm);margin-bottom:4px"><strong>Прятался(-ась):</strong> '+esc(v.hiding)+'</div>';
        if(v.feelings)rh+='<div style="font-size:.8rem;color:var(--tm);margin-bottom:4px"><strong>Чувства:</strong> '+esc(v.feelings)+'</div>';
        if(v.letter)rh+='<div style="font-size:.8rem;color:var(--cr);margin-bottom:4px"><strong>Напутствие:</strong> '+esc(v.letter)+'</div>';
        rh+='</div></details>';
      });
      el.innerHTML=rh;
    });
  }
};
})();
