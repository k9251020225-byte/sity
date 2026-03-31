(function(){
var $=function(id){return document.getElementById(id)};
var esc=function(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML};

// === START (Питерсон + ревизия) ===
window.initStart=function(){renderStart()};
window.renderStart=function(){
  var data=loadD();
  var h='<div class="sec-title">С чего начать</div><div class="divider"></div>';
  h+='<div class="card smoke-in"><div class="card-text"><p><strong>Этот дневник — не список целей.</strong></p><p>Это место, где вы встретитесь с собой. С тем, что стоит за вашими решениями, за вашей усталостью, за ощущением «я потерял(-а) себя».</p><p>Перед тем как ставить цели — нужно понять, откуда вы стартуете. Не из головы — а из честного контакта с собой. Для этого мы используем методику <strong>Future Authoring</strong> Джордана Питерсона — клинического психолога, профессора Университета Торонто. Его исследования показали: люди, прошедшие это упражнение, подняли результаты на 25% и перестали бросать начатое.</p><p>Выделите 30 минут тишины. Не торопитесь. Это фундамент, на котором будет стоять всё остальное.</p></div></div>';
  h+='<div style="margin-top:20px"></div>';

  h+='<div class="card"><div class="card-title">Этап 1. Идеальное будущее</div>';
  h+='<div class="card-dim" style="margin-bottom:10px">Представьте: прошёл год. Всё сложилось наилучшим образом. Не редактируйте — просто пишите.</div>';
  h+='<div class="form-group" style="padding:10px;background:rgba(107,29,58,.04);border-radius:10px;margin-bottom:10px"><div style="font-size:.82rem;color:var(--cr);margin-bottom:6px"><strong>Важный вопрос перед началом:</strong> Ваше идеальное будущее — это про вас? Или про то, чтобы кто-то другой всё исправил?</div></div>';
  h+='<div class="form-group"><label class="form-label">Моя идеальная жизнь через год</label><textarea class="form-textarea" id="st-ideal" rows="8">'+(data.stIdeal||'')+'</textarea></div></div>';

  h+='<div class="card"><div class="card-title">Этап 2. Будущее, которого хочу избежать</div>';
  h+='<div class="card-dim" style="margin-bottom:10px">Прошёл год. Вы ничего не изменили. Что вы видите? Что чувствуете?</div>';
  h+='<div class="form-group"><textarea class="form-textarea" id="st-avoid" rows="6">'+(data.stAvoid||'')+'</textarea></div></div>';

  h+='<div class="card"><div class="card-title">Мост из прошлой жизни</div>';
  h+='<div class="card-dim" style="margin-bottom:10px">Что из вашей прошлой жизни — не ошибка, а фундамент? Что вы умеете благодаря тому, кем вы были?</div>';
  h+='<div class="form-group"><textarea class="form-textarea" id="st-bridge" rows="3">'+(data.stBridge||'')+'</textarea></div></div>';

  h+='<div class="card"><div class="card-title">Разминка</div>';
  var warmup=[{id:'w1',q:'Что я мог(-ла) бы делать лучше?'},{id:'w2',q:'Чему бы хотел(-а) научиться?'},{id:'w3',q:'Какие привычки хочу изменить?'},{id:'w4',q:'Какой должна быть моя жизнь через 3-5 лет?'},{id:'w5',q:'Какими хочу видеть свои отношения?'},{id:'w6',q:'Как хочу проводить свободное время?'}];
  warmup.forEach(function(w){h+='<div class="form-group"><label class="form-label">'+w.q+'</label><textarea class="form-textarea" id="st-'+w.id+'" rows="2">'+(data['st'+w.id]||'')+'</textarea></div>'});
  h+='</div>';
  h+='<div class="btn-row"><button class="btn btn-primary" id="btn-save-start">Сохранить</button></div>';
  h+='<div style="margin-top:20px;text-align:center;padding:16px;background:rgba(107,29,58,.03);border-radius:14px"><div style="font-size:.88rem;color:var(--td);line-height:1.7;margin-bottom:12px">Вы увидели два будущих. Между ними — ваши действия. Перейдите во вкладку <strong style="color:var(--cr)">+ Цель</strong> и поставьте свою первую цель.</div><button class="btn btn-primary" onclick="document.querySelectorAll(\'.tab\').forEach(function(x){x.classList.remove(\'active\')});document.querySelector(\'[data-tab=add]\').classList.add(\'active\');document.querySelectorAll(\'.panel\').forEach(function(p){p.classList.remove(\'active\')});document.getElementById(\'panel-add\').classList.add(\'active\');if(window.renderAdd)renderAdd()">Этап 3 — поставить цель</button></div>';

  $('start-content').innerHTML=h;
  $('btn-save-start').onclick=function(){
    data.stIdeal=$('st-ideal').value;data.stAvoid=$('st-avoid').value;data.stBridge=$('st-bridge').value;
    ['w1','w2','w3','w4','w5','w6'].forEach(function(w){data['st'+w]=$('st-'+w).value});
    saveD(data);alert('Сохранено!');
  };
};

// === ADD GOAL ===
window.initAdd=function(){renderAdd()};
window.renderAdd=function(){
  var data=loadD();
  // Load or init wheel
  data.wheel=data.wheel||JSON.parse(JSON.stringify(GC.defaultWheel));

  var h='<div class="sec-title">Этап 3. Постановка цели</div><div class="divider"></div>';

  // Wheel of balance
  h+='<div class="card" style="margin-bottom:18px"><div class="card-title">Колесо баланса</div>';
  h+='<div class="card-dim" style="margin-bottom:12px">Оцените каждую сферу жизни от 1 до 10. Посмотрите на колесо — где провал? Оттуда и начните. Вы можете переименовать сферы под себя — это ваша жизнь, не чужие категории.</div>';
  h+='<div class="wheel-wrap"><svg class="wheel-svg" viewBox="0 0 300 300" id="wheel-svg"></svg></div>';

  // Wheel inputs
  h+='<div id="wheel-inputs">';
  data.wheel.forEach(function(w,i){
    h+='<div class="wheel-input"><input type="text" value="'+esc(w.name)+'" data-wi="'+i+'" class="wi-name"><input type="range" min="1" max="10" value="'+w.score+'" data-wi="'+i+'" class="wi-score"><span class="wval">'+w.score+'</span><button onclick="window._delWheelSector('+i+')">&times;</button></div>';
  });
  h+='</div>';
  h+='<div style="display:flex;gap:8px;margin-top:8px"><input class="form-input" id="wheel-new-name" placeholder="Добавить свою сферу" style="flex:1"><button class="btn btn-primary btn-sm" id="btn-add-sector">+</button></div>';
  h+='<div class="btn-row"><button class="btn btn-secondary btn-sm" id="btn-save-wheel">Сохранить колесо</button></div>';
  h+='</div>';

  h+='<div class="sec-sub" style="margin-top:20px">Теперь выберите сферу и поставьте цель.</div>';
  h+='<div class="form-group"><label class="form-label">Сфера жизни</label><select class="form-select" id="g-cat">';
  data.wheel.forEach(function(w){h+='<option>'+esc(w.name)+'</option>'});
  h+='</select></div>';
  h+='<div class="form-group"><label class="form-label">Цель на год</label><input class="form-input" id="g-name"></div>';

  // 8 questions
  var qs=[
    {id:'truth',label:'1. Проверка на истинность',ph:'Эта цель — моё желание или ожидание кого-то другого?',hint:'Ребёнок ищет одобрения. Взрослый выбирает для себя.'},
    {id:'state',label:'2. Состояние',ph:'Как я хочу себя чувствовать, когда достигну этого?',hint:'Не что получить — а как себя ощущать.'},
    {id:'motive',label:'3. Честный мотив',ph:'Зачем мне это на самом деле? Что стоит за этим желанием?',hint:'Часто за «хочу похудеть» стоит «хочу чтобы меня любили».'},
    {id:'cost',label:'4. Цена бездействия',ph:'Что будет через год, если я ничего не сделаю?',hint:'Не придумывайте — почувствуйте. Это ваше топливо.'},
    {id:'fear',label:'5. Что мешает',ph:'Что останавливало раньше? Какой страх за бездействием?',hint:'А если это не лень — тогда что? Горе? Гнев? Стыд? Иногда мы называем ленью оплакивание прежней жизни.'},
    {id:'child',label:'6. Внутренний ребёнок',ph:'Чего хочет ребёнок — одобрения, жалости, доказать маме/папе?',hint:'Ребёнок не всегда маленький и испуганный. Иногда он в ярости: это несправедливо, мне обещали другую жизнь. Какой ваш ребёнок прямо сейчас?'},
    {id:'adult',label:'7. Взрослое решение',ph:'Я готов(-а) идти к этому, даже если никто не заметит и не похвалит?',hint:'Если да — цель ваша. Если нет — вы ищете зрителя.'},
    {id:'impact',label:'8. Влияние',ph:'Что изменится в моей жизни и жизни людей рядом?',hint:''}
  ];
  h+='<details class="card" style="margin:16px 0"><summary class="card-title" style="cursor:pointer">8 вопросов к цели ▸</summary><div style="padding-top:12px">';
  qs.forEach(function(q){
    h+='<div class="form-group"><label class="form-label">'+q.label+'</label><textarea class="form-textarea" id="gq-'+q.id+'" rows="2" placeholder="'+q.ph+'"></textarea>';
    if(q.hint)h+='<div class="card-dim">'+q.hint+'</div>';
    h+='</div>';
  });
  h+='</div></details>';

  // Decomposition
  h+='<div class="card"><div class="card-title">Путь к цели</div>';
  h+='<div class="card-dim" style="margin-bottom:12px">Год далеко. Разбейте на понятные отрезки.</div>';
  h+='<div class="form-group"><label class="form-label">Что я хочу получить за 3 месяца?</label><input class="form-input" id="g-quarter"></div>';
  h+='<div class="form-group"><label class="form-label">На чём сосредоточусь в этом месяце?</label><input class="form-input" id="g-focus"></div>';
  h+='<div class="form-group"><label class="form-label">Что конкретно сделаю на этой неделе?</label><input class="form-input" id="g-week"></div>';
  h+='</div>';

  h+='<div class="btn-row" style="padding-bottom:100px"><button class="btn btn-primary" id="btn-add-goal">Добавить цель</button></div>';
  $('add-content').innerHTML=h;

  // Draw wheel
  function drawWheel(){
    var svg=$('wheel-svg');if(!svg)return;
    var wheel=data.wheel||[];var n=wheel.length;if(!n){svg.innerHTML='';return}
    var cx=150,cy=150,maxR=120,minR=20;
    var svgH='';
    wheel.forEach(function(w,i){
      var angle=2*Math.PI/n;
      var startA=i*angle-Math.PI/2;
      var endA=(i+1)*angle-Math.PI/2;
      var r=minR+(maxR-minR)*(w.score/10);
      var x1=cx+r*Math.cos(startA),y1=cy+r*Math.sin(startA);
      var x2=cx+r*Math.cos(endA),y2=cy+r*Math.sin(endA);
      var largeArc=angle>Math.PI?1:0;
      var color=GC.wheelColors[i%GC.wheelColors.length];
      // Filled sector
      svgH+='<path d="M'+cx+','+cy+' L'+x1+','+y1+' A'+r+','+r+' 0 '+largeArc+',1 '+x2+','+y2+' Z" fill="'+color+'" opacity="0.3"/>';
      // Border
      var bx1=cx+maxR*Math.cos(startA),by1=cy+maxR*Math.sin(startA);
      svgH+='<line x1="'+cx+'" y1="'+cy+'" x2="'+bx1+'" y2="'+by1+'" stroke="'+color+'" stroke-width="0.5" opacity="0.3"/>';
      // Label
      var midA=(startA+endA)/2;
      var lx=cx+(maxR+16)*Math.cos(midA),ly=cy+(maxR+16)*Math.sin(midA);
      svgH+='<text x="'+lx+'" y="'+ly+'" class="wheel-label">'+esc(w.name)+'</text>';
      // Score
      var sx=cx+(r/2+10)*Math.cos(midA),sy=cy+(r/2+10)*Math.sin(midA);
      svgH+='<text x="'+sx+'" y="'+(sy+5)+'" class="wheel-score">'+w.score+'</text>';
    });
    // Outer circle
    svgH+='<circle cx="'+cx+'" cy="'+cy+'" r="'+maxR+'" fill="none" stroke="var(--bd)" stroke-width="1"/>';
    svg.innerHTML=svgH;
  }
  drawWheel();

  // Wheel input handlers
  document.querySelectorAll('.wi-score').forEach(function(s){
    s.oninput=function(){
      var i=parseInt(s.dataset.wi);
      data.wheel[i].score=parseInt(s.value);
      s.nextElementSibling.textContent=s.value;
      drawWheel();
    };
  });
  document.querySelectorAll('.wi-name').forEach(function(inp){
    inp.onchange=function(){
      var i=parseInt(inp.dataset.wi);
      data.wheel[i].name=inp.value.trim()||'Сфера '+(i+1);
    };
  });

  $('btn-save-wheel').onclick=function(){
    // Also update names from inputs
    document.querySelectorAll('.wi-name').forEach(function(inp){
      var i=parseInt(inp.dataset.wi);
      data.wheel[i].name=inp.value.trim()||'Сфера '+(i+1);
    });
    saveD(data);drawWheel();alert('Колесо сохранено!');
  };

  $('btn-add-sector').onclick=function(){
    var name=$('wheel-new-name').value.trim();if(!name)return;
    data.wheel.push({name:name,score:5});
    saveD(data);renderAdd();
  };

  window._delWheelSector=function(i){
    data.wheel.splice(i,1);saveD(data);renderAdd();
  };

  $('btn-add-goal').onclick=function(){
    var name=$('g-name').value.trim();if(!name){alert('Введите цель');return}
    var questions={};
    ['truth','state','motive','cost','fear','child','adult','impact'].forEach(function(q){questions[q]=($('gq-'+q)||{}).value||''});
    var goal={id:Date.now(),name:name,cat:$('g-cat').value,questions:questions,quarter:$('g-quarter').value.trim(),focus:$('g-focus').value.trim(),week:$('g-week').value.trim(),created:new Date().toISOString(),progress:[]};
    data.goals=data.goals||[];data.goals.push(goal);saveD(data);
    alert('Цель добавлена!');
    document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('active')});document.querySelector('[data-tab="goals"]').classList.add('active');
    document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('active')});$('panel-goals').classList.add('active');renderGoals();
  };
};

