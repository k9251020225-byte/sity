
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
        if(bqProgress)bqProgress.textContent='Шаг '+answers.length+' из 3';
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
      'relations-mirror-scientific':{t:'Отсутствующий отец и его влияние на дочь',a:'Шварц',d:'Как отсутствующий отец формирует самооценку дочери и выбор партнёров.'},
      'relations-mirror-easy':{t:'Материнская любовь',a:'Некрасов',d:'Обратная сторона материнской любви: гиперопека, слияние, невозможность отпустить.'},
      'relations-mirror-philosophical':{t:'Искусство любить',a:'Фромм',d:'Любовь — не чувство, а практика. Объясняет, почему мы путаем любовь с зависимостью.'},
      'self-why-scientific':{t:'Психоаналитическая диагностика',a:'Мак-Вильямс',d:'Типы личности как портреты. Шизоидная, нарциссическая, депрессивная, истерическая структуры — каждая глава как живой человек.'},
      'self-why-easy':{t:'Отсутствующий отец и его влияние на дочь',a:'Шварц',d:'Как отсутствующий отец формирует самооценку. Отец-жертва, отец-нарцисс, идеализированный — каждый оставляет след.'},
      'self-why-philosophical':{t:'Так говорил Заратустра',a:'Ницше',d:'Учит мощному, свободному слогу. После глубокой терапевтической работы жизнь ощущается иначе — и нужен язык, способный это вместить.'},
      'self-practical-scientific':{t:'Предательство тела',a:'Лоуэн',d:'Когда тело вместо удовольствия приносит стыд — человек перестаёт его чувствовать. Живёт «в голове». Но тело помнит всё.'},
      'self-practical-easy':{t:'Сара',a:'Хикс',d:'История девочки, которая учится смотреть на мир глазами внутреннего ребёнка — того, кто ещё помнит радость и доверие.'},
      'self-practical-philosophical':{t:'Предательство тела',a:'Лоуэн',d:'Основатель биоэнергетического анализа о связи тела, эмоций и самоощущения.'},
      'self-mirror-scientific':{t:'Психика и её лечение',a:'Тэхке',d:'Три типа терапии для трёх типов личности. Учит видеть, с кем именно работаешь.'},
      'self-mirror-easy':{t:'Материнская любовь',a:'Некрасов',d:'Когда любовь матери душит — а не растит. Для тех, кто чувствует вину за попытку жить свою жизнь.'},
      'self-mirror-philosophical':{t:'Критика чистого разума',a:'Кант',d:'Нравственный закон — не ограничение, а внутренняя природа. Совесть — часть природы человека.'},
      'anxiety-why-scientific':{t:'Основные формы страха',a:'Риман',d:'Четыре базовых страха — четыре типа личности. Ключ к пониманию, почему один избегает близости, а другой не может быть один.'},
      'anxiety-why-easy':{t:'Антихрупкость',a:'Талеб',d:'Антихрупкость — свойство становиться сильнее от ударов. Психика тоже. Для тех, кто в непростом периоде.'},
      'anxiety-why-philosophical':{t:'Критика чистого разума',a:'Кант',d:'Человек — существо социальное, и совесть — не навязанное извне, а часть природы.'},
      'anxiety-practical-scientific':{t:'Высшие корковые функции',a:'Лурия',d:'Как зоны коры отвечают за речь, восприятие, память, мышление. Фундамент нейропсихологии.'},
      'anxiety-practical-easy':{t:'48 законов власти',a:'Грин',d:'48 законов с историческими примерами. Учит видеть скрытые мотивы — в том числе свои.'},
      'anxiety-practical-philosophical':{t:'Антихрупкость',a:'Талеб',d:'Что вас не убивает — делает сильнее. Это не метафора. Кости крепнут под нагрузкой, иммунитет тренируется. Психика тоже.'},
      'anxiety-mirror-scientific':{t:'Расколотое «Я»',a:'Лэнг',d:'Где граница между нормальностью и безумием. Как «я» раскалывается под давлением невыносимой реальности.'},
      'anxiety-mirror-easy':{t:'Искусство обольщения',a:'Грин',d:'Девять архетипов обольстителя. Узнаете себя. Не про секс — про психологию влияния.'},
      'anxiety-mirror-philosophical':{t:'Расколотое «Я»',a:'Лэнг',d:'Онтологическая неуверенность, ложное «я» — это знакомо не только психотикам.'},
      'deep-why-scientific':{t:'Я и Оно',a:'Фрейд',d:'Структура психики: Оно, Я, Сверх-Я. Объяснил, почему человек делает то, чего сам не хочет.'},
      'deep-why-easy':{t:'Подходим друг другу',a:'Левин, Хеллер',d:'Три типа привязанности определяют всё: кого выбираете, как ведёте себя в ссорах. Стиль можно изменить.'},
      'deep-why-philosophical':{t:'Так говорил Заратустра',a:'Ницше',d:'Не трактат — а поэма. Учит мощному, свободному слогу и мышлению образами.'},
      'deep-practical-scientific':{t:'Теория семейных систем',a:'Боуэн',d:'Слияние и дифференциация, эмоциональные треугольники, межпоколенческая передача травмы.'},
      'deep-practical-easy':{t:'Сара',a:'Хикс',d:'Возвращает контакт с внутренним ребёнком. Написана как сказка.'},
      'deep-practical-philosophical':{t:'Искусство любить',a:'Фромм',d:'Любовь — не чувство, а практика, которой нужно учиться.'},
      'deep-mirror-scientific':{t:'Психоаналитическая диагностика',a:'Мак-Вильямс',d:'Типы личности как портреты. Читаешь — узнаёшь себя.'},
      'deep-mirror-easy':{t:'48 законов власти',a:'Грин',d:'Честная книга о том, как устроена власть. Учит видеть скрытые мотивы.'},
      'deep-mirror-philosophical':{t:'Критика чистого разума',a:'Кант',d:'Читать трудно. Но Кант доказал: совесть — не навязанное извне, а часть природы.'}
    };
    var key=a[0]+'-'+a[1]+'-'+a[2];
    var book=books[key]||books['deep-why-scientific'];
    if(bqProgress)bqProgress.textContent='';
    bqResult.className='bq-result show';
    bqResult.innerHTML='<div class="bq-result-book">'+
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
  bqProgress.textContent='';
  var steps=bqSteps.querySelectorAll('.bq-step');
  for(var s=0;s<steps.length;s++){steps[s].classList.remove('active')}
  if(steps[0])steps[0].classList.add('active');
};

}catch(e){
var f=document.querySelectorAll('.reveal');
for(var fi=0;fi<f.length;fi++){f[fi].classList.add('v')}
}
