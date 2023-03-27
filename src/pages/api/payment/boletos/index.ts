import { sessionOptions } from '@/configs/session'
import fetchJson, { FetchError } from '@/utils/fetchJson'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

async function boletosRoute(req: NextApiRequest, res: NextApiResponse<Boleto[]>) {
  const user = req.session.user

  if (!user || user.isLogged === false) {
    res.status(401).end()
    return
  }

  try {
    const response: Boleto[] = await fetchJson(
      `${process.env.UAU_BASEURL_INTEGRATION}/BoletoServices/ConsultarBoletosDoCliente`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: user.token,
          'Content-Type': 'application/json',
          'X-INTEGRATION-Authorization': String(process.env.UAU_TOKEN_INTEGRATION),
        },
        body: JSON.stringify({
          usuario: user.username,
          codPessoa: user.code,
          naoMostraBoletoVencido: false,
          tipo_usuario: 1,
        }),
      }
    )

    res.status(200).json(response)
  } catch (error) {
    res.status(400).json([])
  }
}

export type Boleto = {
  dataEmissao: string
  valorDocumento: number
  codBanco: number
  seuNumero: number
  dataVencimento: string
  localPgto: string
  linhaDigitavel: string
  dataGeracao: string
  agCodCedente: string
  nossoNumero: string
  instrucao: string
  carteira: string
  campoLivre: string
  nomeBanco: string
  descricaoEmpresa: string
  descricaoObra: string
  codEmpresa: number
  obraParcela: string
  numeroVenda: number
  dataEnvioPorEmail: string
  dataReenvioPorEmail: string
  boletoEnviado: string
}

export default withIronSessionApiRoute(boletosRoute, sessionOptions)
