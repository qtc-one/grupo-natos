import { sessionOptions } from '@/configs/session'
import fetchJson from '@/utils/fetchJson'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

export type Article = {
  date: string
  slug: string
  title: string
  categories: {
    nodes: [
      {
        name: string
      }
    ]
  }
  featuredImage: {
    node: {
      sourceUrl: string
    }
  }
}

export type ArticlesRouteResponse = {
  data: {
    posts: {
      nodes: Article[]
    }
  }
}

async function articlesRoute(req: NextApiRequest, res: NextApiResponse<ArticlesRouteResponse>) {
  const user = req.session.user

  if (!user || user.isLogged === false) {
    res.status(401).end()
    return
  }

  try {
    const response: ArticlesRouteResponse = await fetchJson(String(process.env.WORDPRESS_API_URL), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query AllPosts {
          posts(where: {status: PUBLISH}) {
            nodes {
              date
              slug
              title
              featuredImage {
                node {
                  sourceUrl
                }
              }
              categories {
                nodes {
                  name
                }
              }
            }
          }
        }`,
      }),
    })

    res.status(200).json(response)
  } catch (error) {
    res.status(400).json({ data: { posts: { nodes: [] } } })
  }
}

export default withIronSessionApiRoute(articlesRoute, sessionOptions)
