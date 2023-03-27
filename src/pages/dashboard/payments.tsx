import 'swiper/css'

import TemplateDashboard from '@/components/template/Dashboard'
import { Box } from '@/components/ui/atoms/Box'
import { Button } from '@/components/ui/atoms/Button'
import Feedback from '@/components/ui/atoms/Feedback'
import { OverlayLayer } from '@/components/ui/atoms/OverlayLayer'
import DependencieTable from '@/components/ui/organisms/DependencieTable'
import useUser from '@/hooks/useUser'
import useVentures from '@/hooks/useVentures'
import fetchJson from '@/utils/fetchJson'
import nProgress from 'nprogress'
import { useEffect, useState } from 'react'
import { AiOutlineLike } from 'react-icons/ai'
import { FaTimes } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'

export default function DependenciesPage() {
  const { user } = useUser()
  const ventures = useVentures(user)

  const [linkPDF, setLinkPDF] = useState([''])
  const [isLoading, setLoading] = useState(true)
  const [selectedTab, setTab] = useState<number>(0)
  const [pixImage, setPixImage] = useState<string>('')
  const [showModalPDF, setShowModalPDF] = useState<boolean>(false)
  const [showOverlayer, setShowOverlayer] = useState<boolean>(false)
  const [modalPixIsVisible, setModalPixVisibility] = useState<boolean>(false)
  const [feedback, setFeedback] = useState<{
    error: boolean
    message: string
  } | null>(null)

  useEffect(() => {
    nProgress.start()

    if (!ventures.isLoading) {
      setLoading(false)
    }

    if (!isLoading) {
      if (ventures.data && ventures.data.length > 1) {
        setTab(ventures.data[1].Num_Ven)
      }

      nProgress.done()
    }

    nProgress.done()
  }, [ventures.data, ventures.isLoading, isLoading])

  async function getBoletoPDF(bank: number, numBoleto: number): Promise<string> {
    try {
      return await fetchJson('/api/payment/boletos/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bank, numBoleto }),
      })
    } catch (error) {
      return ''
    }
  }

  async function getPixImage(
    company: number,
    building: string,
    sale: number,
    installment: number,
    generalInstallment: number
  ): Promise<string> {
    try {
      const generatePix: any = await fetchJson('/api/payment/pix/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, building, sale, installment, generalInstallment }),
      })

      console.log(generatePix)

      return ''
    } catch (error) {
      return ''
    }
  }

  async function handleViewPix(
    company: number,
    building: string,
    sale: number,
    installment: number,
    generalInstallment: number
  ) {
    nProgress.start()
    const response = await getPixImage(company, building, sale, installment, generalInstallment)
    setPixImage(response)
    setModalPixVisibility(true)
    nProgress.done()
  }

  async function handleViewBoleto(bank: number, numBoleto: number) {
    nProgress.start()
    const response = await getBoletoPDF(bank, numBoleto)
    if (response === '') {
      setFeedback({ error: true, message: 'Erro! Tente novamente!' })
      handleCloseModals()
      return
    }
    setLinkPDF([`data:application/pdf;base64,${response}`])
    setShowModalPDF(true)

    nProgress.done()
  }

  function handleCloseModals() {
    setShowModalPDF(false)
    setShowOverlayer(false)
  }

  return (
    <TemplateDashboard title="Pagamento" description="Parcelas a pagar">
      {showOverlayer && (
        <OverlayLayer onClick={handleCloseModals} className="z-20 bg-neutral-dark-50" />
      )}

      <Feedback data={feedback} />

      {showModalPDF && (
        <div className="w-full h-full pt-14 pb-3 px-4 z-30 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 grid grid-cols-1 gap-3 items-center bg-neutral-light shadow-3 overflow-scroll rounded-lg">
          <button
            onClick={handleCloseModals}
            className="absolute top-3 right-3 p-2 rounded-full bg-neutral-dark-10 text-neutral-dark-30"
          >
            <FaTimes />
          </button>

          {linkPDF.length === 1 ? (
            <embed src={linkPDF[0]} className="w-full h-full" />
          ) : (
            <div className="flex flex-col gap-10">
              {linkPDF.map((link, index) => (
                <embed key={index} src={link} className="w-full h-full" />
              ))}
            </div>
          )}
        </div>
      )}

      {!isLoading && (
        <>
          {ventures.data && ventures.data.length > 1 ? (
            <>
              <div className="m-5 p-5">
                <Swiper spaceBetween={10} slidesPerView="auto">
                  {ventures.data?.map((venture, index) => {
                    return (
                      index > 0 && (
                        <SwiperSlide key={index} className="max-w-xs px-5 md:max-w-sm">
                          <Button
                            className="text-xs"
                            isOutline={selectedTab !== venture.Num_Ven}
                            onClick={() => setTab(venture.Num_Ven)}
                          >
                            {venture.Empreendimento_ven}
                          </Button>
                        </SwiperSlide>
                      )
                    )
                  })}
                </Swiper>

                {ventures.data?.map((venture, index) => {
                  return (
                    index > 0 && (
                      <DependencieTable
                        key={index}
                        show={selectedTab === venture.Num_Ven}
                        venture={venture}
                        handleViewPix={handleViewPix}
                        handleViewBoleto={handleViewBoleto}
                      />
                    )
                  )
                })}
              </div>
            </>
          ) : (
            <div className="w-full h-96 flex justify-center items-end">
              <div className="flex flex-col items-center opacity-40 text-center">
                <AiOutlineLike className="text-slate-600 text-9xl" />
                <h2 className="text-3xl font-medium text-slate-600">
                  Você não possui pagamentos pendentes!
                </h2>
              </div>
            </div>
          )}
        </>
      )}
    </TemplateDashboard>
  )
}
