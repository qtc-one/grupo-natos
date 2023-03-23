import { sessionOptions } from '@/configs/session'
import fetchJson, { FetchError } from '@/utils/fetchJson'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

async function venturesRoute(req: NextApiRequest, res: NextApiResponse<UserVenturesAPIResponse>) {
  const user = req.session.user

  if (!user || user.isLogged === false) {
    res.status(401).end()
    return
  }

  try {
    const response: UserVenturesAPIResponse = await fetchJson(
      `${process.env.UAU_BASEURL_INTEGRATION}/Venda/ConsultarEmpreendimentosCliente`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: user.token,
          'Content-Type': 'application/json',
          'X-INTEGRATION-Authorization': String(process.env.UAU_TOKEN_INTEGRATION),
        },
        body: JSON.stringify({
          codigo_usuario: user.code,
        }),
      }
    )

    res.status(200).json(response)
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.response.status === 401) {
        req.session.destroy()
      }
    }
    res.status(400).json([{ MyTable: [] }])
  }
}

type UserVentures = {
  Empresa_ven: number
  Obra_Ven: string
  Num_Ven: number
  Cliente_Ven: number
  Contrato_Ven: number
  Nome_pes: string
  Descr_obr: string
  EmiteBoleto_CVen: boolean
  Identificador_unid: string
  Empreendimento_ven: string
}

export type UserVenturesAPIResponse = [{ MyTable: UserVentures[] }]

export default withIronSessionApiRoute(venturesRoute, sessionOptions)
