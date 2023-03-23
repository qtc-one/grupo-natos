import { sessionOptions } from '@/configs/session'
import fetchJson from '@/utils/fetchJson'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

export type Article = {
  author: { node: { name: string } }
  content?: string
  date: string
  featuredImage: { node: { sourceUrl: string; altText?: string } }
  slug: string
  title: string
}

export type SingleArticleAPIResponse = {
  data: { postBy: Article }
}

async function articleBySlugRoute(
  req: NextApiRequest,
  res: NextApiResponse<SingleArticleAPIResponse>
) {
  const user = req.session.user
  const { slug } = req.query

  if (!user || user.isLogged === false) {
    res.status(401).end()
    return
  }

  try {
    const response: SingleArticleAPIResponse = await fetchJson(
      String(process.env.WORDPRESS_API_URL),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `query PostBySlug($slug: String = "") {
          postBy(slug: $slug) {
            author {
              node {
                name
              }
            }
            content
            date
            featuredImage {
              node {
                altText
                sourceUrl
              }
            }
            slug
            title
          }
        }`,
          variables: {
            slug,
          },
        }),
      }
    )

    res.status(200).json(response)
  } catch (error) {
    res.status(400).json({ data: { postBy: {} as Article } })
  }
}

export default withIronSessionApiRoute(articleBySlugRoute, sessionOptions)
