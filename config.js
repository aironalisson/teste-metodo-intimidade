// Configuração pública do funil (nada secreto aqui: chaves e preços ficam no Wix)
window.CONFIG = {
  api: 'https://www.metodointimidade.com.br/_functions/',
  pixel: '901077246011978',
  stripePk: 'pk_test_51UEX3ULInxjsICOiAjri4QopaAQyhHcuIFYPz01VuGYyiUZgGZjDg8ZMYRgiMYniPiBQRF7nHOut6gWae5bwWXSG00OI2dZQuT',
  preco: 'R$49',
  precoSessao: 'R$197',
  // Preço mostrado nas ofertas (só parcelado, como está na Hubla)
  parcelaTeste: ['10x de', 'R$5,70'],
  parcelaSessao: ['12x de', 'R$19,90'],
  aVistaTeste: 'R$48,14',
  aVistaSessao: 'R$195,00',
  grupoAula: 'https://chat.whatsapp.com/B5rOiFK7xFdAHNfCg0r7gh',
  whatsappAiron: '5511999235360', // número com DDI e DDD, só números
  agendar: 'https://www.metodointimidade.com.br/agendar',
  // Vídeos (endereço .mp4 ou do player). Vazio = vídeo ainda não gravado.
  // VSL 1 tem 4 versões: uma por rótulo.
  vsl1: { migalhas: '', 'carrega-tudo': '', invisivel: '', 'coracao-fechado': '' },
  vsl2: '',
  vsl3: '',
  ofertaEm: 34, // segundo do vídeo em que o cartão da oferta aparece
  // Onde ela paga: 'stripe' (pagamento dentro do site) ou 'hubla' (checkout da Hubla)
  pagamento: 'hubla',
  hublaTeste: 'https://hub.la/g/S69ptmLjFHCNhdU6Gf5o', // checkout do R$49
  hublaSessao: 'https://hub.la/r/sessaodediagnostico' // 1 clique da sessão
};
window.ROTULOS = {
  migalhas: 'A Que Recebeu Migalhas',
  'carrega-tudo': 'A Que Carrega Tudo Sozinha',
  invisivel: 'A Invisível',
  'coracao-fechado': 'A Que Fechou o Coração'
};
