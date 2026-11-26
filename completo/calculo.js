// Cálculo do resultado do teste completo (igual no navegador e no backend do Wix)
// respostas: 20 números de 0 a 3, na ordem das frases; final: código do padrão da última pergunta
(function (raiz) {
  'use strict';
  var ORDEM = ['salvador', 'vitima', 'agradador', 'controlador', 'rebelde', 'controlador', 'rebelde', 'salvador', 'agradador', 'vitima',
    'agradador', 'vitima', 'rebelde', 'salvador', 'controlador', 'rebelde', 'salvador', 'controlador', 'vitima', 'agradador'];
  var PADROES = ['salvador', 'controlador', 'agradador', 'rebelde', 'vitima'];

  function calcular(respostas, final) {
    if (!Array.isArray(respostas) || respostas.length !== 20) throw new Error('respostas inválidas');
    var r = respostas.map(function (x) { x = Number(x); if (!(x >= 0 && x <= 3) || x % 1) throw new Error('resposta inválida'); return x; });
    if (PADROES.indexOf(final) < 0) throw new Error('última pergunta inválida');
    var pontos = {}, sempre = {};
    PADROES.forEach(function (p) { pontos[p] = 0; sempre[p] = 0; });
    r.forEach(function (x, i) { pontos[ORDEM[i]] += x; if (x === 3) sempre[ORDEM[i]]++; });
    pontos[final] += 3;

    // 1) mais pontos
    var max = Math.max.apply(null, PADROES.map(function (p) { return pontos[p]; }));
    var emp = PADROES.filter(function (p) { return pontos[p] === max; });
    // 2) mais respostas "Sempre"
    if (emp.length > 1) {
      var ms = Math.max.apply(null, emp.map(function (p) { return sempre[p]; }));
      emp = emp.filter(function (p) { return sempre[p] === ms; });
    }
    // 3) o da última pergunta, se estiver no empate; senão, quem recebeu primeiro a nota mais alta
    if (emp.length > 1) {
      if (emp.indexOf(final) >= 0) emp = [final];
      else {
        var nota = -1;
        r.forEach(function (x, i) { if (emp.indexOf(ORDEM[i]) >= 0 && x > nota) nota = x; });
        for (var i = 0; i < 20; i++) if (emp.indexOf(ORDEM[i]) >= 0 && r[i] === nota) { emp = [ORDEM[i]]; break; }
      }
    }
    var padrao = emp[0], total = pontos[padrao];
    var nivel = total >= 11 ? 3 : total >= 7 ? 2 : 1;
    return { padrao: padrao, pontos: pontos, total: total, nivel: nivel };
  }

  var api = { calcular: calcular, ORDEM: ORDEM, PADROES: PADROES };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else raiz.CALCULO = api;
})(this);
