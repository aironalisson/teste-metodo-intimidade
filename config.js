// Configuração pública do funil (nada secreto aqui: chaves e preços ficam no Wix)
window.CONFIG = {
  api: 'https://www.metodointimidade.com.br/_functions/',
  pixel: '901077246011978',
  stripePk: 'pk_test_51UEX3ULInxjsICOiAjri4QopaAQyhHcuIFYPz01VuGYyiUZgGZjDg8ZMYRgiMYniPiBQRF7nHOut6gWae5bwWXSG00OI2dZQuT',
  preco: 'R$49',
  precoSessao: 'R$197',
  grupoAula: 'https://chat.whatsapp.com/B5rOiFK7xFdAHNfCg0r7gh',
  whatsappAiron: '5511999235360', // número com DDI e DDD, só números
  agendar: 'https://www.metodointimidade.com.br/agendar',
  // Vídeos (endereço .mp4 ou do player). Vazio = vídeo ainda não gravado.
  // VSL 1 tem 4 versões: uma por rótulo.
  vsl1: { migalhas: '', 'carrega-tudo': '', invisivel: '', 'coracao-fechado': '' },
  vsl2: '',
  vsl3: '',
  ofertaEm: 34 // segundo do vídeo em que o cartão da oferta aparece
};
window.ROTULOS = {
  migalhas: 'A Que Recebeu Migalhas',
  'carrega-tudo': 'A Que Carrega Tudo Sozinha',
  invisivel: 'A Invisível',
  'coracao-fechado': 'A Que Fechou o Coração'
};
