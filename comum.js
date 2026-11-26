/* Funções usadas por todas as páginas do funil */
(function () {
  'use strict';
  var C = window.CONFIG;

  window.$ = function (s) { return document.querySelector(s); };
  window.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  window.parametro = function (k) { return new URLSearchParams(location.search).get(k) || ''; };

  window.MARCA = '<div class="marca"><svg width="30" height="19" viewBox="0 0 46 28" aria-hidden="true"><circle cx="16" cy="14" r="11.5" fill="none" stroke="#C9A84C" stroke-width="2.5"/><circle cx="30" cy="14" r="11.5" fill="none" stroke="#C9A84C" stroke-width="2.5"/></svg><span>MÉTODO INTIMIDADE</span></div>';
  window.ITEM_OK = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="#C9A84C"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // Chamadas ao servidor do Wix (JSON como texto puro: sem "pré-consulta" do navegador)
  window.api = function (metodo, caminho, dados) {
    var url = C.api + caminho;
    var op = { method: metodo, mode: 'cors' };
    if (metodo === 'GET' && dados) url += '?' + new URLSearchParams(dados).toString();
    if (metodo === 'POST') { op.body = JSON.stringify(dados || {}); op.headers = { 'Content-Type': 'text/plain' }; }
    return fetch(url, op).then(function (r) { return r.json().then(function (j) { j._status = r.status; return j; }); });
  };

  window.etapa = function (sessao, n) {
    if (!sessao) return;
    var corpo = JSON.stringify({ sessao: sessao, etapa: n });
    try { if (navigator.sendBeacon && navigator.sendBeacon(C.api + 'funilb', new Blob([corpo], { type: 'text/plain' }))) return; } catch (e) { /* segue */ }
    try { fetch(C.api + 'funilb', { method: 'POST', body: corpo, headers: { 'Content-Type': 'text/plain' }, keepalive: true }); } catch (e) { /* ignora */ }
  };

  window.cookie = function (nome) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + nome + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  };

  window.carregarPixel = function () {
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', C.pixel);
    window.fbq('track', 'PageView');
  };
  if ('requestIdleCallback' in window) requestIdleCallback(window.carregarPixel, { timeout: 1500 }); else setTimeout(window.carregarPixel, 600);

  var stripePromessa = null;
  window.carregarStripe = function () {
    if (!stripePromessa) {
      stripePromessa = new Promise(function (ok, erro) {
        var s = document.createElement('script');
        s.src = 'https://js.stripe.com/v3/';
        s.onload = function () { ok(window.Stripe(C.stripePk, { locale: 'pt-BR' })); };
        s.onerror = erro;
        document.head.appendChild(s);
      });
    }
    return stripePromessa;
  };
  window.aparenciaStripe = {
    theme: 'stripe',
    variables: { colorPrimary: '#8A6514', colorText: '#1A1714', colorDanger: '#B3261E', fontFamily: 'Lato, system-ui, sans-serif', borderRadius: '12px', fontSizeBase: '16px' }
  };

  // Espera o pedido ficar "pago" (o Stripe avisa o servidor em segundos)
  window.esperarPago = function (pedido, aoMudar) {
    var n = 0;
    return new Promise(function (ok) {
      (function olhar() {
        n++;
        api('GET', 'pedido', { p: pedido }).then(function (r) {
          if (aoMudar) aoMudar(r);
          if (r.status === 'pago') return ok(r);
          setTimeout(olhar, n < 20 ? 1500 : 4000);
        }).catch(function () { setTimeout(olhar, 3000); });
      })();
    });
  };

  // ---------- Hubla ----------
  window.ehHubla = function () { return C.pagamento === 'hubla'; };
  window.guardarSessao = function (s) { try { if (s) localStorage.setItem('funilb-s', s); } catch (e) { /* ignora */ } };
  window.lerSessao = function () { try { return localStorage.getItem('funilb-s') || ''; } catch (e) { return ''; } };
  // Link do checkout da Hubla levando a sessão do teste grátis (volta no aviso de pagamento) e as UTMs
  window.linkHubla = function (base, s) {
    var u = new URL(base), q = new URLSearchParams(location.search);
    if (s) u.searchParams.set('sck', s);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'].forEach(function (k) { if (q.get(k)) u.searchParams.set(k, q.get(k)); });
    return u.toString();
  };
  // Acha o pedido: pelo ?p= da URL ou, voltando da Hubla, pela sessão guardada no navegador
  window.acharPedido = function (aoEsperar) {
    var p = parametro('p');
    if (p) return Promise.resolve(p);
    var s = parametro('s') || lerSessao();
    if (!s) return Promise.resolve('');
    var n = 0;
    return new Promise(function (ok) {
      (function olhar() {
        n++;
        api('GET', 'pedidoSessao', { s: s }).then(function (r) {
          if (r.ok) return ok(r.p);
          if (aoEsperar) aoEsperar(n);
          if (n > 60) return ok('');
          setTimeout(olhar, n < 20 ? 1500 : 4000);
        }).catch(function () { if (n > 60) return ok(''); setTimeout(olhar, 3000); });
      })();
    });
  };

  // Player de vídeo simples (.mp4). Devolve o elemento <video> ou null.
  window.montarVideo = function (alvo, url, legenda) {
    if (!url) {
      alvo.innerHTML = '<div class="vazio"><svg width="56" height="56" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#FFFFFF"/><path d="M10 8v8l6-4z" fill="#1A1714"/></svg><span>Vídeo em breve</span></div>';
      return null;
    }
    alvo.innerHTML = '<video controls playsinline preload="metadata" src="' + esc(url) + '"></video>';
    return alvo.querySelector('video');
  };
})();
