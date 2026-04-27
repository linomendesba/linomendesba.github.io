exports.handler = async (event) => {
  const caminho = event.queryStringParameters?.caminho;

  if (!caminho) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Parâmetro caminho ausente' }) };
  }

  const API_SECRET = process.env.API_SECRET;
  const API_ORIGEM = "https://betstat.site";

  try {
    const response = await fetch(`${API_ORIGEM}/${caminho}`, {
      headers: {
        'Origin': 'https://betstat.netlify.app',
        'x-api-key': API_SECRET
      }
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro ao buscar dados', erro: err.message })
    };
  }
};
