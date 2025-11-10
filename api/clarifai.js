/**
 * Vercel Serverless Function - Proxy pour API Clarifai
 * Contourne les restrictions CORS en faisant l'appel côté serveur
 */

export default async function handler(req, res) {
  // CORS headers pour autoriser le frontend
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Seulement POST accepté
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }

  try {
    const { base64Image } = req.body

    if (!base64Image) {
      return res.status(400).json({
        success: false,
        error: 'Missing base64Image in request body'
      })
    }

    // Récupérer la clé API depuis les variables d'environnement
    const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY

    if (!CLARIFAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'CLARIFAI_API_KEY not configured'
      })
    }

    // Appel à l'API Clarifai
    const response = await fetch(
      'https://api.clarifai.com/v2/models/food-item-recognition/outputs',
      {
        method: 'POST',
        headers: {
          'Authorization': `Key ${CLARIFAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: [
            {
              data: {
                image: {
                  base64: base64Image
                }
              }
            }
          ]
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.status?.details || 'Clarifai API error'
      })
    }

    return res.status(200).json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Clarifai proxy error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
