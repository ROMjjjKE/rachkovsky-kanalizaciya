/* Прочистка канализации: меню, подбор ситуации, FAQ, форма */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var WA = 'https://wa.me/375291176736';

  /* меню */
  var burger = $('#burger'), drawer = $('#drawer'), close = $('#drawerClose');
  function openMenu() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    document.body.classList.add('no-scroll');
    burger.setAttribute('aria-expanded', 'true');
    var f = drawer.querySelector('a, button'); if (f) f.focus();
  }
  function closeMenu() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    burger.setAttribute('aria-expanded', 'false');
    burger.focus();
  }
  if (burger) burger.addEventListener('click', openMenu);
  if (close) close.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) closeMenu();
    if (e.key === 'Tab' && drawer && drawer.classList.contains('is-open')) {
      var items = $$('a, button', drawer).filter(function (el) { return el.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* подбор ситуации */
  var CASES = {
    sink: {
      t: 'Медленно уходит вода в раковине или ванне',
      tag: 'сифон и отвод',
      kv: [['Обычно нужно', '20–40 минут'], ['Чем работаем', 'трос, сантехнический кран'], ['Что подготовить', 'доступ к сифону']],
      list: ['Снимаем и промываем сифон, если он забит жиром', 'Проходим тросом отвод до стояка', 'Проверяем слив и напор воды на месте']
    },
    wc: {
      t: 'Не смывается унитаз',
      tag: 'унитаз',
      kv: [['Обычно нужно', '20–50 минут'], ['Чем работаем', 'трос 6–8 мм, электромеханическая машина'], ['Что подготовить', 'доступ к санузлу']],
      list: ['Определяем, засор в чаше или в лежаке', 'Прочищаем тросом без снятия унитаза, если возможно', 'Проверяем смыв три раза подряд']
    },
    stoyak: {
      t: 'Засорился стояк, вода стоит в квартире',
      tag: 'стояк',
      kv: [['Обычно нужно', '40–90 минут'], ['Чем работаем', 'электромеханическая машина'], ['Что подготовить', 'доступ к ревизии']],
      list: ['Открываем ревизию, оцениваем уровень засора', 'Проходим стояк машиной до общего выпуска', 'Промываем и проверяем, что вода уходит полностью']
    },
    dvor: {
      t: 'Дворовая или уличная канализация',
      tag: 'наружные сети',
      kv: [['Обычно нужно', '1–3 часа'], ['Чем работаем', 'машина с валом, гидродинамика'], ['Что подготовить', 'доступ к колодцу']],
      list: ['Открываем колодец, смотрим, где стоит вода', 'Прочищаем трубу от колодца к колодцу', 'При необходимости промываем участок под давлением']
    },
    video: {
      t: 'Нужно понять причину: трещины, корни, просадка',
      tag: 'видеодиагностика',
      kv: [['Обычно нужно', '40–60 минут'], ['Чем работаем', 'камера на гибком кабеле'], ['Что получите', 'видео и понятный вывод']],
      list: ['Заводим камеру в трубу и записываем проход', 'Показываем, где именно повреждение или нарост', 'Говорим, поможет прочистка или нужен ремонт участка']
    },
    smell: {
      t: 'Запах из слива, но вода уходит',
      tag: 'гидрозатвор и вентиляция',
      kv: [['Обычно нужно', '30–60 минут'], ['Чем работаем', 'трос, проверка сифона и вентиляции'], ['Что проверим', 'гидрозатвор, уклоны']],
      list: ['Проверяем, не пересох ли гидрозатвор и не забит ли сифон', 'Смотрим вентиляцию стояка', 'Промываем отвод и даём рекомендации, чтобы не вернулось']
    }
  };

  var selList = $('[data-sel]'), selOut = $('[data-sel-out]');
  if (selList && selOut) {
    var btns = $$('button', selList);
    function paint(key) {
      var c = CASES[key]; if (!c) return;
      btns.forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-k') === key); });
      selOut.innerHTML = '<div class="tagline">' + c.tag + '</div><h3>' + c.t + '</h3>' +
        '<div class="sel__kv">' + c.kv.map(function (p) { return '<div><span>' + p[0] + '</span><b>' + p[1] + '</b></div>'; }).join('') + '</div>' +
        '<ul>' + c.list.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
        '<a class="btn btn--w" href="' + WA + '?text=' + encodeURIComponent('Здравствуйте! ' + c.t + '. Подскажите, когда сможете приехать в Борисове?') + '" target="_blank" rel="noopener">Написать про эту ситуацию</a>';
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { paint(b.getAttribute('data-k')); }); });
    paint('sink');
  }

  /* FAQ */
  $$('.faq__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var open = q.getAttribute('aria-expanded') === 'true';
      var a = q.nextElementSibling;
      $$('.faq__q').forEach(function (o) {
        o.setAttribute('aria-expanded', 'false');
        o.nextElementSibling.style.maxHeight = '';
      });
      if (!open) { q.setAttribute('aria-expanded', 'true'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* форма */
  var form = $('form.form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form), name = (d.get('name') || '').toString().trim(), phone = (d.get('phone') || '').toString().trim();
      var msg = $('#formMsg');
      if (name.length < 2 || phone.length < 6) { msg.textContent = 'Нужны имя и телефон, иначе не перезвонить.'; return; }
      var lines = ['Заявка с сайта: ' + document.title, 'Имя: ' + name, 'Телефон: ' + phone];
      var m = (d.get('msg') || '').toString().trim(); if (m) lines.push('Что случилось: ' + m);
      msg.textContent = 'Открываю WhatsApp с готовым сообщением.';
      window.open(WA + '?text=' + encodeURIComponent(lines.join('\n')), '_blank');
    });
  }
})();
