
try{
// Nav scroll + active section indicator
var nav=document.getElementById('nav');
var navLinks=document.querySelectorAll('.nk a[href^="#"]');
var sections=[];
navLinks.forEach(function(link){
  var id=link.getAttribute('href').slice(1);
  var sec=document.getElementById(id);
  if(sec)sections.push({el:sec,link:link});
});

// Logo click -> scroll to top
var logoLink=document.querySelector('.nl');
if(logoLink){
  logoLink.addEventListener('click',function(e){
    e.preventDefault();
    window.scrollTo({top:0,behavior:'smooth'});
  });
}

var lastScrollY=0;
var ticking=false;

function onScroll(){
  lastScrollY=window.scrollY;
  if(!ticking){
    requestAnimationFrame(function(){
      // Nav background
      if(nav)nav.classList.toggle('sc',lastScrollY>50);

      // Active section indicator
      var scrollPos=lastScrollY+window.innerHeight*0.35;
      var activeFound=false;
      for(var i=sections.length-1;i>=0;i--){
        if(sections[i].el.offsetTop<=scrollPos){
          sections.forEach(function(s){s.link.classList.remove('nav-active')});
          sections[i].link.classList.add('nav-active');
          activeFound=true;
          break;
        }
      }
      if(!activeFound){
        sections.forEach(function(s){s.link.classList.remove('nav-active')});
      }

      // Parallax-lite on hero photo
      if(heroPhoto&&lastScrollY<window.innerHeight){
        heroPhoto.style.transform='translateY('+lastScrollY*0.15+'px)';
      }

      ticking=false;
    });
    ticking=true;
  }
}
window.addEventListener('scroll',onScroll,{passive:true});

// Hero parallax reference
var heroPhoto=document.querySelector('.hero-photo');
if(heroPhoto)heroPhoto.style.willChange='transform';

// Hamburger
var mtb=document.getElementById('mtb');
var mo=document.getElementById('mo');
if(mtb&&mo){
  mtb.onclick=function(){mo.classList.toggle('open')};
  var links=mo.getElementsByTagName('a');
  for(var i=0;i<links.length;i++){links[i].onclick=function(){mo.classList.remove('open')}}
}

// ========== Staggered Reveal with IntersectionObserver ==========
// Auto-assign .reveal-child to direct children of grids inside .reveal
document.querySelectorAll('.reveal').forEach(function(el){
  var gridChildren=el.querySelectorAll('.g2 > *, .g3 > *, .qtag-wrap > .qtag, .serial-grid > *, .artg > *, .libgrid > *');
  gridChildren.forEach(function(child){
    child.classList.add('reveal-child');
  });
});

var revealObserver=new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if(entry.isIntersecting){
      // Stagger children if they have .reveal-child class
      var children=entry.target.querySelectorAll('.reveal-child');
      if(children.length){
        children.forEach(function(child,i){
          setTimeout(function(){child.classList.add('v')},i*120);
        });
      }
      setTimeout(function(){entry.target.classList.add('v')},50);
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:0.15,rootMargin:'0px 0px -50px 0px'});

document.querySelectorAll('.reveal').forEach(function(el){
  revealObserver.observe(el);
});

// ========== Smooth details/summary animation ==========
document.querySelectorAll('details.ex').forEach(function(details){
  var summary=details.querySelector('summary');
  var content=details.querySelector('.eb');
  if(!summary||!content)return;

  // Prevent CSS animation from firing on [open] — we control it via JS
  content.style.animation='none';

  summary.addEventListener('click',function(e){
    e.preventDefault();
    if(details.open){
      // Closing
      var h=content.scrollHeight;
      content.style.transition='none';
      content.style.maxHeight=h+'px';
      content.style.opacity='1';
      content.style.overflow='hidden';
      // Force reflow
      content.offsetHeight;
      content.style.transition='max-height .3s cubic-bezier(.4,0,.2,1), opacity .25s ease';
      content.style.maxHeight='0';
      content.style.opacity='0';
      content.addEventListener('transitionend',function handler(ev){
        if(ev.propertyName!=='max-height')return;
        details.open=false;
        content.style.maxHeight='';
        content.style.opacity='';
        content.style.overflow='';
        content.style.transition='';
        content.removeEventListener('transitionend',handler);
      });
    }else{
      // Opening
      details.open=true;
      var h=content.scrollHeight;
      content.style.transition='none';
      content.style.maxHeight='0';
      content.style.opacity='0';
      content.style.overflow='hidden';
      // Force reflow
      content.offsetHeight;
      content.style.transition='max-height .4s cubic-bezier(.4,0,.2,1), opacity .35s ease';
      content.style.maxHeight=h+'px';
      content.style.opacity='1';
      content.addEventListener('transitionend',function handler(ev){
        if(ev.propertyName!=='max-height')return;
        content.style.maxHeight='none';
        content.style.overflow='';
        content.style.transition='';
        content.removeEventListener('transitionend',handler);
      });
    }
  });
});

