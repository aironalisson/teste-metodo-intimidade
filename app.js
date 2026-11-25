/* Teste grátis "Qual é a sua ferida no amor?" — Método Intimidade
   O resultado é calculado no servidor do Wix; aqui só ficam as telas. */
(function () {
  'use strict';

  var API = 'https://www.metodointimidade.com.br/_functions/';
  var PIXEL = '901077246011978';
  var T = window.TESTE;
  var app = document.getElementById('app');

  // ---------- sessão, UTMs e cookies da Meta ----------
  function novoId() {
    var a = new Uint8Array(12);
    (window.crypto || window.msCrypto).getRandomValues(a);
    return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  function lerSessao(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function gravarSessao(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignora */ } }

  var sessao = lerSessao('teste_sessao') || novoId();
  gravarSessao('teste_sessao', sessao);

  var origem = {};
  try { origem = JSON.parse(lerSessao('teste_origem') || '{}'); } catch (e) { origem = {}; }
  var q = new URLSearchParams(location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'].forEach(function (k) {
    if (q.get(k)) origem[k] = q.get(k).slice(0, 300);
  });
  gravarSessao('teste_origem', JSON.stringify(origem));

  function cookie(nome) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + nome + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }

  // ---------- Pixel da Meta (carrega depois da 1ª tela) ----------
  function carregarPixel() {
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', PIXEL);
    window.fbq('track', 'PageView');
  }

  // ---------- funil (painel): onde ela para ----------
  function marcar(etapa) {
    var corpo = JSON.stringify({
      sessao: sessao, etapa: etapa, trilha: estado.trilha || '',
      utm_source: origem.utm_source || '', utm_campaign: origem.utm_campaign || '',
      utm_content: origem.utm_content || '', fbclid: origem.fbclid || ''
    });
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(API + 'funilb', new Blob([corpo], { type: 'text/plain' }))) return;
    } catch (e) { /* tenta pelo fetch */ }
    try { fetch(API + 'funilb', { method: 'POST', body: corpo, headers: { 'Content-Type': 'text/plain' }, keepalive: true, mode: 'cors' }); } catch (e) { /* estatística: ignora */ }
  }

  // ---------- estado ----------
  var estado = { tela: 'capa', trilha: '', entrada: '', respostas: [], ordem: {} };

  function embaralhar(lista) {
    var a = lista.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function perguntasDaTrilha() { return T.trilhas[estado.trilha] || []; }

  // ---------- desenho ----------
  var CHECK = '<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l4 4 8-8.5" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var MARCA = '<div class="marca"><svg width="34" height="22" viewBox="0 0 46 28" aria-hidden="true"><circle cx="16" cy="14" r="11.5" fill="none" stroke="#C9A84C" stroke-width="2.5"/><circle cx="30" cy="14" r="11.5" fill="none" stroke="#C9A84C" stroke-width="2.5"/></svg><span>MÉTODO INTIMIDADE</span></div>';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function topo(numero, voltar) {
    var pct = Math.round((numero / 8) * 100);
    return '<div class="topo"><div class="topo-linha">' +
      (voltar ? '<button type="button" class="voltar" data-voltar>‹ Voltar</button>' : '<span></span>') +
      '<span class="contador">' + numero + ' de 8</span></div>' +
      '<div class="barra" aria-hidden="true"><i style="width:' + pct + '%"></i></div></div>';
  }

  function imagem(r) {
    return '<img class="foto" src="img/' + esc(r.id) + '.webp" alt="" width="180" height="150" loading="eager" decoding="async" data-cena="' + esc(r.cena || '') + '">';
  }

  function capa() {
    app.innerHTML = '<section class="tela capa">' + MARCA +
      '<img class="capa-img" src="img/capa.webp" alt="Mulher sentada no chão do quarto, encostada na cama, pensativa" width="350" height="300" fetchpriority="high">' +
      '<div style="display:flex;flex-direction:column;gap:10px"><span class="selo">TESTE GRATUITO · 2 MINUTOS</span>' +
      '<h1>Qual é a sua ferida no amor?</h1>' +
      '<p class="sub">8 perguntas rápidas. É só tocar na resposta. No final, você vê o retrato da sua vida amorosa hoje.</p></div>' +
      '<button type="button" class="botao" data-comecar>Começar o teste</button>' +
      '<p class="rodape">Por Airon Pereira, autor de Como faço você me amar?<br><a href="https://www.metodointimidade.com.br/pol%C3%ADtica-de-privacidade" target="_blank" rel="noopener">Política de privacidade</a></p></section>';
    preCarregar(T.entrada.respostas);
  }

  // passo 1 = entrada; passos 2..8 = perguntas 1..7 da trilha
  function pergunta(passo) {
    var p, respostas, ehEntrada = passo === 1;
    if (ehEntrada) { p = T.entrada; respostas = p.respostas; }
    else {
      p = perguntasDaTrilha()[passo - 2];
      if (!estado.ordem[p.id]) estado.ordem[p.id] = embaralhar(p.respostas);
      respostas = estado.ordem[p.id];
    }
    var escolhida = ehEntrada ? estado.entrada : estado.respostas[passo - 2];
    var ehFrase = respostas[0] && respostas[0].frase;
    var h = '<section class="tela pergunta">' + topo(passo, true) +
      '<div style="display:flex;flex-direction:column;gap:8px;margin-top:4px"><h1>' + esc(p.pergunta) + '</h1>' +
      (p.subtitulo ? '<p class="sub" style="font-size:16px">' + esc(p.subtitulo) + '</p>' : '') + '</div>';
    if (ehFrase) {
      h += '<div class="frases">' + respostas.map(function (r) {
        return '<button type="button" class="frase' + (escolhida === r.id ? ' marcada' : '') + '" data-resp="' + esc(r.id) + '">“' + esc(r.texto) + '”<span class="check">' + CHECK + '</span></button>';
      }).join('') + '</div>';
    } else {
      h += '<div class="grade">' + respostas.map(function (r) {
        return '<button type="button" class="opcao' + (escolhida === r.id ? ' marcada' : '') + '" data-resp="' + esc(r.id) + '">' + imagem(r) +
          '<span class="txt">' + esc(r.texto) + '</span><span class="check">' + CHECK + '</span></button>';
      }).join('') + '</div>';
    }
    h += '<div class="cresce"></div><p class="rodape" style="font-size:15px">Suas respostas ficam só entre nós.</p></section>';
    app.innerHTML = h;
    ligarFotos();
    // já baixa as imagens da próxima pergunta
    var prox = ehEntrada ? null : perguntasDaTrilha()[passo - 1];
    if (prox) preCarregar(prox.respostas);
    window.scrollTo(0, 0);
  }

  function ligarFotos() {
    Array.prototype.forEach.call(app.querySelectorAll('img.foto'), function (img) {
      img.addEventListener('error', function () {
        var d = document.createElement('span');
        d.className = 'cena';
        d.textContent = img.getAttribute('data-cena') || '';
        img.replaceWith(d);
      }, { once: true });
    });
  }
  function preCarregar(lista) {
    (lista || []).forEach(function (r) { if (!r.frase) { var i = new Image(); i.decoding = 'async'; i.src = 'img/' + r.id + '.webp'; } });
  }

  var LINHAS = ['Juntando o que você contou', 'Encontrando o seu resultado', 'Montando o retrato da sua vida amorosa'];
  function analisando() {
    app.innerHTML = '<section class="tela analise">' + MARCA + '<div class="cresce"></div>' +
      '<div class="anel"><svg width="150" height="150" viewBox="0 0 150 150" aria-hidden="true"><circle cx="75" cy="75" r="66" fill="none" stroke="#EFE9DF" stroke-width="8"/><circle id="arco" cx="75" cy="75" r="66" fill="none" stroke="#C9A84C" stroke-width="8" stroke-linecap="round" stroke-dasharray="0 415" transform="rotate(-90 75 75)"/></svg><span id="pct">0%</span></div>' +
      '<div style="display:flex;flex-direction:column;gap:8px;text-align:center"><h1 style="font-size:32px">Analisando as suas respostas</h1><p class="sub" style="font-size:16px">Leva só alguns segundos.</p></div>' +
      '<div class="passos">' + LINHAS.map(function (l, i) { return '<div data-l="' + i + '">' + icone(false) + '<span>' + esc(l) + '</span></div>'; }).join('') + '</div>' +
      '<div class="cresce"></div></section>';
    var t0 = Date.now(), dur = 3200;
    (function quadro() {
      var x = Math.min(1, (Date.now() - t0) / dur);
      var pct = Math.round(x * 100);
      document.getElementById('pct').textContent = pct + '%';
      document.getElementById('arco').setAttribute('stroke-dasharray', (415 * x).toFixed(0) + ' 415');
      LINHAS.forEach(function (l, i) {
        var el = app.querySelector('[data-l="' + i + '"]');
        if (el && x >= (i + 1) / 3 && !el.classList.contains('feito')) { el.classList.add('feito'); el.firstChild.outerHTML = icone(true); }
      });
      if (x < 1) requestAnimationFrame(quadro); else setTimeout(formulario, 350);
    })();
  }
  function icone(feito) {
    return feito
      ? '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="#C9A84C"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="none" stroke="#E8E1D6" stroke-width="3"/></svg>';
  }

  function formulario() {
    estado.tela = 'formulario';
    app.innerHTML = '<section class="tela"><div class="topo"><div class="topo-linha"><span>Pergunta 8 de 8</span><span class="contador">Pronto</span></div><div class="barra" aria-hidden="true"><i style="width:100%"></i></div></div>' +
      '<div style="display:flex;flex-direction:column;gap:8px;margin-top:4px"><svg width="34" height="34" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="#C9A84C"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<h1 style="font-size:32px;line-height:1.05">O seu resultado está pronto.</h1><p class="sub">Você vê o seu resultado na próxima tela.</p></div>' +
      '<form id="form" novalidate style="display:flex;flex-direction:column;gap:14px">' +
      '<label class="campo" id="c-nome"><span>Seu primeiro nome</span><span class="entrada"><input id="nome" name="nome" autocomplete="given-name" placeholder="Ex.: Ana" maxlength="40" required></span><span class="msg-erro">Digite o seu primeiro nome.</span></label>' +
      '<label class="campo" id="c-zap"><span>Seu WhatsApp com DDD</span><span class="entrada"><span class="ddi">+55</span><input id="zap" name="whatsapp" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="(11) 90000-0000" maxlength="16" required></span><span class="msg-erro">Confira o DDD e o número do WhatsApp.</span></label>' +
      '<label class="aceite"><input type="checkbox" id="aceite"><span>Quero receber o convite da aula gratuita de segunda pelo WhatsApp.</span></label>' +
      '<div class="cresce"></div>' +
      '<p class="aviso" id="aviso"></p>' +
      '<button type="submit" class="botao" id="enviar">Ver o meu resultado</button>' +
      '<p class="rodape" style="font-size:15px">Você pode sair da lista quando quiser.</p></form></section>';
    var zap = document.getElementById('zap');
    zap.addEventListener('input', function () {
      var d = zap.value.replace(/\D/g, '').slice(0, 11);
      zap.value = d.length > 6 ? '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4)
        : d.length > 2 ? '(' + d.slice(0, 2) + ') ' + d.slice(2) : d;
      document.getElementById('c-zap').classList.remove('erro');
    });
    document.getElementById('nome').addEventListener('input', function () { document.getElementById('c-nome').classList.remove('erro'); });
    document.getElementById('form').addEventListener('submit', enviar);
    window.scrollTo(0, 0);
  }

  // DDDs válidos no Brasil
  var DDD = /^(1[1-9]|2[12478]|3[1-578]|4[1-9]|5[1345]|6[1-9]|7[1345799]|8[1-9]|9[1-9])$/;
  function zapValido(d) { return d.length === 11 && DDD.test(d.slice(0, 2)) && d[2] === '9' || d.length === 10 && DDD.test(d.slice(0, 2)); }

  function enviar(ev) {
    ev.preventDefault();
    var nome = document.getElementById('nome').value.trim().split(/\s+/)[0] || '';
    var digitos = document.getElementById('zap').value.replace(/\D/g, '');
    var ok = true;
    if (nome.length < 2) { document.getElementById('c-nome').classList.add('erro'); ok = false; }
    if (!zapValido(digitos)) { document.getElementById('c-zap').classList.add('erro'); ok = false; }
    if (!ok) return;
    var botao = document.getElementById('enviar');
    var aviso = document.getElementById('aviso');
    botao.disabled = true; botao.textContent = 'Abrindo o seu resultado...'; aviso.classList.remove('on');

    var dados = {
      evento: 'teste_gratuito_concluido', sessao: sessao, data_hora: new Date().toISOString(),
      nome: nome, whatsapp: '+55' + digitos, aceitou_whatsapp: document.getElementById('aceite').checked,
      trilha: estado.trilha, resposta_entrada: estado.entrada, respostas: estado.respostas.slice(),
      utm_source: origem.utm_source || '', utm_medium: origem.utm_medium || '', utm_campaign: origem.utm_campaign || '',
      utm_content: origem.utm_content || '', utm_term: origem.utm_term || '', fbclid: origem.fbclid || '',
      fbp: cookie('_fbp'), fbc: cookie('_fbc')
    };
    try { localStorage.setItem('teste_pendente', JSON.stringify(dados)); } catch (e) { /* ignora */ }
    if (window.fbq) window.fbq('track', 'CompleteRegistration', { content_category: 'teste_gratis' }, { eventID: sessao + '-CompleteRegistration' });

    var tentativa = 0;
    (function tentar() {
      tentativa++;
      fetch(API + 'teste', { method: 'POST', body: JSON.stringify(dados), headers: { 'Content-Type': 'text/plain' }, mode: 'cors' })
        .then(function (r) { return r.json().then(function (j) { return { status: r.status, j: j }; }); })
        .then(function (res) {
          if (res.j && res.j.ok && res.j.url) {
            try { localStorage.removeItem('teste_pendente'); } catch (e) { /* ignora */ }
            // abre o resultado aqui mesmo (mais rápido), com os dados que o servidor confirmou
            var u = new URL(res.j.url);
            location.href = '/resultado/' + u.search;
          } else if (res.status === 400) {
            botao.disabled = false; botao.textContent = 'Ver o meu resultado';
            aviso.textContent = (res.j && res.j.erro) || 'Confira os seus dados.'; aviso.classList.add('on');
          } else { throw new Error('servidor'); }
        })
        .catch(function () {
          if (tentativa < 3) return setTimeout(tentar, 800 * tentativa);
          botao.disabled = false; botao.textContent = 'Tentar de novo';
          aviso.textContent = 'Não conseguimos abrir o seu resultado agora. Confira a sua internet e toque de novo.';
          aviso.classList.add('on');
        });
    })();
  }

  // ---------- navegação ----------
  function ir(passo) {
    estado.passo = passo;
    if (passo === 0) { estado.tela = 'capa'; capa(); }
    else if (passo <= 8) { estado.tela = 'pergunta'; pergunta(passo); }
    else analisando();
    try { history.replaceState({ passo: passo }, ''); } catch (e) { /* ignora */ }
  }

  app.addEventListener('click', function (ev) {
    var alvo = ev.target.closest('[data-comecar],[data-voltar],[data-resp]');
    if (!alvo) return;
    if (alvo.hasAttribute('data-comecar')) { ir(1); return; }
    if (alvo.hasAttribute('data-voltar')) {
      var p = estado.passo;
      if (p === 1) { estado.entrada = ''; ir(0); }
      else { estado.respostas.length = Math.max(0, p - 3); ir(p - 1); }
      return;
    }
    var id = alvo.getAttribute('data-resp');
    var passo = estado.passo;
    Array.prototype.forEach.call(app.querySelectorAll('[data-resp]'), function (b) { b.classList.toggle('marcada', b === alvo); });
    if (passo === 1) {
      var r = T.entrada.respostas.filter(function (x) { return x.id === id; })[0];
      if (estado.trilha && estado.trilha !== r.trilha) { estado.respostas = []; estado.ordem = {}; }
      estado.entrada = id; estado.trilha = r.trilha;
    } else {
      estado.respostas[passo - 2] = id;
      estado.respostas.length = passo - 1;
    }
    marcar(passo);
    setTimeout(function () { ir(passo + 1); }, 220);
  });

  // ---------- início ----------
  ir(0);
  marcar(0);
  if ('requestIdleCallback' in window) requestIdleCallback(carregarPixel, { timeout: 1500 }); else setTimeout(carregarPixel, 600);
})();