// === GOALS LIST ===
window.initGoals=function(){renderGoals()};
window.renderGoals=function(){
  var data=loadD();var goals=data.goals||[];
  var h='<div class="sec-title">Мои цели</div><div class="divider"></div>';
  if(!goals.length){
    h+='<div class="empty"><div class="empty-text">Пока нет целей. Начните с вкладки <strong>Начало</strong>, затем — <strong>+ Цель</strong>.</div></div>';
  }else{
    goals.forEach(function(g,gi){
      h+='<div class="goal-card"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px"><div class="goal-name">'+esc(g.name)+'</div><span class="goal-cat">'+esc(g.cat)+'</span></div>';
      if(g.questions&&g.questions.state)h+='<div style="font-size:.8rem;color:var(--cr);font-style:italic;margin-bottom:6px">Хочу чувствовать: '+esc(g.questions.state)+'</div>';
      if(g.quarter)h+='<div style="font-size:.82rem;color:var(--td);margin:6px 0;padding:8px 12px;background:rgba(107,29,58,.03);border-radius:10px;border-left:2px solid var(--tm)"><strong style="font-size:.65rem;color:var(--tm);text-transform:uppercase;letter-spacing:.15em;display:block;margin-bottom:2px">Квартал</strong>'+esc(g.quarter)+'</div>';
      if(g.focus)h+='<div style="font-size:.82rem;color:var(--td);margin:6px 0;padding:8px 12px;background:rgba(107,29,58,.05);border-radius:10px;border-left:2px solid var(--cr)"><strong style="font-size:.65rem;color:var(--tm);text-transform:uppercase;letter-spacing:.15em;display:block;margin-bottom:2px">Месяц</strong>'+esc(g.focus)+'</div>';
      if(g.week)h+='<div style="font-size:.82rem;color:var(--td);margin:6px 0;padding:8px 12px;background:rgba(107,29,58,.07);border-radius:10px;border-left:2px solid var(--cr-l)"><strong style="font-size:.65rem;color:var(--tm);text-transform:uppercase;letter-spacing:.15em;display:block;margin-bottom:2px">Неделя</strong>'+esc(g.week)+'</div>';
      // Progress dots
      h+='<div style="display:flex;flex-wrap:wrap;gap:3px;margin:8px 0">';
      for(var d=0;d<30;d++){var done=g.progress&&g.progress[d];h+='<div style="width:16px;height:16px;border-radius:3px;'+(done?'background:var(--cr)':'border:1px solid var(--bd)')+';cursor:pointer" onclick="window._togProg('+gi+','+d+')"></div>'}
      h+='</div>';
      if(g.questions){
        h+='<details style="margin:8px 0"><summary style="font-size:.75rem;color:var(--cr);cursor:pointer">Мои ответы на 8 вопросов</summary><div style="padding:10px 0">';
        var labels={truth:'Истинность',state:'Состояние',motive:'Мотив',cost:'Цена бездействия',fear:'Что мешает',child:'Внутренний ребёнок',adult:'Взрослое решение',impact:'Влияние'};
        Object.keys(labels).forEach(function(k){if(g.questions[k])h+='<div style="font-size:.78rem;color:var(--tm);margin-bottom:6px;padding-left:10px;border-left:2px solid var(--bd)"><strong style="font-size:.62rem;color:var(--tl);text-transform:uppercase;display:block;margin-bottom:2px">'+labels[k]+'</strong>'+esc(g.questions[k])+'</div>'});
        h+='</div></details>';
      }
      h+='<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">';
      h+='<button class="btn btn-secondary btn-sm" onclick="window._editG('+gi+',\'quarter\',\'Результат на квартал:\')">Квартал</button>';
      h+='<button class="btn btn-secondary btn-sm" onclick="window._editG('+gi+',\'focus\',\'Фокус месяца:\')">Месяц</button>';
      h+='<button class="btn btn-secondary btn-sm" onclick="window._editG('+gi+',\'week\',\'Действия на неделю:\')">Неделя</button>';
      h+='<button class="btn btn-danger btn-sm" onclick="window._delG('+gi+')">Удалить</button></div>';
      h+='</div>';
    });
  }
  h+='<div class="card" style="margin-top:20px"><div class="card-title">Данные и безопасность</div>';
  h+='<div class="card-dim" style="margin-bottom:12px">Все записи хранятся на вашем устройстве. Если вы смените телефон или очистите данные браузера — записи пропадут. Делайте резервную копию раз в неделю.</div>';
  h+='<div class="card-dim" style="margin-bottom:12px;color:var(--cr)">Важно для iPhone/Safari: если вы не открываете дневник больше 7 дней, браузер может удалить данные. Открывайте дневник хотя бы раз в неделю или добавьте страницу на главный экран.</div>';
  h+='<div class="btn-row" style="flex-wrap:wrap">';
  h+='<button class="btn btn-secondary btn-sm" id="btn-export-full">Сохранить копию</button>';
  h+='<button class="btn btn-secondary btn-sm" id="btn-import">Загрузить копию</button>';
  h+='<button class="btn btn-danger btn-sm" id="btn-nuke">Удалить всё</button>';
  h+='</div><input type="file" id="import-file" style="display:none" accept=".json"></div>';
  $('goals-content').innerHTML=h;

  // Full export (localStorage + IndexedDB)
  $('btn-export-full').onclick=function(){
    var db=window.OPORA_DB;
    if(!db){alert('База не загружена');return}
    dbGetAll(db,'daily',function(daily){
      dbGetAll(db,'reviews',function(reviews){
        var fullData={localStorage:loadD(),daily:daily,reviews:reviews,exportDate:new Date().toISOString(),version:'2.0'};
        var json=JSON.stringify(fullData,null,2);
        var blob=new Blob([json],{type:'application/json'});
        var url=URL.createObjectURL(blob);
        var a=document.createElement('a');
        a.href=url;a.download='opora-backup-'+new Date().toISOString().split('T')[0]+'.json';
        a.click();URL.revokeObjectURL(url);
      });
    });
  };

  // Import
  $('btn-import').onclick=function(){$('import-file').click()};
  $('import-file').onchange=function(e){
    var file=e.target.files[0];if(!file)return;
    var reader=new FileReader();
    reader.onload=function(ev){
      try{
        var imported=JSON.parse(ev.target.result);
        if(!imported.version){alert('Неверный формат файла');return}
        if(!confirm('Загрузить данные из файла? Текущие данные будут заменены.'))return;
        // Restore localStorage
        if(imported.localStorage)saveD(imported.localStorage);
        // Restore IndexedDB
        var db=window.OPORA_DB;
        if(db&&imported.daily){
          var count=0;var total=imported.daily.length+(imported.reviews?imported.reviews.length:0);
          imported.daily.forEach(function(item){
            dbPut(db,'daily',item.key,item.val,function(){count++;if(count>=total){alert('Данные восстановлены! ('+imported.daily.length+' дней, '+(imported.reviews?imported.reviews.length:0)+' обзоров)');location.reload()}});
          });
          if(imported.reviews){
            imported.reviews.forEach(function(item){
              dbPut(db,'reviews',item.key,item.val,function(){count++;if(count>=total){alert('Данные восстановлены!');location.reload()}});
            });
          }
          if(!total){alert('Данные восстановлены!');location.reload()}
        }else{alert('Настройки восстановлены!');location.reload()}
      }catch(err){alert('Ошибка: файл повреждён')}
    };
    reader.readAsText(file);
  };

  $('btn-nuke').onclick=function(){if(!confirm('Удалить ВСЕ данные? Необратимо!'))return;if(!confirm('Точно? Записи нельзя будет восстановить.'))return;saveD({});var db=window.OPORA_DB;if(db){dbGetAll(db,'daily',function(){var tx=db.transaction('daily','readwrite');tx.objectStore('daily').clear();var tx2=db.transaction('reviews','readwrite');tx2.objectStore('reviews').clear();tx2.oncomplete=function(){renderGoals()}})}else{renderGoals()}};
};

