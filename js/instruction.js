(function(){
var KEY='instruction_v3';
// Clear old data
if(localStorage.getItem('instruction_v1'))localStorage.removeItem('instruction_v1');
if(localStorage.getItem('instruction_v2'))localStorage.removeItem('instruction_v2');
var $=function(id){return document.getElementById(id)};
var esc=function(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML};
function loadD(){try{return JSON.parse(localStorage.getItem(KEY))||{step:0}}catch(e){return{step:0}}}
function saveD(d){localStorage.setItem(KEY,JSON.stringify(d))}
var data=loadD();
var curStep=data.step||0;
var totalSteps=7;
var hours=['7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];

function render(){
  var ph='<div class="progress">';
  for(var i=0;i<totalSteps;i++){var cls=i<curStep?'done':i===curStep?'active':'';ph+='<div class="progress-dot '+cls+'">'+(i+1)+'</div>';if(i<totalSteps-1)ph+='<div class="progress-line'+(i<curStep?' done':'')+'"></div>'}
  ph+='</div>';$('progress-bar').innerHTML=ph;

  var h='';

  // === STEP 0: INTRO ===
  h+='<div class="step'+(curStep===0?' active':'')+'"><h1>Инструкция к себе</h1><div class="subtitle">Почему я делаю то, чего сам не хочу<br>7 дней. Вы заполняете — и видите себя.</div><div class="divider"></div>';
  h+='<div class="card"><div class="card-text">';
  h+='<p><strong>Прежде чем вы начнёте</strong></p>';
  h+='<p>Вы это уже знаете. Не всё, но многое. Вы чувствуете: что-то не так. Что жизнь идёт, а ощущения жизни — нет. Что вы устали, но не от работы. Что вы всё делаете правильно — но правильно для кого?</p>';
  h+='<p>Вы, возможно, даже читали об этом. Статьи, книги, посты. Кивали головой: да, это про меня. И ничего не менялось.</p>';
  h+='<p>Потому что <strong>понимание ничего не меняет.</strong></p>';
  h+='<p>Это не провокация. Это клинический факт. Можно годами понимать, что тревога связана с детством, что контроль — это защита, что вы живёте по чужому сценарию. Понимание остаётся в голове. А то, что управляет вашей жизнью, сидит глубже — в теле, в привычках, в автоматических реакциях, которые запускаются быстрее, чем вы успеваете подумать.</p>';
  h+='<p><strong>Что меняет? Действие.</strong></p>';
  h+='<p>Не большое. Не героическое. Конкретное.</p>';
  h+='<p>Открыть этот документ — действие. Написать первое слово в первую ячейку — действие. Посмотреть на то, что написали, и не отвернуться — действие.</p>';
  h+='<p>Этот инструмент — не для чтения. Он для заполнения. Вы не получите инсайт, просто пролистав страницы. Вы получите его, когда увидите свои собственные ответы — чёрным по белому, без чужой интерпретации.</p>';
  h+='</div></div>';

  h+='<h2>О сопротивлении</h2><div class="divider"></div>';
  h+='<div class="resist"><div class="resist-quote">«Не сейчас. Начну на выходных.»</div><div class="resist-text">Это не тайм-менеджмент. Это психика, которая защищается от встречи с собой. Она делает это виртуозно — через отложенное намерение. Вы не откладываете. Вы избегаете. И это нормально. Но если вы узнали этот паттерн — вы уже видите его. А тот, кто видит свою защиту, может выбрать: подчиниться ей или сделать иначе.</div></div>';
  h+='<div class="resist"><div class="resist-quote">«Я и так себя знаю.»</div><div class="resist-text">Возможно. Но знать и видеть — разные вещи. Знание живёт в голове. Оно удобное, привычное, безопасное. А эта таблица покажет не то, что вы знаете о себе, а то, как вы живёте. И между первым и вторым — пропасть, которую можно не замечать, пока не запишешь.</div></div>';
  h+='<div class="resist"><div class="resist-quote">«Это какая-то ерунда, таблички.»</div><div class="resist-text">Обесценивание — самая элегантная форма сопротивления. Когда психика чувствует, что инструмент может сработать, — она говорит: «это несерьёзно». Чем сильнее внутренний голос говорит «ерунда» — тем точнее инструмент попадает в цель.</div></div>';
  h+='<div class="resist"><div class="resist-quote">«Мне страшно.»</div><div class="resist-text">Это самый честный ответ. И самый здоровый. Страх перед изменениями — не слабость. Это сигнал, что вы подошли к чему-то настоящему. Психика устроена так: она сохраняет привычное, даже если привычное — это боль. Потому что привычная боль предсказуема, а новое — нет. Страх говорит: «за этой таблицей — территория, которую ты не контролируешь». И это правда. Но именно там начинается ваша жизнь.</div></div>';

  h+='<div class="card" style="margin-top:16px"><div class="card-text"><p><strong>Как работать с этим документом</strong></p>';
  h+='<p>Один день — один шаг. Не забегайте вперёд.</p>';
  h+='<p>Пишите — не думайте об этом в душе. Мысль в голове — это облако. Мысль на бумаге — это факт, с которым можно работать.</p>';
  h+='<p>Если захочется закрыть — отметьте это. Не боритесь. Запишите: «хочу закрыть». И продолжайте. Именно в этой точке — самое ценное.</p>';
  h+='<p>Это не тест. Здесь нет правильных ответов. Есть только ваши.</p></div></div>';
  h+='<div class="btn-row"><div></div><button class="btn btn-primary" onclick="goStep(1)">Начать →</button></div></div>';

  // === STEP 1: DAYS 1-2 ===
  h+='<div class="step'+(curStep===1?' active':'')+'"><h2>Дни 1–2. Что я делаю</h2><div class="subtitle">Не как хочется — а как есть. Вчерашний день. Конкретно.</div><div class="divider"></div>';
  h+='<div class="card"><div class="card-text"><p><strong>Зачем это нужно?</strong></p><p>Мы не видим свою жизнь, пока живём на автопилоте. Записать день по часам — значит остановить плёнку и посмотреть каждый кадр. Вы удивитесь: сколько часов уходит на «должен», и как мало — на «хочу». Это не про вину. Это про ясность.</p></div></div>';

  h+='<div class="card-dim" style="margin-bottom:12px">Вспомните вчерашний день. Час за часом. Не идеальную версию — реальную.</div>';
  hours.forEach(function(hr,i){
    var pre=data['h'+i]||{};
    h+='<div class="hour-block"><div class="hour-time">'+hr+'</div>';
    h+='<div class="hour-field"><label>Что делал(-а):</label><input id="h'+i+'a" value="'+esc(pre.a||'')+'"></div>';
    h+='<div class="hour-field"><label>Что чувствовал(-а):</label><input id="h'+i+'b" value="'+esc(pre.b||'')+'"></div>';
    h+='<div class="hour-field"><label>Что в теле:</label><input id="h'+i+'c" value="'+esc(pre.c||'')+'"></div>';
    h+='<div class="hour-field"><label>Чего хотел(-а) на самом деле:</label><input id="h'+i+'d" value="'+esc(pre.d||'')+'"></div></div>';
  });
  var adv=data.advanced||{};
  h+='<div class="card" style="margin-top:14px"><div class="card-title">Анализ дня</div>';
  h+='<div class="field"><label class="field-label">Сколько часов — на «должен»?</label><input class="field-input" id="adv-must" value="'+esc(adv.must||'')+'"></div>';
  h+='<div class="field"><label class="field-label">Сколько часов — на «хочу»?</label><input class="field-input" id="adv-want" value="'+esc(adv.want||'')+'"></div>';
  h+='<div class="field"><label class="field-label">В какие часы я был(-а) живым(-ой)?</label><input class="field-input" id="adv-alive" value="'+esc(adv.alive||'')+'"></div>';
  h+='<div class="field"><label class="field-label">В какие часы — на автопилоте?</label><input class="field-input" id="adv-auto" value="'+esc(adv.auto||'')+'"></div>';
  h+='<div class="field"><label class="field-label">Что удивило?</label><textarea class="field-textarea" id="adv-surprise">'+(adv.surprise||'')+'</textarea></div></div>';

  // Auto-analysis after saving step 1
  h+='<div id="auto-analysis" style="margin-top:14px"></div>';

  h+='<div class="field" style="margin-top:14px"><label class="field-label">Посмотрите на записи. Что вы чувствуете? Одним предложением.</label><textarea class="field-textarea" id="s1feel">'+(data.s1feel||'')+'</textarea></div>';
  h+='<div class="card-dim">Я разбирала этот механизм в подкасте — почему мы годами в режиме «должен» и не замечаем. Слушайте в <a href="https://t.me/psyMuza" target="_blank" style="color:var(--accent)">@psyMuza</a>.</div>';
  h+='<div class="btn-row"><button class="btn btn-secondary btn-sm" onclick="saveStep1();goStep(0)">← Назад</button><button class="btn btn-secondary btn-sm" onclick="saveStep1();showAnalysis()">Показать анализ</button><button class="btn btn-primary" onclick="saveStep1();goStep(2)">День 3 →</button></div></div>';

  // === STEP 2: DAY 3 ===
  h+='<div class="step'+(curStep===2?' active':'')+'"><h2>День 3. Когда я — это я</h2><div class="subtitle">Вспомните момент, когда внутри и снаружи совпало.</div><div class="divider"></div>';
  h+='<div class="card-text"><p>Когда вы не играли роль, не соответствовали ожиданиям — а просто были. И чувствовали: вот сейчас — я на месте. Я — это я. Не для кого-то. Не потому что должен. А потому что так — моё.</p></div>';
  var mTitles=['Момент за последний месяц','Момент из детства (до 12 лет)','Ещё один — любой'];
  for(var mi=1;mi<=3;mi++){
    var pre=data['m'+mi]||{};
    h+='<div class="card"><div style="font-size:.85rem;color:var(--accent);margin-bottom:8px">'+mTitles[mi-1]+'</div>';
    h+='<div class="field"><label class="field-label">Что делал(-а), где был(-а)</label><input class="field-input" id="m'+mi+'a" value="'+esc(pre.a||'')+'"></div>';
    h+='<div class="field"><label class="field-label">Кто рядом</label><input class="field-input" id="m'+mi+'b" value="'+esc(pre.b||'')+'"></div>';
    h+='<div class="field"><label class="field-label">Что чувствовал(-а) в теле</label><input class="field-input" id="m'+mi+'c" value="'+esc(pre.c||'')+'" placeholder="Тепло, лёгкость, расширение..."></div></div>';
  }
  h+='<div class="field"><label class="field-label">Что общего между тремя моментами?</label><textarea class="field-textarea" id="s2common">'+(data.s2common||'')+'</textarea></div>';
  h+='<div class="card-dim">Тело помнит состояние «я — это я» — даже если голова забыла.</div>';
  h+='<div class="btn-row"><button class="btn btn-secondary btn-sm" onclick="saveStep2();goStep(1)">← Дни 1–2</button><button class="btn btn-primary" onclick="saveStep2();goStep(3)">День 4 →</button></div></div>';

  // === STEP 3: DAY 4 ===
  h+='<div class="step'+(curStep===3?' active':'')+'"><h2>День 4. Мои ценности — черновик</h2><div class="subtitle">Не из списка в интернете. Из ваших данных.</div><div class="divider"></div>';
  h+='<div class="card-text"><p>Посмотрите на дни 1–3 и закончите фразу — быстро, не думая:</p><p><strong>«Мне по-настоящему важно, чтобы в моей жизни было...»</strong></p></div>';
  for(var vi=1;vi<=10;vi++){h+='<div class="field"><input class="field-input" id="v'+vi+'" value="'+(data['v'+vi]||'')+'" placeholder="'+vi+'."></div>'}
  h+='<div class="card" style="margin-top:14px"><div class="card-text"><p>Вычеркните те, которые написали, потому что «так правильно». Оставьте только те, от которых что-то сжимается или расширяется в груди.</p><p><strong>Своё — расширяет. Чужое — сжимает или оставляет пустым.</strong></p></div></div>';
  h+='<div class="btn-row"><button class="btn btn-secondary btn-sm" onclick="saveStep3();goStep(2)">← День 3</button><button class="btn btn-primary" onclick="saveStep3();goStep(4)">День 5 →</button></div></div>';

  // === STEP 4: DAY 5 ===
  h+='<div class="step'+(curStep===4?' active':'')+'"><h2>День 5. Шпаргалка к себе</h2><div class="subtitle">Ценность без действия — мечта. Ценность с действием — жизнь.</div><div class="divider"></div>';
  h+='<div class="card-text"><p>Возьмите ценности, которые остались после вычёркивания. Для каждой — заполните карточку. Это ядро — к нему вы будете возвращаться.</p></div>';
  for(var ci=1;ci<=7;ci++){
    var pre=data['c'+ci]||{};
    h+='<div class="value-card"><div class="field"><label class="field-label" style="color:var(--accent)">Ценность '+ci+'</label><input class="field-input" id="c'+ci+'n" value="'+esc(pre.n||'')+'"></div>';
    h+='<div class="field"><label class="field-label">Что значит конкретно</label><input class="field-input" id="c'+ci+'w" value="'+esc(pre.w||'')+'"></div>';
    h+='<div class="field"><label class="field-label">Когда живу по ней</label><input class="field-input" id="c'+ci+'y" value="'+esc(pre.y||'')+'"></div>';
    h+='<div class="field"><label class="field-label">Когда живу МИМО</label><input class="field-input" id="c'+ci+'m" value="'+esc(pre.m||'')+'"></div>';
    h+='<div class="field"><label class="field-label">Сигнал тела — как чувствую, что сбился(-ась)</label><input class="field-input" id="c'+ci+'s" value="'+esc(pre.s||'')+'"></div></div>';
  }
  h+='<div class="card-dim">Подкаст — почему мы знаем, что важно, и делаем наоборот. <a href="https://t.me/psyMuza" target="_blank" style="color:var(--accent)">@psyMuza</a>.</div>';
  h+='<div class="btn-row"><button class="btn btn-secondary btn-sm" onclick="saveStep4();goStep(3)">← День 4</button><button class="btn btn-primary" onclick="saveStep4();goStep(5)">День 6 →</button></div></div>';

  // === STEP 5: DAY 6 ===
  h+='<div class="step'+(curStep===5?' active':'')+'"><h2>День 6. Столкновение</h2><div class="subtitle">Самый сложный день. И самый важный.</div><div class="divider"></div>';
  h+='<div class="card-text"><p>Возьмите дни 1–2 и день 5. Положите рядом. Посмотрите на свой реальный день — и на свои ценности. Где совпадают? Где расходятся?</p></div>';
  var s5=data.s5||{};
  h+='<div class="card">';
  h+='<div class="field"><label class="field-label">Часов по ценностям:</label><input class="field-input" id="s5a" value="'+esc(s5.a||'')+'" type="number" placeholder="0"></div>';
  h+='<div class="field"><label class="field-label">Часов мимо:</label><input class="field-input" id="s5b" value="'+esc(s5.b||'')+'" type="number" placeholder="0"></div>';
  h+='<div id="gap-visual"></div>';
  h+='<div class="field"><label class="field-label">Для кого живёте «мимо»? Чьи ожидания?</label><textarea class="field-textarea" id="s5c">'+(s5.c||'')+'</textarea></div>';
  h+='<div class="field"><label class="field-label">Что будет, если перестать? Чего боитесь?</label><textarea class="field-textarea" id="s5d">'+(s5.d||'')+'</textarea></div>';
  h+='<div class="field"><label class="field-label">Что чувствуете прямо сейчас?</label><textarea class="field-textarea" id="s5e">'+(s5.e||'')+'</textarea></div></div>';
  h+='<div class="card-dim" style="color:var(--accent)">Хочется закрыть — вы в правильной точке.</div>';
  h+='<div class="btn-row"><button class="btn btn-secondary btn-sm" onclick="saveStep5();goStep(4)">← День 5</button><button class="btn btn-primary" onclick="saveStep5();goStep(6)">День 7 →</button></div></div>';

  // === STEP 6: DAY 7 + CTA ===
  h+='<div class="step'+(curStep===6?' active':'')+'"><h2>День 7. Одно действие</h2><div class="subtitle">Не десять. Одно. Одно действие — это изменение.</div><div class="divider"></div>';
  h+='<div class="card-text"><p>Посмотрите на пропасть из дня 6. Не на всю — на один край. Какое одно действие уменьшит её хотя бы на сантиметр?</p></div>';
  var s6=data.s6||{};
  h+='<div class="card">';
  h+='<div class="field"><label class="field-label">Моё действие (конкретное)</label><input class="field-input" id="s6a" value="'+esc(s6.a||'')+'" placeholder="Четверг 19:00 — бассейн"></div>';
  h+='<div class="field"><label class="field-label">Когда (день и время)</label><input class="field-input" id="s6b" value="'+esc(s6.b||'')+'"></div>';
  h+='<div class="field"><label class="field-label">Это моё? Не «должен» — а «хочу»</label><textarea class="field-textarea" id="s6c">'+(s6.c||'')+'</textarea></div></div>';

  h+='<div class="card" style="margin-top:16px"><div class="card-text"><p><strong>Меняет не понимание. Меняет действие.</strong></p><p>Вы совершили семь действий за семь дней. Скачали. Открыли. Заполнили. Посмотрели. Столкнулись. Выбрали.</p></div></div>';

  // Mini analytics
  h+='<div class="card" style="margin-top:20px"><div class="card-title">Ваши данные за 7 дней</div><div id="mini-analytics"></div></div>';

  // CTA
  h+='<div class="cta-block"><div class="cta-title">Что дальше</div><div class="cta-text">Этот тренинг — вход. Вы увидели свои паттерны. Теперь есть два пути:</div><div class="cta-paths">';
  h+='<div class="cta-path"><div class="cta-path-name">Для тех, кто ценит время: 2 сессии под 1 запрос</div><div class="cta-path-desc">Вы приходите с этим документом. Я анализирую ваши данные, провожу глубинную диагностику и выдаю персональную «Инструкцию к себе»: что стоит за паттернами, откуда они, что делать. Письменный аналитический отчёт на руках. Конкретный ответ — не процесс.</div></div>';
  h+='<div class="cta-path"><div class="cta-path-name">Для тех, кто хочет глубоко: личная терапия</div><div class="cta-path-desc">Мягко. Системно. В вашем ритме. Если то, что вы увидели, — не единичный эпизод, а система, которая повторяется годами. Еженедельные встречи, письменные отчёты на каждом этапе, полный маршрут изменений.</div></div></div>';
  h+='<div class="cta-text" style="margin-top:14px">В любом случае — вы уже начали. Вы уже сделали то, на что большинство не решается: честно посмотрели на свою жизнь и записали то, что увидели.</div>';
  h+='<div style="margin-top:16px"><a href="https://t.me/sudas_psy" target="_blank" class="btn btn-primary">Записаться</a></div></div>';
  h+='<div class="btn-row"><button class="btn btn-secondary btn-sm" onclick="saveStep6();goStep(5)">← День 6</button><div></div></div></div>';

  $('steps-container').innerHTML=h;
}

// Saves
window.saveStep1=function(){
  hours.forEach(function(hr,i){data['h'+i]={a:($('h'+i+'a')||{}).value||'',b:($('h'+i+'b')||{}).value||'',c:($('h'+i+'c')||{}).value||'',d:($('h'+i+'d')||{}).value||''}});
  data.advanced={must:($('adv-must')||{}).value||'',want:($('adv-want')||{}).value||'',alive:($('adv-alive')||{}).value||'',auto:($('adv-auto')||{}).value||'',surprise:($('adv-surprise')||{}).value||''};
  data.s1feel=($('s1feel')||{}).value||'';saveD(data)};
window.saveStep2=function(){for(var mi=1;mi<=3;mi++){data['m'+mi]={a:($('m'+mi+'a')||{}).value||'',b:($('m'+mi+'b')||{}).value||'',c:($('m'+mi+'c')||{}).value||''}};data.s2common=($('s2common')||{}).value||'';saveD(data)};
window.saveStep3=function(){for(var vi=1;vi<=10;vi++){data['v'+vi]=($('v'+vi)||{}).value||''}saveD(data)};
window.saveStep4=function(){for(var ci=1;ci<=7;ci++){data['c'+ci]={n:($('c'+ci+'n')||{}).value||'',w:($('c'+ci+'w')||{}).value||'',y:($('c'+ci+'y')||{}).value||'',m:($('c'+ci+'m')||{}).value||'',s:($('c'+ci+'s')||{}).value||''}};saveD(data)};
window.saveStep5=function(){data.s5={a:($('s5a')||{}).value||'',b:($('s5b')||{}).value||'',c:($('s5c')||{}).value||'',d:($('s5d')||{}).value||'',e:($('s5e')||{}).value||''};saveD(data)};
window.saveStep6=function(){data.s6={a:($('s6a')||{}).value||'',b:($('s6b')||{}).value||'',c:($('s6c')||{}).value||''};saveD(data)};

window.goStep=function(n){
  if(curStep===1)saveStep1();if(curStep===2)saveStep2();if(curStep===3)saveStep3();
  if(curStep===4)saveStep4();if(curStep===5)saveStep5();if(curStep===6)saveStep6();
  curStep=n;data.step=n;saveD(data);window.scrollTo(0,0);render()};

// Auto-analysis of hours
window.showAnalysis=function(){
  var el=$('auto-analysis');if(!el)return;
  var feelings={},bodyParts={},mustCount=0,wantCount=0;
  hours.forEach(function(hr,i){
    var d=data['h'+i]||{};
    if(d.b){var f=d.b.trim().toLowerCase();if(f)feelings[f]=(feelings[f]||0)+1}
    if(d.c){var b=d.c.trim().toLowerCase();if(b)bodyParts[b]=(bodyParts[b]||0)+1}
    if(d.d&&d.d.trim()&&d.a&&d.a.trim()){
      if(d.d.trim().toLowerCase()!==d.a.trim().toLowerCase())mustCount++;else wantCount++;
    }
  });
  var topFeel=Object.keys(feelings).sort(function(a,b){return feelings[b]-feelings[a]});
  var topBody=Object.keys(bodyParts).sort(function(a,b){return bodyParts[b]-bodyParts[a]});
  var total=mustCount+wantCount||1;
  var mustPct=Math.round(mustCount/total*100);

  var ah='<div class="card" style="background:rgba(139,0,32,.04);border-color:rgba(139,0,32,.15)"><div class="card-title" style="color:var(--accent)">Что показал ваш день</div><div class="card-text">';
  if(mustPct>60)ah+='<p><strong>'+mustPct+'% дня — на «должен».</strong> Вы отдали большую часть своих жизненных сил чужим ожиданиям.</p>';
  if(topFeel.length)ah+='<p>Самое частое чувство за день: <strong>'+esc(topFeel[0])+'</strong>'+(topFeel[1]?' и <strong>'+esc(topFeel[1])+'</strong>':'')+'</p>';
  if(topBody.length)ah+='<p>Тело сигналило: <strong>'+esc(topBody[0])+'</strong></p>';
  ah+='<p style="font-size:.82rem;color:var(--accent);margin-top:8px">Это не приговор. Это данные. С данными можно работать.</p>';
  ah+='</div></div>';
  el.innerHTML=ah;
};

// Gap visual on day 6
function updateGap(){
  var el=$('gap-visual');if(!el)return;
  var a=parseInt(($('s5a')||{}).value)||0;
  var b=parseInt(($('s5b')||{}).value)||0;
  if(!a&&!b){el.innerHTML='';return}
  var total=a+b||1;
  var pctA=Math.round(a/total*100);
  var pctB=100-pctA;
  var gh='<div style="margin:14px 0"><div style="display:flex;height:24px;border-radius:12px;overflow:hidden;margin-bottom:6px">';
  gh+='<div style="width:'+pctA+'%;background:var(--accent);transition:width .5s"></div>';
  gh+='<div style="width:'+pctB+'%;background:var(--bd);transition:width .5s"></div></div>';
  gh+='<div style="display:flex;justify-content:space-between;font-size:.75rem"><span style="color:var(--accent)">По ценностям: '+a+'ч ('+pctA+'%)</span><span style="color:var(--tl)">Мимо: '+b+'ч ('+pctB+'%)</span></div>';
  if(pctB>60)gh+='<div style="font-size:.84rem;color:var(--accent);margin-top:10px;font-style:italic">Больше половины вашего дня — не ваша жизнь.</div>';
  gh+='</div>';
  el.innerHTML=gh;
}

// Mini analytics on day 7
function showMiniAnalytics(){
  var el=$('mini-analytics');if(!el)return;
  // Collect data
  var adv=data.advanced||{};
  var s5=data.s5||{};
  var values=[];for(var ci=1;ci<=7;ci++){var c=data['c'+ci];if(c&&c.n)values.push(c.n)}

  var ah='';
  if(adv.must||adv.want)ah+='<div style="font-size:.88rem;color:var(--td);margin-bottom:8px">Часов на «должен»: <strong style="color:var(--accent)">'+(adv.must||'?')+'</strong> · На «хочу»: <strong style="color:var(--accent)">'+(adv.want||'?')+'</strong></div>';
  if(s5.a||s5.b)ah+='<div style="font-size:.88rem;color:var(--td);margin-bottom:8px">По ценностям: <strong>'+(s5.a||'?')+'ч</strong> · Мимо: <strong>'+(s5.b||'?')+'ч</strong></div>';
  if(values.length)ah+='<div style="font-size:.88rem;color:var(--td);margin-bottom:8px">Ваши ценности: <strong style="color:var(--accent)">'+values.map(esc).join(', ')+'</strong></div>';
  if(adv.alive)ah+='<div style="font-size:.88rem;color:var(--td);margin-bottom:8px">Живой(-ая) в: <strong>'+esc(adv.alive)+'</strong></div>';

  ah+='<div style="font-size:.82rem;color:var(--tm);margin-top:12px;font-style:italic">Это ваш портрет. Не чужой анализ — ваши собственные данные. Если хотите разобраться, что за ними стоит и что с этим делать — я рядом.</div>';
  el.innerHTML=ah;
}

// After render — attach gap listeners and show analytics
var origRender=render;
render=function(){
  origRender();
  // Attach gap visual listeners
  setTimeout(function(){
    if($('s5a'))$('s5a').oninput=updateGap;
    if($('s5b'))$('s5b').oninput=updateGap;
    updateGap();
    showMiniAnalytics();
    // Show analysis if data exists
    if(data.advanced&&(data.advanced.must||data.advanced.want))showAnalysis();
  },50);
};

render();
})();
