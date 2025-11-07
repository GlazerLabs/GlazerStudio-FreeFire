export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchid');
  const clientId = searchParams.get('clientid');

  if (!matchId || !clientId) {
    return Response.json(
      { error: 'Match ID and Client ID are required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://suez-ind.garenanow.com/game/freefire/tidy/v1/livematch/br/batch?matchid=${matchId}`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Client-ID': clientId,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        { error: `API Error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Return the data with CORS headers
    return Response.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    return Response.json(
      { error: error.message || 'Failed to fetch live scoring data' },
      { status: 500 }
    );
  }
}
