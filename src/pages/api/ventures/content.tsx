import { sessionOptions } from '@/configs/session'
import fetchJson from '@/utils/fetchJson'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

export type Venture = {
  title: string
  video: string
  content?: string
  images: { nodes: { sourceUrl: string }[] }
  documents: { nodes: { title: string; mediaItemUrl: string }[] }
}

export type ListOfVenturesAPIResponse = {
  data: { ventures: { nodes: Venture[] } }
}

async function venturesContentRoute(
  req: NextApiRequest,
  res: NextApiResponse<ListOfVenturesAPIResponse>
) {
  const user = req.session.user

  if (!user || user.isLogged === false) {
    res.status(401).end()
    return
  }

  try {
    const response: any = await fetchJson(String(process.env.WORDPRESS_API_URL), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query AllVentures {
          ventures {
            nodes {
              title
              video
              content
              images {
                nodes {
                  sourceUrl
                }
              }
              documents {
                nodes {
                  title
                  mediaItemUrl
                }
              }
            }
          }
        }`,
      }),
    })

    res.status(200).json(response)
  } catch (error) {
    res.status(400).json({ data: { ventures: { nodes: [] } } })
  }
}

export default withIronSessionApiRoute(venturesContentRoute, sessionOptions)
