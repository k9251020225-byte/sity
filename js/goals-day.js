(function(){
var $=function(id){return document.getElementById(id)};
var esc=function(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML};

window.initDay=function(){renderDay()};

window.renderDay=function(){
  var db=window.OPORA_DB;var data=window.loadD();
  var today=new Date().toISOString().split('T')[0];
  var startDate=data.startDate||today;
  if(!data.startDate){data.startDate=today;saveD(data)}
  var dayNum=Math.floor((new Date(today)-new Date(startDate))/86400000)+1;
  if(dayNum<1)dayNum=1;if(dayNum>365)dayNum=365;
  var weekNum=Math.ceil(dayNum/7);if(weekNum>4)weekNum=((weekNum-1)%4)+1;
  var theme=GC.weekThemes[weekNum-1]||GC.weekThemes[0];
  var qIdx=(dayNum-1)%GC.dailyQuestions.length;
  var question=GC.dailyQuestions[qIdx];

  var h='';
  // Week theme
  h+='<div class="week-badge">Неделя '+weekNum+' — '+theme.name+'</div>';
  h+='<div class="sec-sub" style="margin-bottom:16px">'+theme.desc+'</div>';

  // Checkpoint?
  var cp=GC.checkpoints[dayNum];
  if(cp){
    h+='<div class="checkpoint"><div class="checkpoint-title">'+cp.title+'</div><div style="font-size:.84rem;color:var(--td);line-height:1.75;white-space:pre-line">'+esc(cp.text)+'</div>';
    if(dayNum===14)h+='<div style="margin-top:12px"><a href="https://t.me/sudas_psy" target="_blank" class="btn btn-secondary btn-sm">Хочу разобрать это с Екатериной</a></div>';
    if(dayNum===30)h+='<div class="form-group" style="margin-top:14px"><label class="form-label">Моё письмо себе — тому человеку, который открыл дневник 30 дней назад</label><textarea class="form-textarea" id="d-letter30" rows="8"></textarea></div>';
    h+='</div>';
  }

  // Crisis button (days 8-15)
  if(dayNum>=8&&dayNum<=20){
    h+='<details class="crisis-card"><summary style="font-size:.85rem;color:var(--cr);cursor:pointer;font-family:Playfair Display,serif">Я хочу бросить</summary>';
    h+='<div style="font-size:.84rem;color:var(--td);line-height:1.75;margin-top:12px;white-space:pre-line">'+esc(GC.crisis.text)+'</div>';
    h+='<div class="form-group" style="margin-top:12px"><label class="form-label">Одно предложение. Любое.</label><textarea class="form-textarea" id="d-crisis" rows="2"></textarea></div></details>';
  }

  // Two letters (week 3)
  if(weekNum===3&&(dayNum%7===1||dayNum===15)){
    h+='<div class="card" style="margin-bottom:14px"><div class="card-title">Два письма</div>';
    h+='<div class="form-group"><label class="form-label">Письмо от взрослой части — ребёнку</label><textarea class="form-textarea" id="d-letter-adult" rows="4" placeholder="Что взрослый(-ая) хочет сказать ребёнку внутри?"></textarea></div>';
    h+='<div class="form-group"><label class="form-label">Письмо от ребёнка — взрослому</label><textarea class="form-textarea" id="d-letter-child" rows="4" placeholder="Та часть, которая не хочет ставить цели, а хочет чтобы обняли и ничего не спрашивали"></textarea></div></div>';
  }

  // Empty page (day 28-29)
  if(dayNum===28||dayNum===29){
    h+='<div class="card" style="text-align:center;padding:40px 20px"><div style="font-family:Playfair Display,serif;font-size:1.1rem;color:var(--cr);margin-bottom:12px">Сегодня — пустая страница.</div><div style="font-size:.88rem;color:var(--tm);line-height:1.8">Ничего не надо. Не пишите. Не анализируйте.<br>Просто побудьте.<br><br>Это и есть опора.</div></div>';
  }

  h+='<div class="sec-title">День '+dayNum+'</div><div class="divider"></div>';
  h+='<div class="form-group"><input type="date" class="form-input" id="d-date" value="'+today+'"></div>';

  // MORNING
  h+='<div class="card"><div class="card-title">Утро</div><div class="card-dim" style="margin-bottom:12px">1-2 минуты. Назови состояние — и ты уже не на автопилоте.</div>';
  h+='<div class="form-group"><label class="form-label">Как я себя чувствую прямо сейчас? (одно слово)</label><input class="form-input" id="d-feel" placeholder="Устал(-а), тревожно, пусто, нормально..."></div>';
  h+='<div class="form-group"><label class="form-label">Что я сегодня могу сделать только для себя?</label><input class="form-input" id="d-forme" placeholder="Даже маленькое"></div>';
  h+='<div class="form-group"><label class="form-label">Один шаг к моей цели — честно, по силам</label><input class="form-input" id="d-step"></div>';
  h+='<div class="form-group"><label class="form-label">Что я решаю НЕ делать сегодня? (необязательно)</label><input class="form-input" id="d-notdo" placeholder=""></div>';
  h+='</div>';

  // EVENING
  h+='<div class="card"><div class="card-title">Вечер</div><div class="card-dim" style="margin-bottom:12px">Одним предложением. Не больше. Правда помещается в одно предложение.</div>';
  h+='<div class="form-group"><label class="form-label">Что сегодня было правда трудно — и я всё равно прожил(-а) этот день?</label><textarea class="form-textarea" id="d-hard" rows="2"></textarea></div>';
  h+='<div class="form-group"><label class="form-label">Где я сегодня выбрал(-а) себя?</label><textarea class="form-textarea" id="d-chose" rows="2"></textarea></div>';
  h+='<div class="form-group"><label class="form-label">За что я могу себя поблагодарить — не за результат, а за попытку?</label><textarea class="form-textarea" id="d-thanks" rows="2"></textarea></div>';
  // Question of the day
  h+='<div class="form-group" style="padding:12px;background:rgba(107,29,58,.04);border-radius:12px;border-left:2px solid var(--cr)"><label class="form-label" style="color:var(--cr)">Вопрос дня</label><div style="font-size:.84rem;color:var(--td);margin-bottom:8px">'+esc(question)+'</div><textarea class="form-textarea" id="d-qday" rows="2"></textarea></div>';
  // Body
  h+='<div class="card-dim" style="margin:12px 0 6px">Тело</div>';
  h+='<div class="form-group"><label class="form-label">Как моё тело чувствует себя прямо сейчас?</label><input class="form-input" id="d-body"></div>';
  h+='<div class="form-group"><label class="form-label">Было ли сегодня удовольствие — физическое, сенсорное, вкусовое?</label><input class="form-input" id="d-pleasure"></div>';
  h+='</div>';

  h+='<div class="btn-row" style="padding-bottom:80px"><button class="btn btn-primary" id="btn-save-day">Сохранить день</button></div>';
  $('day-content').innerHTML=h;

  // Load saved data
  if(db){
    var date=$('d-date').value;
    dbGet(db,'daily',date,function(val){
      if(!val)return;
      if($('d-feel'))$('d-feel').value=val.feel||'';
      if($('d-forme'))$('d-forme').value=val.forme||'';
      if($('d-step'))$('d-step').value=val.step||'';
      if($('d-notdo'))$('d-notdo').value=val.notdo||'';
      if($('d-hard'))$('d-hard').value=val.hard||'';
      if($('d-chose'))$('d-chose').value=val.chose||'';
      if($('d-thanks'))$('d-thanks').value=val.thanks||'';
      if($('d-qday'))$('d-qday').value=val.qday||'';
      if($('d-body'))$('d-body').value=val.body||'';
      if($('d-pleasure'))$('d-pleasure').value=val.pleasure||'';
    });
  }

  // Save
  $('btn-save-day').onclick=function(){
    if(!db)return;
    var date=$('d-date').value;
    var entry={date:date,dayNum:dayNum,feel:$('d-feel').value.trim(),forme:$('d-forme').value.trim(),step:$('d-step').value.trim(),notdo:($('d-notdo')||{}).value||'',hard:$('d-hard').value.trim(),chose:$('d-chose').value.trim(),thanks:$('d-thanks').value.trim(),qday:$('d-qday').value.trim(),question:question,body:($('d-body')||{}).value||'',pleasure:($('d-pleasure')||{}).value||''};
    // Optional fields
    if($('d-crisis'))entry.crisis=$('d-crisis').value.trim();
    if($('d-letter-adult'))entry.letterAdult=$('d-letter-adult').value.trim();
    if($('d-letter-child'))entry.letterChild=$('d-letter-child').value.trim();
    if($('d-letter30'))entry.letter30=$('d-letter30').value.trim();
    dbPut(db,'daily',date,entry,function(){alert('День сохранён!')});
  };

  $('d-date').onchange=function(){renderDay()};
};

// Review (every 5 days)
window.renderReview=function(){
  var db=window.OPORA_DB;
  var h='<div class="sec-title">Еженедельный обзор</div><div class="divider"></div>';
  h+='<div class="sec-sub">Перечитайте записи за неделю и ответьте честно.</div>';
  h+='<div class="form-group"><label class="form-label">Что мне мешало эти дни?</label><textarea class="form-textarea" id="rv-blocked" rows="3"></textarea></div>';
  h+='<div class="form-group"><label class="form-label">Что мне помогало?</label><textarea class="form-textarea" id="rv-helped" rows="3"></textarea></div>';
  h+='<div class="form-group"><label class="form-label">От чего я прятался(-ась) эти дни?</label><textarea class="form-textarea" id="rv-hiding" rows="2"></textarea></div>';
  h+='<div class="form-group"><label class="form-label">Что я чувствую, когда перечитываю свои записи?</label><textarea class="form-textarea" id="rv-feelings" rows="2"></textarea></div>';
  h+='<div class="form-group"><label class="form-label">Письмо от взрослой части — напутствие себе</label><textarea class="form-textarea" id="rv-letter" rows="4" placeholder="Что ты хочешь сказать себе на следующую неделю?"></textarea></div>';
  h+='<div class="form-group" style="padding:10px;background:rgba(107,29,58,.04);border-radius:12px"><label class="form-label" style="color:var(--cr)">Прикасался ли кто-то ко мне? Как это было?</label><textarea class="form-textarea" id="rv-touch" rows="2"></textarea></div>';
  h+='<div class="btn-row"><button class="btn btn-primary" id="btn-save-rv">Сохранить обзор</button></div>';

  // Dashboard
  h+='<div style="margin-top:24px"><div class="sec-title" style="font-size:1rem">Статистика</div><div class="divider"></div><div class="stat-grid" id="rv-stats"></div></div>';

  $('review-content').innerHTML=h;

  $('btn-save-rv').onclick=function(){
    if(!db)return;
    var rv={blocked:$('rv-blocked').value,helped:$('rv-helped').value,hiding:$('rv-hiding').value,feelings:$('rv-feelings').value,letter:$('rv-letter').value,touch:$('rv-touch').value,date:new Date().toISOString()};
    dbPut(db,'reviews','rv_'+Date.now(),rv,function(){alert('Обзор сохранён!')});
  };

  // Load stats
  if(db){
    dbGetAll(db,'daily',function(all){
      var total=all.length;var choseCount=0;var feels={};
      all.forEach(function(item){
        var v=item.val;
        if(v.chose&&v.chose.trim())choseCount++;
        if(v.feel){var f=v.feel.trim().toLowerCase();feels[f]=(feels[f]||0)+1}
      });
      var topFeel='—';var topN=0;
      Object.keys(feels).forEach(function(k){if(feels[k]>topN){topN=feels[k];topFeel=k}});
      $('rv-stats').innerHTML='<div class="stat-card"><div class="stat-num">'+total+'</div><div class="stat-label">Дней записано</div></div><div class="stat-card"><div class="stat-num">'+choseCount+'</div><div class="stat-label">Раз выбрал(-а) себя</div></div><div class="stat-card"><div class="stat-num" style="font-size:1.1rem">'+esc(topFeel)+'</div><div class="stat-label">Частое состояние</div></div><div class="stat-card"><div class="stat-num">'+Math.round(choseCount/(total||1)*100)+'%</div><div class="stat-label">Дни с выбором себя</div></div>';
    });
  }
};
})();
