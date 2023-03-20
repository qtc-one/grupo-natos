import { sessionOptions } from '@/configs/session'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

async function getUserDataRoute(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).end()
}

export default withIronSessionApiRoute(getUserDataRoute, sessionOptions)