// ========== Counter animation for numbers ==========
function animateCounter(el){
  var text=el.textContent.trim();
  var match=text.match(/^([\d\s]+)(\+?)(.*)$/);
  if(!match)return;
  var target=parseInt(match[1].replace(/\s/g,''),10);
  if(isNaN(target)||target<2)return;
  var suffix=(match[2]||'')+(match[3]||'');
  var duration=1400;
  var start=performance.now();

  function step(now){
    var elapsed=now-start;
    var progress=Math.min(elapsed/duration,1);
    // Ease out cubic
    var eased=1-Math.pow(1-progress,3);
    var current=Math.round(target*eased);
    el.textContent=current+suffix;
    if(progress<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

var counterObserver=new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if(entry.isIntersecting){
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
},{threshold:0.5});

// Support both [data-counter] attribute and .counter class
document.querySelectorAll('[data-counter], .counter').forEach(function(el){
  counterObserver.observe(el);
});

// Auto-detect price numbers in .pp elements and step numbers in .cn
document.querySelectorAll('.pp, .cn').forEach(function(el){
  var text=el.textContent.trim();
  if(/^\d/.test(text)){
    counterObserver.observe(el);
  }
});

// === INTERACTIVE: Что вас привело ===
var qtags=document.querySelectorAll('.qtag');
var qresult=document.getElementById('qtagResult');
if(qtags.length&&qresult){
  for(var q=0;q<qtags.length;q++){
    qtags[q].onclick=function(){
      for(var j=0;j<qtags.length;j++){qtags[j].classList.remove('active')}
      this.classList.add('active');
      var info=this.getAttribute('data-info');
      qresult.className='qtag-result show';
      qresult.innerHTML='<div class="qtag-result-inner">'+info+
        '<br><a href="https://t.me/sudas_psy" class="qtag-cta" target="_blank">Записаться на первую сессию</a></div>';
    }
  }
}

// === BOOK QUIZ ===
var bqSteps=document.getElementById('bqSteps');
var bqResult=document.getElementById('bqResult');
var bqProgress=document.getElementById('bqProgress');
var answers=[];
if(bqSteps){
  var allBtns=bqSteps.querySelectorAll('.bq-btn');
  for(var b=0;b<allBtns.length;b++){
    allBtns[b].onclick=function(){
      answers.push(this.getAttribute('data-value'));
      var currentStep=this.parentElement;
      var nextStep=currentStep.nextElementSibling;
      if(nextStep&&nextStep.classList.contains('bq-step')){
        currentStep.classList.remove('active');
        nextStep.classList.add('active');
        if(bqProgress){
          var dots=bqProgress.querySelectorAll('.bq-progress-dot');
          for(var d=0;d<dots.length;d++){
            if(d<=answers.length)dots[d].classList.add('active');
            else dots[d].classList.remove('active');
          }
        }
      }else{
        currentStep.classList.remove('active');
        showBookResult(answers);
      }
    }
  }
  function showBookResult(a){
    var books={
      'relations-why-scientific':{t:'Теория семейных систем',a:'Боуэн',d:'Семья — система. Ваши паттерны в отношениях — не выбор, а наследство родовой системы. Фундамент для работы с сепарацией.'},
      'relations-why-easy':{t:'Подходим друг другу',a:'Левин, Хеллер',d:'Три типа привязанности — надёжный, тревожный, избегающий — определяют всё: кого выбираете, как ведёте себя в ссорах.'},
      'relations-why-philosophical':{t:'Искусство любить',a:'Фромм',d:'Любовь — не то, что «случается». Это практика, которой нужно учиться. Объясняет, почему мы путаем любовь с зависимостью.'},
      'relations-practical-scientific':{t:'Секс, любовь и сердце',a:'Лоуэн',d:'Как мышечные зажимы блокируют способность любить. Связь между дыханием, грудной клеткой и способностью к близости.'},
      'relations-practical-easy':{t:'Как найти любовь, которую стоит сохранить',a:'Хендрикс',d:'Как детский опыт формирует «образ любви». Для тех, кто хочет встретить любовь — не по старому сценарию.'},
      'relations-practical-philosophical':{t:'Любовь и оргазм',a:'Лоуэн',d:'Связь между характерным панцирем и способностью к полной отдаче — в любви и в сексуальности.'},
      'relations-mirror-scientific':{t:'Привязанность',a:'Боулби',d:'Стиль привязанности формируется в первые месяцы жизни и определяет, как вы строите отношения, реагируете на разлуку и близость.'},
      'relations-mirror-easy':{t:'Материнская любовь',a:'Некрасов',d:'Обратная сторона материнской любви: гиперопека, слияние, невозможность отпустить.'},
      'relations-mirror-philosophical':{t:'Семьи и семейная терапия',a:'Минухин',d:'Семья — это структура с правилами. Когда границы между подсистемами размываются — система порождает симптомы.'},
      'self-why-scientific':{t:'Психоаналитическая диагностика',a:'Мак-Вильямс',d:'Типы личности как портреты. Шизоидная, нарциссическая, депрессивная, истерическая структуры — каждая глава как живой человек.'},
      'self-why-easy':{t:'Отсутствующий отец и его влияние на дочь',a:'Шварц',d:'Как отсутствующий отец формирует самооценку. Отец-жертва, отец-нарцисс, идеализированный — каждый оставляет след.'},
      'self-why-philosophical':{t:'Так говорил Заратустра',a:'Ницше',d:'Учит мощному, свободному слогу. После глубокой терапевтической работы жизнь ощущается иначе — и нужен язык, способный это вместить.'},
      'self-practical-scientific':{t:'Работа с телом в психотерапии',a:'Тимошенко, Леоненко',d:'Систематизация подходов к работе с телом. Границы тела и границы «я», телесные паттерны как отражение характерологических защит.'},
      'self-practical-easy':{t:'Сара',a:'Хикс',d:'История девочки, которая учится смотреть на мир глазами внутреннего ребёнка — того, кто ещё помнит радость и доверие.'},
      'self-practical-philosophical':{t:'Предательство тела',a:'Лоуэн',d:'Когда тело вместо удовольствия приносит стыд — человек перестаёт его чувствовать. Живёт «в голове». Но тело помнит всё.'},
      'self-mirror-scientific':{t:'Психика и её лечение',a:'Тэхке',d:'Три типа терапии для трёх типов личности. Учит видеть, с кем именно работаешь.'},
      'self-mirror-easy':{t:'Игры, в которые играют люди',a:'Берн',d:'Три эго-состояния: Родитель, Взрослый, Ребёнок. Бо́льшую часть общения мы проводим в «играх», которые не осознаём.'},
      'self-mirror-philosophical':{t:'Критика чистого разума',a:'Кант',d:'Нравственный закон — не ограничение, а внутренняя природа. Совесть — часть природы человека.'},
      'anxiety-why-scientific':{t:'Основные формы страха',a:'Риман',d:'Четыре базовых страха — четыре типа личности. Ключ к пониманию, почему один избегает близости, а другой не может быть один.'},
      'anxiety-why-easy':{t:'Антихрупкость',a:'Талеб',d:'Антихрупкость — свойство становиться сильнее от ударов. Психика тоже. Для тех, кто в непростом периоде.'},
      'anxiety-why-philosophical':{t:'Человек в поисках смысла',a:'Франкл',d:'Даже в нечеловеческих условиях человек сохраняет свободу выбора — как реагировать. Между стимулом и реакцией есть пространство свободы.'},
      'anxiety-practical-scientific':{t:'Стресс жизни',a:'Селье',d:'Стресс — не событие, а реакция организма. И у этой реакции есть предел. Тело сигнализирует задолго до срыва. Вопрос — слышим ли мы его.'},
      'anxiety-practical-easy':{t:'48 законов власти',a:'Грин',d:'48 законов с историческими примерами. Учит видеть скрытые мотивы — в том числе свои.'},
      'anxiety-practical-philosophical':{t:'Пробуждение тигра',a:'Левин',d:'Травма живёт не в воспоминаниях, а в нервной системе. Тело замирает, когда бегство и борьба невозможны — и остаётся замершим, пока травма не прожита.'},
      'anxiety-mirror-scientific':{t:'Расколотое «Я»',a:'Лэнг',d:'Где граница между нормальностью и безумием. Как «я» раскалывается под давлением невыносимой реальности.'},
      'anxiety-mirror-easy':{t:'Искусство обольщения',a:'Грин',d:'Девять архетипов обольстителя. Узнаете себя. Не про секс — про психологию влияния.'},
      'anxiety-mirror-philosophical':{t:'Тяжёлые личностные расстройства',a:'Кернберг',d:'Когда «хорошее» и «плохое» не соединяются в одном объекте. Терапия — путь к интеграции. Способность выдержать амбивалентность — способность выдержать реальность.'},
      'deep-why-scientific':{t:'Я и Оно',a:'Фрейд',d:'Структура психики: Оно, Я, Сверх-Я. Объяснил, почему человек делает то, чего сам не хочет.'},
      'deep-why-easy':{t:'Дар психотерапии',a:'Ялом',d:'Ялом делится опытом за 45 лет практики. Как быть с клиентом, когда не знаешь что делать. Честная, живая книга.'},
      'deep-why-philosophical':{t:'Межличностный мир ребёнка',a:'Стерн',d:'Как мать и младенец настраиваются друг на друга. Если настройки не было — ребёнок не учится понимать, что чувствует.'},
      'deep-practical-scientific':{t:'Высшие корковые функции',a:'Лурия',d:'Как зоны коры отвечают за речь, восприятие, память, мышление. Фундамент нейропсихологии.'},
      'deep-practical-easy':{t:'Подходим друг другу',a:'Левин, Хеллер',d:'Три типа привязанности определяют всё: кого выбираете, как ведёте себя в ссорах. Стиль можно изменить.'},
      'deep-practical-philosophical':{t:'Современный трансактный анализ',a:'Стюарт, Джоинс',d:'Эго-состояния, жизненные сценарии, игры, рэкетные чувства. Полное руководство по ТА для тех, кто хочет понять глубинные паттерны.'},
      'deep-mirror-scientific':{t:'Теория семейных систем',a:'Боуэн',d:'Слияние и дифференциация, эмоциональные треугольники, межпоколенческая передача травмы.'},
      'deep-mirror-easy':{t:'Сара',a:'Хикс',d:'Возвращает контакт с внутренним ребёнком. Написана как сказка.'},
      'deep-mirror-philosophical':{t:'Искусство любить',a:'Фромм',d:'Любовь — не чувство, а практика, которой нужно учиться.'}
    };
    var key=a[0]+'-'+a[1]+'-'+a[2];
    var book=books[key]||books['deep-why-scientific'];
    if(bqProgress)bqProgress.style.display='none';
    bqResult.className='bq-result show';
    bqResult.innerHTML='<div class="bq-result-book">'+
      '<div class="bq-result-label">Ваша книга</div>'+
      '<div class="bq-result-title">'+book.t+'</div>'+
      '<div class="bq-result-author">'+book.a+'</div>'+
      '<div class="bq-result-desc">'+book.d+'</div>'+
      '</div>'+
      '<button class="bq-restart" onclick="resetQuiz()">Попробовать ещё раз</button>';
  }
}
window.resetQuiz=function(){
  if(!bqSteps||!bqResult||!bqProgress)return;
  answers.length=0;
  bqResult.className='bq-result';
  bqResult.innerHTML='';
  bqProgress.style.display='';
  var dots=bqProgress.querySelectorAll('.bq-progress-dot');
  for(var d=0;d<dots.length;d++){
    if(d===0)dots[d].classList.add('active');
    else dots[d].classList.remove('active');
  }
  var steps=bqSteps.querySelectorAll('.bq-step');
  for(var s=0;s<steps.length;s++){steps[s].classList.remove('active')}
  if(steps[0])steps[0].classList.add('active');
};

// === SERIAL READING PROGRESS ===
document.querySelectorAll('.episode .eb, details.ex > .eb').forEach(function(eb) {
  var parent = eb.closest('details');
  if (!parent) return;
  var summary = parent.querySelector('summary');
  if (!summary) return;
  // Only for serial episodes (long content)
  if (eb.children.length < 5) return;

  var bar = document.createElement('div');
  bar.className = 'serial-progress';
  bar.innerHTML = '<div class="serial-progress-bar"></div>';
  eb.insertBefore(bar, eb.firstChild);
  var progressBar = bar.querySelector('.serial-progress-bar');

  window.addEventListener('scroll', function() {
    if (!parent.open) return;
    requestAnimationFrame(function() {
      var rect = eb.getBoundingClientRect();
      var total = eb.scrollHeight;
      var visible = window.innerHeight;
      var scrolled = -rect.top + 68;
      var pct = Math.max(0, Math.min(100, (scrolled / (total - visible)) * 100));
      progressBar.style.width = pct + '%';
    });
  }, { passive: true });
});

// === PRODUCT COMPARISON TABLE ===
var productsSection = document.getElementById('products');
if (productsSection) {
  var g3 = productsSection.querySelector('.g3');
  if (g3) {
    var toggleBtn = document.createElement('button');
    toggleBtn.className = 'compare-toggle';
    toggleBtn.textContent = 'Сравнить форматы';
    g3.parentNode.insertBefore(toggleBtn, g3.nextSibling);

    var tableWrap = document.createElement('div');
    tableWrap.style.display = 'none';
    tableWrap.style.overflow = 'auto';
    tableWrap.innerHTML =
      '<table class="compare-table">' +
      '<tr><th></th><th>Вход</th><th class="highlight-col">Экспресс</th><th>Маршрут</th></tr>' +
      '<tr><td>Сессии</td><td>1</td><td class="highlight-col">2</td><td>20</td></tr>' +
      '<tr><td>Длительность</td><td>1,5 часа</td><td class="highlight-col">3 часа</td><td>5 месяцев</td></tr>' +
      '<tr><td>Диагностика</td><td><span class="check">&#10003;</span></td><td class="highlight-col"><span class="check">&#10003;</span></td><td><span class="check">&#10003;</span></td></tr>' +
      '<tr><td>Письменный отчёт</td><td>&mdash;</td><td class="highlight-col"><span class="check">&#10003;</span></td><td><span class="check">&#10003;</span></td></tr>' +
      '<tr><td>Рекомендации</td><td>Устно</td><td class="highlight-col">Письменно</td><td>Письменно</td></tr>' +
      '<tr><td>Сопровождение</td><td>&mdash;</td><td class="highlight-col">&mdash;</td><td><span class="check">&#10003;</span></td></tr>' +
      '</table>';
    g3.parentNode.insertBefore(tableWrap, toggleBtn.nextSibling);

    toggleBtn.addEventListener('click', function() {
      if (tableWrap.style.display === 'none') {
        tableWrap.style.display = 'block';
        toggleBtn.textContent = 'Скрыть сравнение';
      } else {
        tableWrap.style.display = 'none';
        toggleBtn.textContent = 'Сравнить форматы';
      }
    });
  }
}

// === SERIAL NAVIGATION (prev/next) ===
document.querySelectorAll('.episode').forEach(function(ep, idx, all) {
  var eb = ep.querySelector('.eb');
  if (!eb) return;
  var nav = document.createElement('div');
  nav.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-top:32px;padding-top:16px;border-top:1px solid rgba(107,29,58,.08)';
  var prevHtml = idx > 0 ? '<button class="compare-toggle" data-dir="prev" style="padding:8px 20px">&larr; Предыдущая</button>' : '<span></span>';
  var nextHtml = idx < all.length - 1 ? '<button class="compare-toggle" data-dir="next" style="padding:8px 20px;background:var(--cr);color:var(--cream);border-color:var(--cr)">Следующая &rarr;</button>' : '<span></span>';
  nav.innerHTML = '<div>' + prevHtml + '</div><div>' + nextHtml + '</div>';
  eb.appendChild(nav);
  nav.querySelectorAll('button').forEach(function(b) {
    b.addEventListener('click', function() {
      var dir = this.getAttribute('data-dir');
      var target = dir === 'next' ? all[idx + 1] : all[idx - 1];
      ep.open = false;
      setTimeout(function() {
        target.open = true;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    });
  });
});

// === TRIG CLICK → TOGGLE .tn ===
document.querySelectorAll('.trig').forEach(function(trig) {
  trig.addEventListener('click', function() {
    var p = this.closest('.sap') || this.closest('p');
    if (!p) return;
    var tn = p.nextElementSibling;
    if (!tn || !tn.classList.contains('tn')) return;
    if (tn.style.display === 'none' || !tn.style.display) {
      tn.style.display = 'block';
      tn.style.animation = 'tnReveal .4s ease both';
    } else {
      tn.style.display = 'none';
    }
  });
});

}catch(e){
var f=document.querySelectorAll('.reveal');
for(var fi=0;fi<f.length;fi++){f[fi].classList.add('v')}
}
