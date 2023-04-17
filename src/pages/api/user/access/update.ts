import { sessionOptions } from '@/configs/session'
import fetchJson from '@/utils/fetchJson'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

async function updateUserAccessRoute(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user
  const { login, email, password } = req.body

  if (!user || user.isLogged === false) {
    res.status(401).end()
    return
  }

  console.log({
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: user.token,
      'Content-Type': 'application/json',
      'X-INTEGRATION-Authorization': String(process.env.UAU_TOKEN_INTEGRATION),
    },
    body: {
      codigo_pessoa: user.code,
      login: login,
      email: email,
      senha: password,
    },
  })

  try {
    const response = await fetchJson(
      `${process.env.UAU_BASEURL_INTEGRATION}/Pessoas/AlterarPessoaAcessoPortal`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: user.token,
          'Content-Type': 'application/json',
          'X-INTEGRATION-Authorization': String(process.env.UAU_TOKEN_INTEGRATION),
        },
        body: JSON.stringify({
          codigo_pessoa: user.code,
          login: login,
          email: email,
          senha: password,
        }),
      }
    )

    return res.status(200).json(response)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

export default withIronSessionApiRoute(updateUserAccessRoute, sessionOptions)
