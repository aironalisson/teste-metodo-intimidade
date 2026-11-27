// Conteúdo do teste completo (versão 2, 25/11/2026). Textos copiados do briefing, sem alterar.
// Links do livro e dos guias NÃO ficam aqui: vêm do backend do Wix depois de conferir o acesso.
window.COMPLETO = {
 "tela_inicio": {
  "selo": "O SEU TESTE COMPLETO",
  "titulo": "{Nome}, vamos descobrir como você conquista o amor.",
  "itens": [
   "20 frases curtas",
   "Uns 10 minutos",
   "Livro no final"
  ],
  "como_responder": "Leia a frase e toque em quanto isso acontece com você:",
  "texto": "Pense nas suas relações de hoje e de antes. Toda resposta vale.",
  "botao": "Começar o teste",
  "rodape": "Suas respostas ficam só entre nós."
 },
 "tela_frase": {
  "pergunta": "Isso acontece com você?",
  "rodape": "Toda resposta vale. Marque o que acontece de verdade.",
  "contador": "{n} de 20"
 },
 "escala": [
  {
   "texto": "Nunca",
   "pontos": 0,
   "pontinhos": 0
  },
  {
   "texto": "Às vezes",
   "pontos": 1,
   "pontinhos": 1
  },
  {
   "texto": "Muitas vezes",
   "pontos": 2,
   "pontinhos": 2
  },
  {
   "texto": "Sempre",
   "pontos": 3,
   "pontinhos": 3
  }
 ],
 "pausas": [
  {
   "depois_da_frase": 5,
   "titulo": "Você está indo muito bem.",
   "texto": "Faltam 15 frases.",
   "botao": "Continuar"
  },
  {
   "depois_da_frase": 10,
   "titulo": "Você já está na metade!",
   "texto": "Faltam 10 frases.",
   "botao": "Continuar"
  },
  {
   "depois_da_frase": 15,
   "titulo": "Falta pouco.",
   "texto": "Faltam só 5 frases.",
   "botao": "Continuar"
  }
 ],
 "frases": [
  {
   "n": 1,
   "padrao": "salvador",
   "frase": "Eu corro pra resolver os problemas de quem eu amo."
  },
  {
   "n": 2,
   "padrao": "vitima",
   "frase": "Quando estou triste, eu me fecho e espero alguém notar."
  },
  {
   "n": 3,
   "padrao": "agradador",
   "frase": "Eu faço o que os outros querem, só pra agradar."
  },
  {
   "n": 4,
   "padrao": "controlador",
   "frase": "Eu organizo tudo na vida de quem eu amo."
  },
  {
   "n": 5,
   "padrao": "rebelde",
   "frase": "Eu falo o que os outros têm medo de falar."
  },
  {
   "n": 6,
   "padrao": "controlador",
   "frase": "Comigo no comando, tudo dá mais certo."
  },
  {
   "n": 7,
   "padrao": "rebelde",
   "frase": "Quando alguém me dá uma ordem, eu faço o contrário."
  },
  {
   "n": 8,
   "padrao": "salvador",
   "frase": "Gente com problema me atrai."
  },
  {
   "n": 9,
   "padrao": "agradador",
   "frase": "Eu concordo com tudo pra evitar briga."
  },
  {
   "n": 10,
   "padrao": "vitima",
   "frase": "Quando estou bem, as pessoas se afastam."
  },
  {
   "n": 11,
   "padrao": "agradador",
   "frase": "Eu deixo o outro escolher o programa do dia."
  },
  {
   "n": 12,
   "padrao": "vitima",
   "frase": "No amor, quem mais sofre sou eu."
  },
  {
   "n": 13,
   "padrao": "rebelde",
   "frase": "Quando algo me machuca, eu brigo em vez de chorar."
  },
  {
   "n": 14,
   "padrao": "salvador",
   "frase": "Eu cuido de todo mundo e me deixo pra depois."
  },
  {
   "n": 15,
   "padrao": "controlador",
   "frase": "Eu gosto que tudo seja feito do meu jeito."
  },
  {
   "n": 16,
   "padrao": "rebelde",
   "frase": "O que eu mais quero é que admirem a minha coragem."
  },
  {
   "n": 17,
   "padrao": "salvador",
   "frase": "Eu gosto de sentir que quem eu amo precisa de mim."
  },
  {
   "n": 18,
   "padrao": "controlador",
   "frase": "Eu digo aos outros o que eles devem fazer."
  },
  {
   "n": 19,
   "padrao": "vitima",
   "frase": "Quando estou sofrendo, as pessoas cuidam mais de mim."
  },
  {
   "n": 20,
   "padrao": "agradador",
   "frase": "Eu peço desculpa só pra acabar a briga."
  }
 ],
 "pergunta_final": {
  "selo": "Última pergunta",
  "pergunta": "Quando você era criança, o que aprendeu sobre o amor?",
  "subtitulo": "Escolha a frase que mais parece com o que você viveu em casa.",
  "pontos_extras": 3,
  "opcoes": [
   {
    "padrao": "vitima",
    "frase": "Se eu sofrer, alguém vai cuidar de mim."
   },
   {
    "padrao": "salvador",
    "frase": "Se precisarem de mim, vão ficar comigo."
   },
   {
    "padrao": "rebelde",
    "frase": "Se eu mostrar coragem, vão me admirar."
   },
   {
    "padrao": "agradador",
    "frase": "Se eu agradar, vão gostar de mim."
   },
   {
    "padrao": "controlador",
    "frase": "Se eu organizar tudo, tudo vai dar certo."
   }
  ],
  "botao": "Ver o meu resultado"
 },
 "analisando": {
  "titulo": "Analisando as suas respostas",
  "texto": "Leva só alguns segundos.",
  "linhas": [
   "Somando as suas respostas",
   "Encontrando o seu padrão",
   "Separando o seu livro"
  ]
 },
 "resultado": {
  "intensidade": [
   {
    "de": 11,
    "ate": 15,
    "nivel": 3,
    "texto": "Aparece muito na sua vida amorosa hoje"
   },
   {
    "de": 7,
    "ate": 10,
    "nivel": 2,
    "texto": "Aparece bastante na sua vida amorosa"
   },
   {
    "de": 0,
    "ate": 6,
    "nivel": 1,
    "texto": "Aparece em alguns momentos da sua vida amorosa"
   }
  ],
  "textos_fixos": {
   "selo": "O SEU RESULTADO",
   "abertura": "{Nome}, o seu Padrão de Conquista de Amor é:",
   "titulo_intensidade": "QUANTO ELE APARECE HOJE",
   "fecho": "Esse jeito de amar começou na sua história. E tem saída. Está tudo no livro, a partir do capítulo do seu padrão.",
   "livro": {
    "selo": "LIBERADO PRA VOCÊ",
    "titulo": "O livro inteiro",
    "texto": "Comece pelo capítulo do Padrão {padrao}.",
    "botao": "Ler o livro agora"
   },
   "guia": {
    "selo": "BÔNUS",
    "titulo": "O guia do Padrão {padrao}, em PDF",
    "botao": "Baixar o meu guia"
   },
   "aula": {
    "selo": "PRÓXIMO PASSO",
    "titulo": "Aula ao vivo e gratuita, toda segunda ao meio-dia",
    "texto": "Quem já sabe o próprio padrão aproveita muito mais. O link chega no grupo do WhatsApp.",
    "botao": "Entrar no grupo da aula"
   },
   "rodape": "Este teste não substitui acompanhamento psicológico."
  },
  "padroes": [
   {
    "codigo": "salvador",
    "nome": "Salvador",
    "frase": "Eu conquisto amor resolvendo a vida dos outros.",
    "texto": "Você ajuda antes de alguém pedir. Resolve, socorre, segura a barra. As pessoas ficam perto, mas muitas vezes ficam pela ajuda. E quem cuida de você?"
   },
   {
    "codigo": "controlador",
    "nome": "Controlador",
    "frase": "Eu conquisto amor organizando a vida do outro.",
    "texto": "Você organiza a vida de quem ama: horários, contas, planos. Com você, tudo dá certo. Só que quem cuida de tudo quase nunca recebe cuidado."
   },
   {
    "codigo": "agradador",
    "nome": "Agradador",
    "frase": "Eu conquisto amor agradando.",
    "texto": "Você faz o que os outros querem e deixa a sua vontade pra depois. Todo mundo gosta de você. Mas quase ninguém sabe o que você quer."
   },
   {
    "codigo": "rebelde",
    "nome": "Rebelde",
    "frase": "Eu conquisto amor quando admiram a minha coragem.",
    "texto": "Você fala o que os outros têm medo de falar e enfrenta o que eles evitam. Quem vê de longe admira. Mas, quando a briga acaba, quase ninguém fica pra cuidar de você."
   },
   {
    "codigo": "vitima",
    "nome": "Vítima",
    "frase": "Eu conquisto amor quando alguém cuida da minha dor.",
    "texto": "A sua dor é de verdade. Só que ela virou o jeito de as pessoas chegarem perto. Nos dias difíceis, elas aparecem. Nos dias bons, quase ninguém pergunta como você está."
   }
  ]
 }
};
