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
  var h='<div class="sec-title">Этап 3. Постановка цели</div><div class="divider"></div>';
  h+='<div class="sec-sub">Ответьте честно. Эти вопросы помогут отделить настоящее желание от привычки угождать.</div>';
  h+='<div class="form-group"><label class="form-label">Категория</label><select class="form-select" id="g-cat">';
  GC.categories.forEach(function(c){h+='<option>'+c+'</option>'});
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
  h+='<div class="card" style="margin:16px 0"><div class="card-title">8 вопросов к цели</div>';
  qs.forEach(function(q){
    h+='<div class="form-group"><label class="form-label">'+q.label+'</label><textarea class="form-textarea" id="gq-'+q.id+'" rows="2" placeholder="'+q.ph+'"></textarea>';
    if(q.hint)h+='<div class="card-dim">'+q.hint+'</div>';
    h+='</div>';
  });
  h+='</div>';

  // Decomposition
  h+='<div class="card"><div class="card-title">Путь к цели</div>';
  h+='<div class="card-dim" style="margin-bottom:12px">Год далеко. Разбейте на понятные отрезки.</div>';
  h+='<div class="form-group"><label class="form-label">Что я хочу получить за 3 месяца?</label><input class="form-input" id="g-quarter"></div>';
  h+='<div class="form-group"><label class="form-label">На чём сосредоточусь в этом месяце?</label><input class="form-input" id="g-focus"></div>';
  h+='<div class="form-group"><label class="form-label">Что конкретно сделаю на этой неделе?</label><input class="form-input" id="g-week"></div>';
  h+='</div>';

  h+='<div class="btn-row" style="padding-bottom:100px"><button class="btn btn-primary" id="btn-add-goal">Добавить цель</button></div>';
  $('add-content').innerHTML=h;

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
  h+='<div class="btn-row"><button class="btn btn-secondary btn-sm" id="btn-export">Экспорт</button><button class="btn btn-danger btn-sm" id="btn-nuke">Удалить всё</button></div>';
  $('goals-content').innerHTML=h;

  $('btn-export').onclick=function(){var d=JSON.stringify(loadD(),null,2);if(navigator.clipboard)navigator.clipboard.writeText(d).then(function(){$('modal').classList.add('show')})};
  $('btn-nuke').onclick=function(){if(!confirm('Удалить ВСЕ данные?'))return;if(!confirm('Точно?'))return;saveD({});renderGoals()};
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
  h+='<p>Простой инструмент: вы выбираете 3-4 маленьких ежедневных действия и каждый день отмечаете — сделал(-а) или нет. Одно нажатие. Клеточка закрашивается.</p>';
  h+='</div></div>';

  h+='<div class="card" style="margin-bottom:18px"><div class="card-title">Зачем это нужно?</div><div class="card-text">';
  h+='<p>Цели живут в голове. Привычки — в теле. Можно поставить цель «быть здоровой» и ни разу не выйти на прогулку. Можно мечтать о спокойствии — и ни разу не выделить 10 минут тишины.</p>';
  h+='<p>Вам всегда кажется, что вы ничего не делаете — даже когда делаете больше всех. Ощущения врут. <strong>Клеточки не врут.</strong> Через 30 дней вы увидите свои паттерны глазами, а не чувствами. Это зеркало фактов.</p>';
  h+='</div></div>';

  h+='<div class="card" style="margin-bottom:18px"><div class="card-title">Как пользоваться?</div><div class="card-text">';
  h+='<p><strong>Шаг 1.</strong> Добавьте 3-4 привычки — маленькие действия, которые приближают вас к желаемому состоянию. Не «пробежать 10 км» — а «выйти на улицу на 15 минут». Не «медитировать час» — а «10 минут тишины».</p>';
  h+='<p><strong>Шаг 2.</strong> Каждый день нажимайте на клеточку — сделал(-а). Одно нажатие.</p>';
  h+='<p><strong>Шаг 3.</strong> Не ругайте себя за пустые клетки. Пустая клетка — не провал, это информация. Закрашенная — не победа, это факт.</p>';
  h+='</div></div>';

  h+='<div class="card" style="margin-bottom:18px"><div class="card-title">Что это даст?</div><div class="card-text">';
  h+='<p>Через 30 дней вы увидите: какие привычки держатся, какие срываются, в какие дни вы забиваете на себя. Это не про дисциплину — это про осознанность. Вы начнёте замечать, что в дни, когда вы делаете что-то для себя — вам лучше. Не потому что «так надо». А потому что вы это увидите своими глазами.</p>';
  h+='</div></div>';

  h+='<div class="sec-sub" style="font-style:italic">Примеры привычек: утренняя прогулка 15 мин, 10 минут тишины, не есть за ноутбуком, лечь до 23:00, время с партнёром, один звонок подруге в неделю, стакан воды утром</div>';

  data.habits.forEach(function(hab,hi){
    h+='<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><div class="habit-name">'+esc(hab.name)+'</div><button style="background:none;border:none;color:#a33;cursor:pointer;font-size:.8rem;opacity:.5" onclick="window._delHab('+hi+')">&times;</button></div>';
    h+='<div class="habit-grid">';
    for(var d=0;d<30;d++){var done=hab.days&&hab.days[d];h+='<div class="habit-dot'+(done?' done':'')+'" onclick="window._togHab('+hi+','+d+')"></div>'}
    h+='</div>';
    var count=(hab.days||[]).filter(Boolean).length;
    h+='<div style="font-size:.7rem;color:var(--tm);margin-top:4px">'+count+' / 30</div></div>';
  });

  h+='<div style="display:flex;gap:8px;margin-top:12px"><input class="form-input" id="hab-name" placeholder="Новая привычка" style="flex:1"><button class="btn btn-primary btn-sm" id="btn-add-hab">+</button></div>';

  // Warning for compulsive
  if(data.habits.length>0){
    h+='<div class="card-dim" style="margin-top:16px;padding:10px;background:rgba(107,29,58,.03);border-radius:10px">Вы заполняете трекер для себя — или чтобы успокоить тревогу? Если второе — это тоже данные.</div>';
  }

  $('habits-content').innerHTML=h;
  $('btn-add-hab').onclick=function(){var n=$('hab-name').value.trim();if(!n)return;data.habits.push({name:n,days:[]});saveD(data);$('hab-name').value='';renderHabits()};
};

window._togHab=function(hi,d){var data=loadD();if(!data.habits[hi].days)data.habits[hi].days=[];data.habits[hi].days[d]=!data.habits[hi].days[d];saveD(data);renderHabits()};
window._delHab=function(hi){var data=loadD();data.habits.splice(hi,1);saveD(data);renderHabits()};
})();
