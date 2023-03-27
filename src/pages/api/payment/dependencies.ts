import { sessionOptions } from '@/configs/session'
import fetchJson, { FetchError } from '@/utils/fetchJson'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

async function dependenciesRoute(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user
  const { sale, building, company } = req.body

  if (!user || user.isLogged === false) {
    res.status(401).end()
    return
  }

  try {
    const response: any = await fetchJson(
      `${process.env.UAU_BASEURL_INTEGRATION}/Venda/BuscarParcelasAReceber`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: user.token,
          'Content-Type': 'application/json',
          'X-INTEGRATION-Authorization': String(process.env.UAU_TOKEN_INTEGRATION),
        },
        body: JSON.stringify({
          empresa: parseInt(String(company)),
          obra: building,
          num_ven: parseInt(String(sale)),
          data_calculo: new Date().toISOString(),
          valor_presente: true,
        }),
      }
    )

    res.status(200).json(response)
  } catch (error) {
    res.status(400).json([])
  }
}

export default withIronSessionApiRoute(dependenciesRoute, sessionOptions)
