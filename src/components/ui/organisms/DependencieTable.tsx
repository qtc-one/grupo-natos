import useBoletos from '@/hooks/useBoletos'
import useDependencies from '@/hooks/useDependencies'
import useUser from '@/hooks/useUser'
import { UserVentures } from '@/pages/api/ventures'
import nProgress from 'nprogress'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { AiOutlineBarcode, AiOutlineQrcode } from 'react-icons/ai'

import { Box } from '../atoms/Box'
import Feedback from '../atoms/Feedback'

type Props = {
  show: boolean
  venture: UserVentures
  handleViewPix: (
    company: number,
    building: string,
    sale: number,
    installment: number,
    generalInstallment: number
  ) => Promise<void>
  handleViewBoleto: (bank: number, numBoleto: number) => Promise<void>
}

export default function DependencieTable({
  venture,
  show = false,
  handleViewPix,
  handleViewBoleto,
}: Props) {
  const { user } = useUser()
  const boletos = useBoletos(user)
  const installments = useDependencies(venture.Num_Ven, venture.Empresa_ven, venture.Obra_Ven)

  const [total, setTotal] = useState(0)
  const [dependencies, setDependencies] = useState([])
  const [advanceInstallments, setAdvanceInstallments] = useState<any>([])
  const [feedback, setFeedback] = useState<{
    error: boolean
    message: string
  } | null>(null)

  const last3Months = new Date()
  last3Months.setMonth(new Date().getMonth() - 3)

  useEffect(() => {
    nProgress.start()
    if (!installments.isLoading) {
      const filteredInstallments = installments.data.filter((installment: any) => {
        if (new Date(installment.Data_Prc) < new Date()) {
          return installment
        }
      })

      if (installments.data && installments.data.length > 0) {
        const data = installments.data.filter((installment: any) => {
          return new Date(installment.Data_Prc) > new Date() && installment
        })

        setAdvanceInstallments(data)
      }

      setDependencies(filteredInstallments)
      nProgress.done()
    }
  }, [installments.data, installments.isLoading])

  const simularAntecipacao = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const qtd_installments = event.currentTarget.qtd_parcelas.value.replace(/[^0-9]/g, '')

      if (qtd_installments > advanceInstallments.length) {
        setFeedback({
          error: true,
          message: 'Erro! O número inserido excede o total de parcelas que você pode adiantar',
        })
      } else {
        let tot = advanceInstallments
          .slice(-qtd_installments)
          .reverse()
          .reduce((t: number, v: any) => {
            return t + v.ValorReaj
          }, 0)

        tot = new Intl.NumberFormat('pt-br', {
          style: 'currency',
          currency: 'BRL',
        }).format(tot)

        setTotal(tot)
      }
    },
    [advanceInstallments]
  )

  console.log(installments)

  return (
    <>
      <Feedback data={feedback} />

      {installments.data && installments.data.length > 0 ? (
        <>
          {/* 
            Se a primeira das parcelas a receber for menor que 3 meses, 
            mostrar apenas a parcela do mês e o aviso do jurídico.
          */}
          {new Date(installments.data[1].Data_Prc) > new Date(last3Months.toDateString()) ? (
            <table className="w-full lg:w-4/5 xl:w-1/2 mt-10">
              <thead>
                <tr>
                  <th className="pb-2">Vencimento</th>
                  <th className="pb-2 hidden md:table-cell">N° Venda</th>
                  <th className="pb-2">
                    Valor <span className="hidden md:inline">do documento</span>
                  </th>
                  <th className="pb-2">
                    <span className="hidden md:inline">Meio de</span> Pagamento
                  </th>
                </tr>
              </thead>
              <tbody>
                {boletos.data && (
                  <>
                    {boletos.data.slice(-3).map((boleto, index) => {
                      return (
                        <tr className="text-center" key={index}>
                          <td className="py-1">
                            {new Date(boleto.dataVencimento).toLocaleDateString()}
                          </td>
                          <td className="py-1 hidden md:table-cell">{boleto.numeroVenda}</td>
                          <td className="py-1">R$ {boleto.valorDocumento}</td>
                          <td className="py-1">
                            <span className="inline-flex gap-3 text-xl">
                              {venture.Empresa_ven === 11 || venture.Empresa_ven === 3 ? (
                                <button
                                  onClick={() => {
                                    const item = installments.data.filter((installment: any) => {
                                      return installment.Data_Prc === boleto.dataVencimento
                                    })

                                    handleViewPix(
                                      boleto.codEmpresa,
                                      item[0].Obra_Prc,
                                      item[0].Num_Ven,
                                      item[0].NumParc_Prc,
                                      item[0].NumParcGer_Prc
                                    )
                                  }}
                                  className="inline-flex items-center gap-1"
                                >
                                  <AiOutlineQrcode title="PIX" />
                                  <span className="hidden md:inline text-base">Pix</span>
                                </button>
                              ) : (
                                <></>
                              )}
                              <button
                                onClick={() => handleViewBoleto(boleto.codBanco, boleto.seuNumero)}
                                className="inline-flex items-center gap-1"
                              >
                                <AiOutlineBarcode title="Boleto" />
                                <span className="hidden md:inline text-base">Boleto</span>
                              </button>
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </>
                )}
              </tbody>
            </table>
          ) : (
            <>
              <table className="w-full lg:w-1/2 mt-10">
                <thead>
                  <tr>
                    <th className="pb-2">Parcela</th>
                    <th className="pb-2">Vencimento</th>
                    <th className="pb-2">Valor Reajustado</th>
                  </tr>
                </thead>
                <tbody>
                  {dependencies.map((dependencie: any, index) => {
                    return (
                      <tr className="text-center" key={index}>
                        <td className="py-1">{dependencie.NumParc_Prc}</td>
                        <td className="py-1">
                          {new Date(dependencie.Data_Prc).toLocaleDateString()}
                        </td>
                        <td className="py-1">R$ {dependencie.ValorReaj}</td>
                      </tr>
                    )
                  })}
                  <tr className="text-center">
                    <td></td>
                    <td className="py-1 font-bold">Total</td>
                    <td className="py-1">
                      R${' '}
                      {dependencies.reduce(
                        (total, dependencie: any) => total + dependencie.ValorReaj,
                        0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <Box className="mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 itens-center p-5">
                  <p className="text-center md:text-left text-neutral-200 text-lg">
                    Prezado cliente, lembre-se que após 3 parcelas não pagas você terá que entrar em
                    contato com nossa equipe de suporte para renegociar seu pagamento.
                  </p>
                  <div className="text-right flex items-center justify-center md:justify-end">
                    <a
                      href="tel:(62)3121-7123"
                      className="px-6 py-3 bg-blue rounded-full text-neutral-light font-bold"
                    >
                      Fale Conosco
                    </a>
                  </div>
                </div>
              </Box>
            </>
          )}
        </>
      ) : (
        <></>
      )}
      <Box className="mt-10 ">
        <form onSubmit={simularAntecipacao} className="hidden xl:flex items-center justify-between">
          <span className="flex items-center gap-4">
            <span className="text-lg font-bold">Total: {total}</span>
            <input
              type="number"
              name="qtd_parcelas"
              className="px-5 py-2 bg-neutral-light-100 outline-none rounded-full placeholder:text-neutral-100 text-center"
            />
            {installments.data && (
              <small>Você pode atencipar até {advanceInstallments.length} parcelas</small>
            )}
          </span>
          <button className="px-6 py-2 bg-blue rounded-full text-neutral-light font-bold">
            Simular Antecipação
          </button>
        </form>

        <form onSubmit={simularAntecipacao} className="xl:hidden text-center flex flex-col gap-2">
          <p className="text-xl font-bold">Total: {total}</p>
          <input
            type="number"
            name="qtd_parcelas"
            className="px-5 py-2 bg-neutral-light-100 outline-none rounded-full placeholder:text-neutral-100 text-center"
          />
          <button className="px-6 py-3 bg-blue rounded-full text-neutral-light font-bold">
            Simular Antecipação
          </button>
          {installments.data && (
            <small>Você pode atencipar até {advanceInstallments.length} parcelas</small>
          )}
        </form>
      </Box>
    </>
  )
}
