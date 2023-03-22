import { sessionOptions } from '@/configs/session'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy()
  res.json({
    token: '',
    username: '',
    isLogged: false,
  })
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions)
