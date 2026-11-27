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
  // Vídeos de 27/11 (720p) guardados aqui, mas DESLIGADOS: o Airon vai trocar a música.
  //   // 720p: o mesmo vídeo, bem mais leve para o celular (1080p tem ~290 MB)
  //   vsl1: {
  //     migalhas: 'https://video.wixstatic.com/video/535e9c_82f4de70b48643e8972528f541fab49e/720p/mp4/file.mp4',
  //     'carrega-tudo': 'https://video.wixstatic.com/video/535e9c_27c1bee0333c4468997c01626b67f7c4/720p/mp4/file.mp4',
  //     invisivel: 'https://video.wixstatic.com/video/535e9c_b7283f0a33ac4fa4b33add2ef6fa7126/720p/mp4/file.mp4',
  //     'coracao-fechado': 'https://video.wixstatic.com/video/535e9c_9e339948b49d4adf94725b3ad51fbcf7/720p/mp4/file.mp4'
  //   },
  //   vsl2: 'https://video.wixstatic.com/video/535e9c_22c73d86d80843539aeb3e5464f5621c/720p/mp4/file.mp4',
  //   vsl3: 'https://video.wixstatic.com/video/535e9c_e14123916a31439ba07ef5854595573d/720p/mp4/file.mp4',
  vsl1: { migalhas: '', 'carrega-tudo': '', invisivel: '', 'coracao-fechado': '' },
  vsl2: '',
  vsl3: '',
  ofertaEm: 195, // segundo do vídeo em que o cartão da oferta aparece (3:15, quando o Airon começa a falar do teste e do livro)
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
