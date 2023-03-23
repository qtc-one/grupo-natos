import { sessionOptions, UserSession } from '@/configs/session'
import fetchJson from '@/utils/fetchJson'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

async function userRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    try {
      const {
        '0': { dadospessoais },
      }: ApiResponseUserLogged = await fetchJson(
        `${process.env.UAU_BASEURL_INTEGRATION}/Autenticador/ConsultarDadosUsrLogado`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: String(req.session.user.token),
            'X-INTEGRATION-Authorization': String(process.env.UAU_TOKEN_INTEGRATION),
          },
        }
      )

      const user = {
        ...req.session.user,
        name: dadospessoais[1].nome,
        code: dadospessoais[1].codigo,
        email: dadospessoais[1].email,
        document: dadospessoais[1].cpf,
        isLogged: true,
      } as UserSession

      req.session.user = user
      await req.session.save()
      res.json(user)
    } catch (error) {
      res.status(500).json(error)
    }
  } else {
    res.json({
      code: 0,
      name: '',
      token: '',
      username: '',
      email: '',
      phones: [],
      birthdate: new Date(),
      document: '',
      isLogged: false,
    })
  }
}

type ApiResponseUserLogged = [
  { dadospessoais: UserPersonalData[] },
  { dadostelefone: UserPhoneData[] },
  { dadosendereco: UserAddressData[] }
]

type UserPersonalData = {
  cpf: string
  nome: string
  email: string
  login: string
  senha: string
  dtnasc: Date
  codigo: number
}

type UserPhoneData = {
  ddd: string
  tipo: number
  ramal: string
  codigo: number
  numero: string
}

type UserAddressData = {
  uf: string
  cep: string
  codPes: number
  numero: string
  bairro: string
  cidade: string
  endereco: string
  referencia: string
  complemento: string
  tipoEndereco: number
}

export default withIronSessionApiRoute(userRoute, sessionOptions)
