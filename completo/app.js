/* Teste completo (versão 2). Sem pixel da Meta: nada daqui vai para a Meta. */
(function () {
  'use strict';
  var C = window.CONFIG, T = window.COMPLETO, CALC = window.CALCULO;
  var app = document.getElementById('app');
  var a = (new URLSearchParams(location.search).get('a') || '').replace(/[^a-f0-9]/gi, '');
  var CHAVE = 'completo-' + a;
  var estado = { nome: '', respostas: new Array(20).fill(null), final: '', ordemFinal: null, links: null, resultado: null };

  var MARCA = '<div class="marca"><svg width="30" height="19" viewBox="0 0 46 28" aria-hidden="true"><circle cx="16" cy="14" r="11.5" fill="none" stroke="#C9A84C" stroke-width="2.5"/><circle cx="30" cy="14" r="11.5" fill="none" stroke="#C9A84C" stroke-width="2.5"/></svg><span>MÉTODO INTIMIDADE</span></div>';
  var ANEIS = '<svg width="24" height="15" viewBox="0 0 46 28" aria-hidden="true"><circle cx="16" cy="14" r="11.5" fill="none" stroke="#C9A84C" stroke-width="2.5"/><circle cx="30" cy="14" r="11.5" fill="none" stroke="#C9A84C" stroke-width="2.5"/></svg>';
  var ICONES = [
    '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/>'
  ];
  function icone(d, tam) { return '<svg width="' + (tam || 22) + '" height="' + (tam || 22) + '" viewBox="0 0 24 24" fill="none" stroke="#8A6514" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pts(n) { var h = ''; for (var i = 0; i < 3; i++) h += '<i' + (i < n ? ' class="c"' : '') + '></i>'; return '<span class="pts" aria-hidden="true">' + h + '</span>'; }
  function comNome(txt, semNome) { return estado.nome ? txt.replace('{Nome}', estado.nome) : semNome; }
  function maiuscula(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // ---------- servidor ----------
  function api(metodo, caminho, dados) {
    var url = C.api + caminho, op = { method: metodo, mode: 'cors' };
    if (metodo === 'GET') url += '?' + new URLSearchParams(dados).toString();
    else { op.body = JSON.stringify(dados); op.headers = { 'Content-Type': 'text/plain' }; }
    return fetch(url, op).then(function (r) { return r.json(); });
  }
  function tentar(fn, vezes) {
    return fn().catch(function (e) {
      if (vezes <= 1) throw e;
      return new Promise(function (ok) { setTimeout(ok, 1200); }).then(function () { return tentar(fn, vezes - 1); });
    });
  }

  // ---------- progresso salvo no aparelho (se ela fechar no meio) ----------
  function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify({ r: estado.respostas, f: estado.final })); } catch (e) { /* sem problema */ } }
  function recuperar() {
    try {
      var s = JSON.parse(localStorage.getItem(CHAVE) || 'null');
      if (s && Array.isArray(s.r) && s.r.length === 20) { estado.respostas = s.r; estado.final = s.f || ''; }
    } catch (e) { /* começa do zero */ }
  }

  function mostrar(html) { app.innerHTML = '<section class="tela entra">' + html + '</section>'; window.scrollTo(0, 0); var f = app.querySelector('h1,[data-foco]'); if (f) { f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); } }
  function topo(texto, pct, voltar) {
    return '<div class="topo"><div class="topo-linha">' + (voltar ? '<button type="button" class="voltar" data-voltar>‹ Voltar</button>' : '<span></span>') +
      '<span class="contador">' + esc(texto) + '</span></div><div class="barra" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(pct) + '"><i style="width:' + pct + '%"></i></div></div>';
  }
  function msg(texto) { app.innerHTML = '<div class="tela">' + MARCA + '<div class="carregando"><p>' + esc(texto) + '</p></div></div>'; }

  // ---------- telas ----------
  var voltarPara = null;

  function inicio() {
    var t = T.tela_inicio;
    voltarPara = null;
    mostrar(MARCA +
      '<div style="display:flex;flex-direction:column;gap:10px;margin-top:4px"><span class="selo">' + esc(t.selo) + '</span>' +
      '<h1 style="font-size:38px;line-height:1.08">' + esc(comNome(t.titulo, 'Vamos descobrir como você conquista o amor.')) + '</h1></div>' +
      '<div class="itens3">' + t.itens.map(function (x, i) { return '<div>' + icone(ICONES[i]) + '<span>' + esc(x) + '</span></div>'; }).join('') + '</div>' +
      '<div class="exemplo"><span style="font-size:17px;font-weight:700;line-height:1.4">' + esc(t.como_responder) + '</span>' +
      '<div style="display:flex;flex-direction:column;gap:10px">' + T.escala.map(function (e) { return '<div class="linha"><span>' + esc(e.texto) + '</span>' + pts(e.pontinhos) + '</div>'; }).join('') + '</div></div>' +
      '<p style="font-size:17px;line-height:1.5" class="suave">' + esc(t.texto) + '</p>' +
      '<div class="cresce"></div>' +
      '<button type="button" class="botao" data-ir="0">' + esc(t.botao) + '</button>' +
      '<p class="rodape">' + esc(t.rodape) + '</p>');
  }

  function frase(i) {
    var f = T.frases[i], marcada = estado.respostas[i];
    voltarPara = i === 0 ? inicio : function () { frase(i - 1); };
    mostrar(MARCA + topo(T.tela_frase.contador.replace('{n}', i + 1), i / 20 * 100, true) +
      '<div class="cresce"></div>' +
      '<div class="frase-bloco"><span class="selo" style="font-size:13px">' + esc(T.tela_frase.pergunta.toUpperCase()) + '</span>' +
      '<p data-foco>' + esc(f.frase) + '</p><span class="traco" aria-hidden="true"></span></div>' +
      '<div class="cresce"></div>' +
      '<div class="opcoes" role="group" aria-label="' + esc(T.tela_frase.pergunta) + '">' + T.escala.map(function (e) {
        return '<button type="button" class="resp' + (marcada === e.pontos ? ' marcada' : '') + '" data-resp="' + e.pontos + '" aria-pressed="' + (marcada === e.pontos) + '"><span>' + esc(e.texto) + '</span>' + pts(e.pontinhos) + '</button>';
      }).join('') + '</div>' +
      '<p class="rodape" style="font-size:15px">' + esc(T.tela_frase.rodape) + '</p>');
    app.querySelectorAll('[data-resp]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (app.dataset.travado) return;
        app.dataset.travado = '1';
        estado.respostas[i] = Number(b.dataset.resp);
        salvar();
        app.querySelectorAll('[data-resp]').forEach(function (x) { x.classList.toggle('marcada', x === b); x.setAttribute('aria-pressed', x === b); });
        setTimeout(function () {
          delete app.dataset.travado;
          var pausa = T.pausas.filter(function (p) { return p.depois_da_frase === i + 1; })[0];
          if (pausa) telaPausa(pausa);
          else if (i === 19) final();
          else frase(i + 1);
        }, 250);
      });
    });
  }

  function telaPausa(p) {
    var n = p.depois_da_frase, arco = (352 * n / 20).toFixed(0);
    voltarPara = function () { frase(n - 1); };
    mostrar(MARCA + topo(T.tela_frase.contador.replace('{n}', n), n / 20 * 100, true) +
      '<div class="cresce"></div>' +
      '<div class="centro"><svg width="132" height="132" viewBox="0 0 132 132" role="img" aria-label="' + n + ' de 20 frases respondidas"><circle cx="66" cy="66" r="56" fill="none" stroke="#EFE9DF" stroke-width="6"/><circle cx="66" cy="66" r="56" fill="none" stroke="#C9A84C" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + arco + ' 352" transform="rotate(-90 66 66)"/><text x="66" y="76" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-weight="600" font-size="34" fill="#1A1714">' + n + '/20</text></svg>' +
      '<h1>' + esc(p.titulo) + '</h1><span style="font-size:19px" class="suave">' + esc(p.texto) + '</span></div>' +
      '<div class="cresce"></div>' +
      '<button type="button" class="botao" data-ir="' + n + '">' + esc(p.botao) + '</button>');
  }

  function final() {
    var P = T.pergunta_final;
    if (!estado.ordemFinal) {
      estado.ordemFinal = P.opcoes.slice();
      for (var k = estado.ordemFinal.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)); var t = estado.ordemFinal[k]; estado.ordemFinal[k] = estado.ordemFinal[j]; estado.ordemFinal[j] = t; }
    }
    voltarPara = function () { frase(19); };
    mostrar(MARCA + topo(P.selo, 96, true) +
      '<div style="display:flex;flex-direction:column;gap:10px;margin-top:4px"><h1 style="font-size:32px;line-height:1.1">' + esc(P.pergunta) + '</h1>' +
      '<span style="font-size:17px;line-height:1.45" class="suave">' + esc(P.subtitulo) + '</span></div>' +
      '<div class="opcoes" role="radiogroup" aria-label="' + esc(P.pergunta) + '">' + estado.ordemFinal.map(function (o) {
        return '<button type="button" class="escolha" role="radio" aria-checked="' + (estado.final === o.padrao) + '" data-final="' + o.padrao + '"><span class="bola" aria-hidden="true"></span><span>“' + esc(o.frase) + '”</span></button>';
      }).join('') + '</div>' +
      '<div class="cresce"></div>' +
      '<button type="button" class="botao" id="ver"' + (estado.final ? '' : ' disabled') + '>' + esc(P.botao) + '</button>');
    app.querySelectorAll('[data-final]').forEach(function (b) {
      b.addEventListener('click', function () {
        estado.final = b.dataset.final; salvar();
        app.querySelectorAll('[data-final]').forEach(function (x) { x.setAttribute('aria-checked', x === b); });
        document.getElementById('ver').disabled = false;
      });
    });
    document.getElementById('ver').addEventListener('click', analisar);
  }

  function enviar() {
    return tentar(function () {
      return api('POST', 'completo', { a: a, respostas: estado.respostas, final: estado.final }).then(function (r) {
        if (!r || !r.ok) { var e = new Error((r && r.erro) || 'erro'); e.definitivo = !!(r && r.erro && /inválid/i.test(r.erro)); throw e; }
        return r;
      });
    }, 3);
  }

  function analisar() {
    if (estado.respostas.some(function (x) { return x === null; })) { var falta = estado.respostas.indexOf(null); return frase(falta); }
    var A = T.analisando;
    voltarPara = null;
    var local = CALC.calcular(estado.respostas, estado.final);
    var envio = enviar().then(function (r) { estado.links = r; estado.resultado = r.resultado; }, function () { estado.resultado = { padrao: local.padrao, nivel: local.nivel }; });
    mostrar(MARCA +
      '<div class="cresce"></div>' +
      '<div class="anel" role="img" aria-label="' + esc(A.titulo) + '"><svg width="150" height="150" viewBox="0 0 150 150" aria-hidden="true"><circle cx="75" cy="75" r="66" fill="none" stroke="#EFE9DF" stroke-width="8"/><circle id="arco" cx="75" cy="75" r="66" fill="none" stroke="#C9A84C" stroke-width="8" stroke-linecap="round" stroke-dasharray="0 415" transform="rotate(-90 75 75)"/></svg><span id="pct" aria-hidden="true">0%</span></div>' +
      '<div style="display:flex;flex-direction:column;gap:8px;text-align:center"><h1 style="font-size:32px;line-height:1.1">' + esc(A.titulo) + '</h1><p class="suave" style="font-size:17px">' + esc(A.texto) + '</p></div>' +
      '<div class="passos">' + A.linhas.map(function (l, i) { return '<div data-l="' + i + '">' + check(false) + '<span>' + esc(l) + '</span></div>'; }).join('') + '</div>' +
      '<div class="cresce"></div>');
    var t0 = performance.now(), DUR = 2600;
    (function quadro() {
      var x = Math.min(1, (performance.now() - t0) / DUR);
      var pct = document.getElementById('pct'), arco = document.getElementById('arco');
      if (!pct) return;
      pct.textContent = Math.round(x * 100) + '%';
      arco.setAttribute('stroke-dasharray', (415 * x).toFixed(0) + ' 415');
      A.linhas.forEach(function (l, i) {
        var el = app.querySelector('[data-l="' + i + '"]');
        if (el && x >= (i + 1) / 3 && !el.classList.contains('feito')) { el.classList.add('feito'); el.firstChild.outerHTML = check(true); }
      });
      if (x < 1) requestAnimationFrame(quadro);
      else envio.then(function () { setTimeout(resultado, 300); });
    })();
  }
  function check(feito) {
    return feito
      ? '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="#C9A84C"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="none" stroke="#E8E1D6" stroke-width="3"/></svg>';
  }

  function resultado() {
    var R = T.resultado, F = R.textos_fixos, r = estado.resultado;
    var P = R.padroes.filter(function (p) { return p.codigo === r.padrao; })[0];
    var I = R.intensidade.filter(function (x) { return x.nivel === r.nivel; })[0];
    var L = estado.links || {};
    var nomePadrao = P.nome;
    voltarPara = null;
    var niveis = ''; for (var k = 1; k <= 3; k++) niveis += '<i' + (k <= r.nivel ? ' class="c"' : '') + '></i>';
    var semLinks = !L.livro;
    mostrar(MARCA +
      '<div class="res-topo"><span class="selo">' + esc(F.selo) + '</span>' +
      '<span style="font-size:18px;line-height:1.4" class="suave">' + esc(comNome(F.abertura, maiuscula(F.abertura.replace('{Nome}, ', '')))) + '</span>' +
      '<h1>' + esc(nomePadrao) + '</h1>' +
      '<div class="aneis" aria-hidden="true"><i></i>' + ANEIS + '<i></i></div></div>' +
      '<div class="cartao"><span class="selo">' + esc(F.titulo_intensidade) + '</span>' +
      '<div class="niveis" role="img" aria-label="Nível ' + r.nivel + ' de 3">' + niveis + '</div>' +
      '<span style="font-size:17px;font-weight:700">' + esc(I.texto) + '</span></div>' +
      '<div class="citacao"><span class="aspas" aria-hidden="true">“</span><p>' + esc(P.frase) + '</p></div>' +
      '<p class="texto">' + esc(P.texto) + '</p>' +
      '<p class="texto" style="font-weight:700;line-height:1.5">' + esc(F.fecho) + '</p>' +
      // livro
      '<div class="bloco"><div style="display:flex;gap:18px;align-items:center">' +
      '<div class="capa-livro" aria-hidden="true"><div><svg width="30" height="19" viewBox="0 0 46 28"><circle cx="16" cy="14" r="11.5" fill="none" stroke="#C9A84C" stroke-width="2.5"/><circle cx="30" cy="14" r="11.5" fill="none" stroke="#C9A84C" stroke-width="2.5"/></svg><span style="font-family:\'Cormorant Garamond\',Georgia,serif;font-weight:600;font-size:17px;line-height:1.1;color:#fff">Como faço você me amar?</span><span style="font-family:Cinzel,serif;font-size:8px;letter-spacing:.14em;color:#C9A84C">AIRON PEREIRA</span></div></div>' +
      '<div style="display:flex;flex-direction:column;gap:6px"><span class="selo" style="letter-spacing:.14em">' + esc(F.livro.selo) + '</span>' +
      '<h2 style="font-size:24px;line-height:1.1">' + esc(F.livro.titulo) + '</h2>' +
      '<span style="font-size:16px;line-height:1.45" class="suave">' + esc(F.livro.texto.replace('{padrao}', nomePadrao)) + '</span></div></div>' +
      (semLinks ? '<button type="button" class="botao" data-recarregar>' + esc(F.livro.botao) + '</button>'
        : '<a class="botao" href="' + esc(L.livro) + '" target="_blank" rel="noopener">' + esc(F.livro.botao) + '</a>') + '</div>' +
      // guia
      '<div class="bloco" style="padding:20px;gap:14px"><div style="display:flex;gap:14px;align-items:center"><span class="icone-quadro">' + icone('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M12 12v6M9 15l3 3 3-3"/>') + '</span>' +
      '<div style="display:flex;flex-direction:column;gap:2px"><span class="selo" style="letter-spacing:.14em">' + esc(F.guia.selo) + '</span>' +
      '<span style="font-size:17px;font-weight:700;line-height:1.3">' + esc(F.guia.titulo.replace('{padrao}', nomePadrao)) + '</span></div></div>' +
      (semLinks ? '<button type="button" class="botao contorno" data-recarregar>' + esc(F.guia.botao) + '</button>'
        : '<a class="botao contorno" href="' + esc(L.guia) + '" target="_blank" rel="noopener">' + esc(F.guia.botao) + '</a>') + '</div>' +
      (semLinks ? '<p class="aviso" id="aviso-links">A sua internet oscilou. Toque no botão de novo para liberar o livro e o guia.</p>' : '') +
      // aula
      '<div class="bloco bege"><span class="selo" style="letter-spacing:.14em">' + esc(F.aula.selo) + '</span>' +
      '<h2 style="font-size:26px;line-height:1.15">' + esc(F.aula.titulo) + '</h2>' +
      '<span style="font-size:17px;line-height:1.5" class="suave">' + esc(F.aula.texto) + '</span>' +
      '<a class="botao claro" style="margin-top:4px" href="' + esc(L.grupo || C.grupoAula) + '" target="_blank" rel="noopener">' + esc(F.aula.botao) + '</a></div>' +
      '<p class="rodape">' + esc(F.rodape) + '</p>');
    app.querySelectorAll('[data-recarregar]').forEach(function (b) {
      b.addEventListener('click', function () {
        b.disabled = true;
        var pedir = estado.respostas.every(function (x) { return x !== null; }) && estado.final
          ? enviar() : tentar(function () { return api('GET', 'completo', { a: a }); }, 3);
        pedir.then(function (r) { if (r && r.livro) { estado.links = r; estado.resultado = r.resultado || estado.resultado; resultado(); } else b.disabled = false; })
          .catch(function () { b.disabled = false; });
      });
    });
  }

  // ---------- cliques gerais ----------
  app.addEventListener('click', function (ev) {
    var v = ev.target.closest('[data-voltar]');
    if (v && voltarPara) return voltarPara();
    var ir = ev.target.closest('[data-ir]');
    if (ir) frase(Number(ir.dataset.ir));
  });

  // ---------- começo ----------
  if (!a) return msg('Não encontramos este acesso. Confira o link que chegou no seu e-mail.');
  tentar(function () { return api('GET', 'completo', { a: a }); }, 3).then(function (r) {
    if (!r || !r.ok) return msg('Não encontramos este acesso. Confira o link que chegou no seu e-mail.');
    estado.nome = r.nome || '';
    if (r.feito && r.resultado) { estado.links = r; estado.resultado = r.resultado; return resultado(); }
    recuperar();
    var falta = estado.respostas.indexOf(null);
    if (falta > 0) frase(falta); // continua de onde parou
    else if (falta === -1) final();
    else inicio();
  }).catch(function () {
    msg('Não conseguimos abrir o seu teste agora. Confira a sua internet e abra o link de novo.');
  });
})();
