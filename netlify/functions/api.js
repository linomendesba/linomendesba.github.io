exports.handler = async (event) => {
  // Verifica se a requisição veio do site
  const referer = event.headers?.referer || event.headers?.Referer || '';
  const dominiosPermitidos = ['https://betstat.site', 'https://www.betstat.site', 'https://betstat.netlify.app'];
  const origemValida = dominiosPermitidos.some(d => referer.startsWith(d));

  if (!origemValida) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Acesso não autorizado.' })
    };
  }

  const caminho = event.queryStringParameters?.caminho;

  if (!caminho) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Parâmetro caminho ausente' })
    };
  }

  const API_SECRET = process.env.API_SECRET;
  const API_ORIGEM = "https://betstat.site";

  try {
    const response = await fetch(`${API_ORIGEM}/${caminho}`, {
      headers: {
        'Origin': 'https://betstat.netlify.app',
        'x-api-key': API_SECRET || ''
      }
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('Resposta não é JSON:', text);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: '[]'
      };
    }

    if (!Array.isArray(data)) {
      console.error('Resposta não é array:', JSON.stringify(data));
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: '[]'
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

  } catch (err) {
    console.error('Erro na function:', err.message);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: '[]'
    };
  }
};