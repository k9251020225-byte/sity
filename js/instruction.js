(function(){
var KEY='instruction_v1';
var $=function(id){return document.getElementById(id)};
var esc=function(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML};
function loadD(){try{return JSON.parse(localStorage.getItem(KEY))||{step:0}}catch(e){return{step:0}}}
function saveD(d){localStorage.setItem(KEY,JSON.stringify(d))}
var data=loadD();
var curStep=data.step||0;
var totalSteps=7;
var hours=['7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];

function render(){
  // Progress
  var ph='<div class="progress">';
  for(var i=0;i<totalSteps;i++){
    var cls=i<curStep?'done':i===curStep?'active':'';
    ph+='<div class="progress-dot '+cls+'">'+(i+1)+'</div>';
    if(i<totalSteps-1)ph+='<div class="progress-line'+(i<curStep?' done':'')+'"></div>';
  }
  ph+='</div>';
  $('progress-bar').innerHTML=ph;

  // Steps
  var h='';

  // STEP 0: Intro
  h+='<div class="step'+(curStep===0?' active':'')+'"><h1>Инструкция к себе</h1><div class="subtitle">Почему я делаю то, чего сам не хочу<br>7 дней. Вы заполняете — и видите себя.</div><div class="divider"></div>';
  h+='<div class="card-text"><p>Вы это уже знаете. Не всё, но многое. Вы чувствуете: что-то не так. Что жизнь идёт, а ощущения жизни — нет. Что вы устали, но не от работы. Что вы всё делаете правильно — но правильно для кого?</p>';
  h+='<p>Потому что <strong>понимание ничего не меняет.</strong> Можно годами понимать, что тревога связана с детством, что контроль — это защита. Понимание остаётся в голове. А то, что управляет вашей жизнью, сидит глубже.</p>';
  h+='<p><strong>Что меняет? Действие.</strong> Не большое. Не героическое. Конкретное.</p></div>';
  h+='<h2 style="margin-top:20px">О сопротивлении</h2><div class="divider"></div>';
  h+='<div class="resist"><div class="resist-quote">«Не сейчас. Начну на выходных.»</div><div class="resist-text">Это не тайм-менеджмент. Это психика, которая защищается от встречи с собой. Вы не откладываете. Вы избегаете.</div></div>';
  h+='<div class="resist"><div class="resist-quote">«Я и так себя знаю.»</div><div class="resist-text">Знать и видеть — разные вещи. Таблица покажет не то, что вы знаете о себе, а то, как вы живёте.</div></div>';
  h+='<div class="resist"><div class="resist-quote">«Это какая-то ерунда, таблички.»</div><div class="resist-text">Обесценивание — самая элегантная форма сопротивления. Чем сильнее голос говорит «ерунда» — тем точнее инструмент попадает в цель.</div></div>';
  h+='<div class="resist"><div class="resist-quote">«Мне страшно.»</div><div class="resist-text">Самый честный ответ. Страх перед изменениями — не слабость. Это сигнал, что вы подошли к чему-то настоящему.</div></div>';
  h+='<div class="btn-row"><div></div><button class="btn btn-primary" onclick="goStep(1)">Начать →</button></div></div>';

  // STEP 1: Days 1-2
  h+='<div class="step'+(curStep===1?' active':'')+'"><h2>Дни 1–2. Что я делаю</h2><div class="subtitle">Шаг 1 из 7 · Не как хочется — а как есть</div><div class="divider"></div>';
  h+='<div class="card-text"><p>Вспомните вчерашний день. Час за часом. Не идеальную версию — реальную. Что делали, что чувствовали, что было в теле, чего хотели на самом деле. Это займёт 15–20 минут.</p></div>';
  hours.forEach(function(hr,i){
    var pre=data['h'+i]||{};
    h+='<div class="hour-block"><div class="hour-time">'+hr+'</div>';
    h+='<div class="hour-field"><label>Что делал(-а):</label><input id="h'+i+'a" value="'+esc(pre.a||'')+'"></div>';
    h+='<div class="hour-field"><label>Что чувствовал(-а):</label><input id="h'+i+'b" value="'+esc(pre.b||'')+'"></div>';
    h+='<div class="hour-field"><label>Что в теле:</label><input id="h'+i+'c" value="'+esc(pre.c||'')+'"></div>';
    h+='<div class="hour-field"><label>Чего хотел(-а) на самом деле:</label><input id="h'+i+'d" value="'+esc(pre.d||'')+'"></div></div>';
  });
  h+='<div class="field"><label class="field-label">Посмотрите на записи. Что вы чувствуете?</label><textarea class="field-textarea" id="s1feel">'+(data.s1feel||'')+'</textarea></div>';
  h+='<div class="card-dim">Я разбирала этот механизм в подкасте — почему мы годами в режиме «должен». Слушайте в <a href="https://t.me/psyMuza" target="_blank" style="color:var(--accent)">@psyMuza</a>.</div>';
  h+='<div class="btn-row"><button class="btn btn-secondary btn-sm" onclick="goStep(0)">← Назад</button><button class="btn btn-primary" onclick="saveStep1();goStep(2)">День 3 →</button></div></div>';

  // STEP 2: Day 3
  h+='<div class="step'+(curStep===2?' active':'')+'"><h2>День 3. Когда я — это я</h2><div class="subtitle">Шаг 2 из 7</div><div class="divider"></div>';
  h+='<div class="card-text"><p>Вспомните момент, когда внутри и снаружи совпало. Когда вы не играли роль — а просто были. Не ищите «правильный» момент — ищите настоящий.</p></div>';
  for(var mi=1;mi<=3;mi++){
    var pre=data['m'+mi]||{};
    var titles=['Момент за последний месяц','Момент из детства (до 12 лет)','Ещё один — любой'];
    h+='<div class="card"><div style="font-size:.85rem;color:var(--accent);margin-bottom:8px">'+titles[mi-1]+'</div>';
    h+='<div class="field"><label class="field-label">Что делал(-а), где был(-а)</label><input class="field-input" id="m'+mi+'a" value="'+esc(pre.a||'')+'"></div>';
    h+='<div class="field"><label class="field-label">Кто рядом</label><input class="field-input" id="m'+mi+'b" value="'+esc(pre.b||'')+'"></div>';
    h+='<div class="field"><label class="field-label">Что чувствовал(-а) в теле</label><input class="field-input" id="m'+mi+'c" value="'+esc(pre.c||'')+'"></div></div>';
  }
  h+='<div class="field"><label class="field-label">Что общего между тремя моментами?</label><textarea class="field-textarea" id="s2common">'+(data.s2common||'')+'</textarea></div>';
  h+='<div class="card-dim">Тело помнит состояние «я — это я» — даже если голова забыла.</div>';
  h+='<div class="btn-row"><button class="btn btn-secondary btn-sm" onclick="saveStep2();goStep(1)">← День 1–2</button><button class="btn btn-primary" onclick="saveStep2();goStep(3)">День 4 →</button></div></div>';

  // STEP 3: Day 4
  h+='<div class="step'+(curStep===3?' active':'')+'"><h2>День 4. Мои ценности — черновик</h2><div class="subtitle">Шаг 3 из 7 · Не из списка в интернете. Из ваших данных.</div><div class="divider"></div>';
  h+='<div class="card-text"><p>Посмотрите на дни 1–3. Где было живое — а где мёртвое? Закончите фразу — быстро, не думая:</p><p><strong>«Мне по-настоящему важно, чтобы в моей жизни было...»</strong></p></div>';
  for(var vi=1;vi<=10;vi++){
    h+='<div class="field"><input class="field-input" id="v'+vi+'" value="'+(data['v'+vi]||'')+'" placeholder="'+vi+'."></div>';
  }
  h+='<div class="card-dim">Теперь вычеркните те, которые написали, потому что «так правильно». Оставьте только те, от которых что-то сжимается или расширяется в груди.<br><br><strong style="color:var(--accent)">Своё — расширяет. Чужое — сжимает или оставляет пустым.</strong></div>';
  h+='<div class="btn-row"><button class="btn btn-secondary btn-sm" onclick="saveStep3();goStep(2)">← День 3</button><button class="btn btn-primary" onclick="saveStep3();goStep(4)">День 5 →</button></div></div>';

  // STEP 4: Day 5
  h+='<div class="step'+(curStep===4?' active':'')+'"><h2>День 5. Шпаргалка к себе</h2><div class="subtitle">Шаг 4 из 7 · Ценность без действия — мечта. Ценность с действием — жизнь.</div><div class="divider"></div>';
  h+='<div class="card-text"><p>Возьмите ценности, которые остались после вычёркивания. Для каждой — заполните карточку. Это документ, с которым вы будете сверяться.</p></div>';
  for(var ci=1;ci<=5;ci++){
    var pre=data['c'+ci]||{};
    h+='<div class="value-card"><div class="field"><label class="field-label" style="color:var(--accent)">Ценность '+ci+'</label><input class="field-input" id="c'+ci+'n" value="'+esc(pre.n||'')+'"></div>';
    h+='<div class="field"><label class="field-label">Что значит конкретно</label><input class="field-input" id="c'+ci+'w" value="'+esc(pre.w||'')+'"></div>';
    h+='<div class="field"><label class="field-label">Когда живу по ней</label><input class="field-input" id="c'+ci+'y" value="'+esc(pre.y||'')+'"></div>';
    h+='<div class="field"><label class="field-label">Когда живу МИМО</label><input class="field-input" id="c'+ci+'m" value="'+esc(pre.m||'')+'"></div>';
    h+='<div class="field"><label class="field-label">Сигнал тела — как чувствую, что сбился(-ась)</label><input class="field-input" id="c'+ci+'s" value="'+esc(pre.s||'')+'"></div></div>';
  }
  h+='<div class="card-dim">Подкаст — почему мы знаем, что важно, и делаем наоборот. <a href="https://t.me/psyMuza" target="_blank" style="color:var(--accent)">@psyMuza</a>.</div>';
  h+='<div class="btn-row"><button class="btn btn-secondary btn-sm" onclick="saveStep4();goStep(3)">← День 4</button><button class="btn btn-primary" onclick="saveStep4();goStep(5)">День 6 →</button></div></div>';

  // STEP 5: Day 6
  h+='<div class="step'+(curStep===5?' active':'')+'"><h2>День 6. Столкновение</h2><div class="subtitle">Шаг 5 из 7 · Самый сложный день. И самый важный.</div><div class="divider"></div>';
  h+='<div class="card-text"><p>Возьмите дни 1–2 и день 5. Положите рядом. Посмотрите на свой реальный день — и на свои ценности. Где совпадают? Где расходятся? Это не про вину. Это про ясность.</p></div>';
  var s5=data.s5||{};
  h+='<div class="card">';
  h+='<div class="field"><label class="field-label">Часов по ценностям:</label><input class="field-input" id="s5a" value="'+esc(s5.a||'')+'"></div>';
  h+='<div class="field"><label class="field-label">Часов мимо:</label><input class="field-input" id="s5b" value="'+esc(s5.b||'')+'"></div>';
  h+='<div class="field"><label class="field-label">Для кого живёте «мимо»? Чьи ожидания?</label><textarea class="field-textarea" id="s5c">'+(s5.c||'')+'</textarea></div>';
  h+='<div class="field"><label class="field-label">Что будет, если перестать? Чего боитесь?</label><textarea class="field-textarea" id="s5d">'+(s5.d||'')+'</textarea></div>';
  h+='<div class="field"><label class="field-label">Что чувствуете прямо сейчас?</label><textarea class="field-textarea" id="s5e">'+(s5.e||'')+'</textarea></div></div>';
  h+='<div class="card-dim" style="color:var(--accent)">Хочется закрыть — вы в правильной точке.</div>';
  h+='<div class="btn-row"><button class="btn btn-secondary btn-sm" onclick="saveStep5();goStep(4)">← День 5</button><button class="btn btn-primary" onclick="saveStep5();goStep(6)">День 7 →</button></div></div>';

  // STEP 6: Day 7 + CTA
  h+='<div class="step'+(curStep===6?' active':'')+'"><h2>День 7. Одно действие</h2><div class="subtitle">Шаг 6 из 7 · Не десять. Одно.</div><div class="divider"></div>';
  h+='<div class="card-text"><p>Посмотрите на пропасть из дня 6. Не на всю — на один край. Какое одно действие уменьшит её хотя бы на сантиметр?</p></div>';
  var s6=data.s6||{};
  h+='<div class="card">';
  h+='<div class="field"><label class="field-label">Моё действие (конкретное)</label><input class="field-input" id="s6a" value="'+esc(s6.a||'')+'" placeholder="Четверг 19:00 — бассейн"></div>';
  h+='<div class="field"><label class="field-label">Когда (день и время)</label><input class="field-input" id="s6b" value="'+esc(s6.b||'')+'"></div>';
  h+='<div class="field"><label class="field-label">Это моё? Не «должен» — а «хочу»</label><textarea class="field-textarea" id="s6c">'+(s6.c||'')+'</textarea></div></div>';
  h+='<div class="card-text" style="margin-top:16px"><p><strong>Меняет не понимание. Меняет действие.</strong></p><p>Вы совершили семь действий за семь дней. Скачали. Открыли. Заполнили. Посмотрели. Столкнулись. Выбрали.</p></div>';

  // CTA
  h+='<div class="cta-block"><div class="cta-title">Что дальше</div><div class="cta-text">Шаг 7 из 7</div><div class="cta-paths">';
  h+='<div class="cta-path"><div class="cta-path-name">Путь 1. Самостоятельно.</div><div class="cta-path-desc">Продолжайте с таблицей. Заполняйте дни 1–2 раз в неделю. Наблюдайте динамику. Это уже работа.</div></div>';
  h+='<div class="cta-path"><div class="cta-path-name">Путь 2. Две сессии.</div><div class="cta-path-desc">Вы приходите с этим документом. Я анализирую ваши данные и выдаю персональную «Инструкцию к себе»: что стоит за паттернами, откуда они, конкретный маршрут.</div></div>';
  h+='<div class="cta-path"><div class="cta-path-name">Путь 3. Долгосрочная работа.</div><div class="cta-path-desc">Еженедельные встречи, письменные отчёты, полный маршрут изменений.</div></div></div>';
  h+='<div style="margin-top:16px"><a href="https://t.me/sudas_psy" target="_blank" class="btn btn-primary">Записаться</a></div></div>';
  h+='<div class="btn-row"><button class="btn btn-secondary btn-sm" onclick="saveStep6();goStep(5)">← День 6</button><div></div></div></div>';

  $('steps-container').innerHTML=h;
}

// Save functions
window.saveStep1=function(){
  hours.forEach(function(hr,i){
    data['h'+i]={a:($('h'+i+'a')||{}).value||'',b:($('h'+i+'b')||{}).value||'',c:($('h'+i+'c')||{}).value||'',d:($('h'+i+'d')||{}).value||''};
  });
  data.s1feel=($('s1feel')||{}).value||'';
  saveD(data);
};
window.saveStep2=function(){
  for(var mi=1;mi<=3;mi++){data['m'+mi]={a:($('m'+mi+'a')||{}).value||'',b:($('m'+mi+'b')||{}).value||'',c:($('m'+mi+'c')||{}).value||''}};
  data.s2common=($('s2common')||{}).value||'';saveD(data);
};
window.saveStep3=function(){
  for(var vi=1;vi<=10;vi++){data['v'+vi]=($('v'+vi)||{}).value||''}saveD(data);
};
window.saveStep4=function(){
  for(var ci=1;ci<=5;ci++){data['c'+ci]={n:($('c'+ci+'n')||{}).value||'',w:($('c'+ci+'w')||{}).value||'',y:($('c'+ci+'y')||{}).value||'',m:($('c'+ci+'m')||{}).value||'',s:($('c'+ci+'s')||{}).value||''}};saveD(data);
};
window.saveStep5=function(){
  data.s5={a:($('s5a')||{}).value||'',b:($('s5b')||{}).value||'',c:($('s5c')||{}).value||'',d:($('s5d')||{}).value||'',e:($('s5e')||{}).value||''};saveD(data);
};
window.saveStep6=function(){
  data.s6={a:($('s6a')||{}).value||'',b:($('s6b')||{}).value||'',c:($('s6c')||{}).value||''};saveD(data);
};

window.goStep=function(n){
  // Save current step data
  if(curStep===1)saveStep1();
  if(curStep===2)saveStep2();
  if(curStep===3)saveStep3();
  if(curStep===4)saveStep4();
  if(curStep===5)saveStep5();
  if(curStep===6)saveStep6();
  curStep=n;data.step=n;saveD(data);
  window.scrollTo(0,0);
  render();
};

render();
})();