window._editG=function(gi,field,label){var data=loadD();var g=data.goals[gi];var v=prompt(label,g[field]||'');if(v===null)return;g[field]=v.trim();saveD(data);renderGoals()};
window._delG=function(gi){if(!confirm('Удалить цель?'))return;var data=loadD();data.goals.splice(gi,1);saveD(data);renderGoals()};
window._togProg=function(gi,d){var data=loadD();var g=data.goals[gi];if(!g.progress)g.progress=[];g.progress[d]=!g.progress[d];saveD(data);renderGoals()};

// === HABITS ===
window.initHabits=function(){renderHabits()};
window.renderHabits=function(){
  var data=loadD();data.habits=data.habits||[];
  var h='<div class="sec-title">Трекер привычек</div><div class="divider"></div>';

  h+='<div class="card" style="margin-bottom:18px"><div class="card-title">Что это?</div><div class="card-text">';
  h+='<p>Вы сами выбираете 3-4 новые привычки, которые хотите внедрить в свою жизнь. Это маленькие ежедневные действия, которые приближают вас к тому состоянию, которое вы выбрали в целях. Каждый день вы просто отмечаете: сделал(-а) сегодня или нет. Одно нажатие — клеточка закрашивается.</p>';
  h+='</div></div>';

  h+='<div class="card" style="margin-bottom:18px"><div class="card-title">Зачем это нужно?</div><div class="card-text">';
  h+='<p>Цели живут в голове. Привычки — в теле. Можно поставить цель «быть здоровой» и ни разу не выйти на прогулку. Можно мечтать о спокойствии — и ни разу не выделить 10 минут тишины.</p>';
  h+='<p>Вам всегда кажется, что вы ничего не делаете — даже когда делаете больше всех. Ощущения врут. <strong>Клеточки не врут.</strong> Через 30 дней вы увидите свои паттерны глазами, а не чувствами. Это зеркало фактов.</p>';
  h+='</div></div>';

  h+='<div class="card" style="margin-bottom:18px"><div class="card-title">Как пользоваться?</div><div class="card-text">';
  h+='<p><strong>Шаг 1.</strong> Подумайте: какие маленькие действия каждый день приблизят вас к вашей цели и состоянию? Добавьте 3-4 такие привычки. Не «пробежать 10 км» — а «выйти на улицу на 15 минут». Не «медитировать час» — а «10 минут тишины». Чем проще — тем лучше.</p>';
  h+='<p><strong>Шаг 2.</strong> Каждый день нажимайте на клеточку — сделал(-а). Одно нажатие.</p>';
  h+='<p><strong>Шаг 3.</strong> Не ругайте себя за пустые клетки. Пустая клетка — не провал, это информация. Закрашенная — не победа, это факт.</p>';
  h+='</div></div>';

  h+='<div class="card" style="margin-bottom:18px"><div class="card-title">Что это даст?</div><div class="card-text">';
  h+='<p>Через 30 дней вы увидите: какие привычки держатся, какие срываются, в какие дни вы забиваете на себя. Это не про дисциплину — это про осознанность. Вы начнёте замечать, что в дни, когда вы делаете что-то для себя — вам лучше. Не потому что «так надо». А потому что вы это увидите своими глазами.</p>';
  h+='</div></div>';

  h+='<div class="sec-sub" style="font-style:italic">Примеры привычек: утренняя прогулка 15 мин, 10 минут тишины, не есть за ноутбуком, лечь до 23:00, время с партнёром, один звонок подруге в неделю, стакан воды утром</div>';

  // Group habits by goal
  var goals=data.goals||[];
  var unlinked=[];
  var byGoal={};
  data.habits.forEach(function(hab,hi){
    if(hab.goalId){
      var found=false;
      goals.forEach(function(g,gi){if(g.id===hab.goalId){if(!byGoal[gi])byGoal[gi]=[];byGoal[gi].push({hab:hab,hi:hi});found=true}});
      if(!found)unlinked.push({hab:hab,hi:hi});
    }else{
      unlinked.push({hab:hab,hi:hi});
    }
  });

  // Show by goal
  goals.forEach(function(g,gi){
    var items=byGoal[gi]||[];
    if(!items.length)return;
    h+='<div class="card"><div style="font-size:.82rem;color:var(--cr);margin-bottom:10px;font-family:Playfair Display,serif">'+esc(g.name)+'</div>';
    items.forEach(function(item){
      h+=renderHabitRow(item.hab,item.hi);
    });
    h+='</div>';
  });

  // Unlinked habits
  if(unlinked.length){
    h+='<div class="card"><div style="font-size:.82rem;color:var(--tm);margin-bottom:10px">Общие привычки</div>';
    unlinked.forEach(function(item){h+=renderHabitRow(item.hab,item.hi)});
    h+='</div>';
  }

  // Add new habit
  h+='<div class="card" style="margin-top:12px"><div style="font-size:.82rem;color:var(--td);margin-bottom:8px">Добавить привычку</div>';
  h+='<div class="form-group"><input class="form-input" id="hab-name" placeholder="Название привычки"></div>';
  if(goals.length){
    h+='<div class="form-group"><label class="form-label">Привязать к цели</label><select class="form-select" id="hab-goal"><option value="">Без привязки (общая)</option>';
    goals.forEach(function(g){h+='<option value="'+g.id+'">'+esc(g.name)+'</option>'});
    h+='</select></div>';
  }
  h+='<button class="btn btn-primary btn-sm" id="btn-add-hab">Добавить</button></div>';

  if(data.habits.length>0){
    h+='<div class="card-dim" style="margin-top:16px;padding:10px;background:rgba(107,29,58,.03);border-radius:10px">Вы заполняете трекер для себя — или чтобы успокоить тревогу? Если второе — это тоже данные.</div>';
  }

  $('habits-content').innerHTML=h;
  $('btn-add-hab').onclick=function(){
    var n=$('hab-name').value.trim();if(!n)return;
    var goalSel=$('hab-goal');
    var goalId=goalSel&&goalSel.value!==''?parseInt(goalSel.value):null;
    data.habits.push({name:n,days:[],goalId:goalId});
    saveD(data);$('hab-name').value='';renderHabits();
  };
};

function renderHabitRow(hab,hi){
  var h='<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><div class="habit-name">'+esc(hab.name)+'</div><button style="background:none;border:none;color:#a33;cursor:pointer;font-size:.8rem;opacity:.5" onclick="window._delHab('+hi+')">&times;</button></div>';
  h+='<div class="habit-grid">';
  for(var d=0;d<30;d++){var done=hab.days&&hab.days[d];h+='<div class="habit-dot'+(done?' done':'')+'" onclick="window._togHab('+hi+','+d+')"></div>'}
  h+='</div>';
  var count=(hab.days||[]).filter(Boolean).length;
  h+='<div style="font-size:.7rem;color:var(--tm);margin-top:3px">'+count+' / 30 ('+Math.round(count/30*100)+'%)</div></div>';
  return h;
}
window._togHab=function(hi,d){var data=loadD();if(!data.habits[hi].days)data.habits[hi].days=[];data.habits[hi].days[d]=!data.habits[hi].days[d];saveD(data);renderHabits()};
window._delHab=function(hi){var data=loadD();data.habits.splice(hi,1);saveD(data);renderHabits()};
})();
