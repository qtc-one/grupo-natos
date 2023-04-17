import { sessionOptions } from '@/configs/session'
import fetchJson from '@/utils/fetchJson'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

async function recoverUserAccessRoute(req: NextApiRequest, res: NextApiResponse) {
  const { login, email } = req.body
  try {
    const token = await fetchJson(
      `${process.env.UAU_BASEURL_INTEGRATION}/Autenticador/AutenticarUsuario`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-INTEGRATION-Authorization': String(process.env.UAU_TOKEN_INTEGRATION),
        },
        body: JSON.stringify({
          Login: process.env.UAU_USER_INTEGRATION,
          Senha: process.env.UAU_USER_PASSWORD,
          UsuarioUAUSite: 'uauweb',
        }),
      }
    )

    const response: any = await fetchJson(
      `${process.env.UAU_BASEURL_INTEGRATION}/Pessoas/RecuperarCredenciaisUAUWeb`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: String(token),
          'X-INTEGRATION-Authorization': String(process.env.UAU_TOKEN_INTEGRATION),
        },
        body: JSON.stringify({
          Login: login,
          Email: email,
        }),
      }
    )

    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export default withIronSessionApiRoute(recoverUserAccessRoute, sessionOptions)
