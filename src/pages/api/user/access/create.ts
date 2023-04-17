import fetchJson from '@/utils/fetchJson'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function createUserAccessRoute(req: NextApiRequest, res: NextApiResponse) {
  const { document, birthdate, login, password, email } = req.body
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
      `${process.env.UAU_BASEURL_INTEGRATION}/Pessoas/CriarCredenciaisUAUWeb`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: String(token),
          'X-INTEGRATION-Authorization': String(process.env.UAU_TOKEN_INTEGRATION),
        },
        body: JSON.stringify({
          CPF: document,
          DataNascimento: birthdate,
          Login: login,
          Senha: password,
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
