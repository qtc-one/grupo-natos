import { sessionOptions } from '@/configs/session'
import fetchJson from '@/utils/fetchJson'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

async function GeneratePixRoute(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user
  const { company, building, sale, installment, generalInstallment } = req.body

  if (!user || user.isLogged === false) {
    res.status(401).end()
    return
  }

  try {
    const uau_user_token: string = await fetchJson(
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
          UsuarioUAUSite: 'string',
        }),
      }
    )

    const response: any = await fetchJson(
      `${process.env.UAU_BASEURL_INTEGRATION}/Pix/GerarCobrancaVenda`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: uau_user_token,
          'Content-Type': 'application/json',
          'X-INTEGRATION-Authorization': String(process.env.UAU_TOKEN_INTEGRATION),
        },
        body: JSON.stringify({
          DataDeCalculo: new Date().toISOString(),
          Antecipar: false,
          UsarPadraoPixAvulso: false,
          AgruparParcelas: false,
          PadraoCobranca: 8,
          Parcelas: [
            {
              Empresa: company,
              Obra: building,
              NumeroVenda: sale,
              NumeroParcela: installment,
              TipoParcela: 'P',
              NumeroParcelaGeral: generalInstallment,
              ValorDesconto: 0,
            },
          ],
        }),
      }
    )

    res.status(200).json(response)
  } catch (error) {
    res.status(400).json(error)
  }
}

export default withIronSessionApiRoute(GeneratePixRoute, sessionOptions)
