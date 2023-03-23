import { sessionOptions, UserSession } from '@/configs/session'
import fetchJson from '@/utils/fetchJson'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = await req.body

  try {
    const token: string = await fetchJson(
      `${process.env.UAU_BASEURL_INTEGRATION}/Autenticador/AutenticarUsuario`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-INTEGRATION-Authorization': String(process.env.UAU_TOKEN_INTEGRATION),
        },
        body: JSON.stringify({ Login: username, Senha: password, UsuarioUAUSite: 'qtcnatos' }),
      }
    )

    const user = {
      token,
      username,
      isLogged: true,
    } as UserSession

    req.session.user = user
    await req.session.save()
    res.json(user)
  } catch (error) {
    res.status(401).json({ message: 'Usuário ou senha inválido!' })
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions)
