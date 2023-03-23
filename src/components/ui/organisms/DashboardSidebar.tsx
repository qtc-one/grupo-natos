import Feedback from '@/components/ui/atoms/Feedback'
import NavItem from '@/components/ui/atoms/NavItem'
import NavLink from '@/components/ui/atoms/NavLink'
import useUser from '@/hooks/useUser'
import useVentures from '@/hooks/useVentures'
import BrandNatosN from '@/public/images/brands/natos-n.png'
import BrandNatos from '@/public/images/brands/natos.png'
import { classNames } from '@/utils/classNames'
import fetchJson from '@/utils/fetchJson'
import Image from 'next/image'
import Link from 'next/link'
import nProgress from 'nprogress'
import { ChangeEvent, MouseEventHandler, useCallback, useEffect, useState } from 'react'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { FaTimes } from 'react-icons/fa'

import { BarcodeIcon, FileIcon, HomeIcon, VenturesIcon } from '../atoms/Icons'
import { OverlayLayer } from '../atoms/OverlayLayer'

type Props = {
  isOpen: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
  pathname: string
}

export const DashboardSidebar = ({ isOpen, onClick, pathname }: Props) => {
  const { user } = useUser()
  const ventures = useVentures(user)

  const [linkPDF, setLinkPDF] = useState([''])
  const [yearIRPF, setYearIRPF] = useState<string>('')
  const [showModalPDF, setShowModalPDF] = useState<boolean>(false)
  const [showOverlayer, setShowOverlayer] = useState<boolean>(false)
  const [showIRPFModal, setShowIRPFModal] = useState<boolean>(false)
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false)
  const [showReportOptions, setShowReportOptions] = useState<boolean>(false)
  const [feedback, setFeedback] = useState<{
    error: boolean
    message: string
  } | null>(null)

  useEffect(() => {
    nProgress.start()
    if (!ventures.isLoading) {
      nProgress.done()
    }
  }, [ventures])

  async function getIRPF(
    sale: string,
    building: string,
    company: string,
    year: string
  ): Promise<string> {
    try {
      return await fetchJson('/api/statements/irpf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sale, building, company, year }),
      })
    } catch (error) {
      return ''
    }
  }

  async function getPayments(sale: string, building: string, company: string): Promise<string> {
    try {
      return await fetchJson('/api/statements/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sale, building, company }),
      })
    } catch (error) {
      return ''
    }
  }

  const handleGetPayments = async (sale: string, building: string, company: string) => {
    nProgress.start()

    const response = await getPayments(sale, building, company)
    if (response === '') {
      setFeedback({ error: true, message: 'Erro!' })
      handleCloseModals()
      return
    }
    setLinkPDF([`data:application/pdf;base64,${response}`])
    setShowPaymentModal(false)
    setShowModalPDF(true)

    nProgress.done()
  }

  const handleIRPFSearch = async (sale: string, building: string, company: string) => {
    nProgress.start()

    if (yearIRPF !== '') {
      const response = await getIRPF(sale, building, company, yearIRPF)
      if (response === '') {
        setFeedback({ error: true, message: 'Erro! Ano inválido!' })
        handleCloseModals()
        return
      }
      setLinkPDF([`data:application/pdf;base64,${response}`])
      setShowIRPFModal(false)
      setShowModalPDF(true)
    } else {
      setFeedback({ error: true, message: 'Erro! Informe o ano!' })
    }

    nProgress.done()
  }

  const handleYearChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setYearIRPF(event.currentTarget.value.replace(/\D/g, ''))
  }, [])

  function openIRPFModal() {
    setShowOverlayer(true)
    setShowIRPFModal(true)
  }

  function openPaymentModal() {
    setShowOverlayer(true)
    setShowPaymentModal(true)
  }

  function handleCloseModals() {
    setShowModalPDF(false)
    setShowOverlayer(false)
    setShowIRPFModal(false)
    setShowPaymentModal(false)
  }

  return (
    <>
      {showOverlayer && (
        <OverlayLayer onClick={handleCloseModals} className="z-20 bg-neutral-dark-50" />
      )}

      <Feedback data={feedback} />

      {showIRPFModal && (
        <div className="max-h-96 w-80 pt-14 pb-3 px-4 z-30 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 grid grid-cols-1 gap-3 items-center bg-neutral-light shadow-3 overflow-scroll rounded-lg">
          <button
            onClick={handleCloseModals}
            className="absolute top-3 right-3 p-2 rounded-full bg-neutral-dark-10 text-neutral-dark-30"
          >
            <FaTimes />
          </button>

          <p className="text-center font-bold">Insira um ano:</p>
          <input
            type="number"
            onChange={handleYearChange}
            value={yearIRPF}
            className="px-5 py-2 bg-neutral-light-100 outline-none rounded-full placeholder:text-neutral-100 text-center"
          />

          <p className="mt-4 text-center font-bold">Selecione um empreendimento:</p>
          <div className="grid grid-cols-1 gap-2 -mt-2">
            {ventures.data?.map((venture, index) => {
              if (index > 0) {
                return (
                  <>
                    <button
                      key={index}
                      onClick={() =>
                        handleIRPFSearch(
                          String(venture.Num_Ven),
                          venture.Obra_Ven,
                          String(venture.Empresa_ven)
                        )
                      }
                      className="px-2 py-3 border-b-2 border-neutral-dark-10 text-neutral-200 text-sm"
                    >
                      {venture.Empreendimento_ven}
                    </button>
                  </>
                )
              }
            })}
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="max-h-96 w-80 pt-14 pb-3 px-4 z-30 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 grid grid-cols-1 gap-3 items-center bg-neutral-light shadow-3 overflow-scroll rounded-lg">
          <button
            onClick={handleCloseModals}
            className="absolute top-3 right-3 p-2 rounded-full bg-neutral-dark-10 text-neutral-dark-30"
          >
            <FaTimes />
          </button>

          <p className="mt-4 text-center font-bold">Selecione um empreendimento:</p>
          <div className="grid grid-cols-1 gap-2 -mt-2">
            {ventures.data?.map((venture, index) => {
              if (index > 0) {
                return (
                  <>
                    <button
                      key={index}
                      onClick={() =>
                        handleGetPayments(
                          String(venture.Num_Ven),
                          venture.Obra_Ven,
                          String(venture.Empresa_ven)
                        )
                      }
                      className="px-2 py-3 border-b-2 border-neutral-dark-10 text-neutral-200 text-sm"
                    >
                      {venture.Empreendimento_ven}
                    </button>
                  </>
                )
              }
            })}
          </div>
        </div>
      )}

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

      <aside
        className={`absolute top-0 left-0 bottom-0 w-fit p-5 h-screen bg-neutral-dark z-20 transition-all
          lg:sticky lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-start justify-between">
          <Link href="/dashboard/posts" legacyBehavior>
            <a>
              <Image src={BrandNatos} className="hidden lg:block" alt="" />
              <Image src={BrandNatosN} className="lg:hidden" alt="" />
            </a>
          </Link>

          <button
            onClick={onClick}
            className="lg:hidden p-2 rounded-full bg-neutral-200 text-neutral-light"
          >
            <FaTimes />
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-neutral-200 font-bold">Menu</h2>
          <ul>
            <NavItem className="border-b-2 border-neutral-light-10">
              <NavLink href="/dashboard/news" isActive={pathname.includes('/dashboard/news')}>
                <HomeIcon /> <span>Notícias</span>
              </NavLink>
            </NavItem>
            <NavItem className="border-b-2 border-neutral-light-10">
              <button
                onClick={() => setShowReportOptions(!showReportOptions)}
                className="w-full flex items-center justify-between text-neutral-200 text-lg"
              >
                <span className="flex items-center gap-4">
                  <FileIcon /> <span>Extrato</span>
                </span>
                {!showReportOptions ? <BsChevronDown /> : <BsChevronUp />}
              </button>

              <ul
                className={classNames(
                  showReportOptions ? ' pt-3' : 'h-0 invisible overflow-hidden',
                  'pl-9 text-neutral-200 list-disc'
                )}
              >
                <li>
                  <button onClick={() => openIRPFModal()} className="text-left leading-4">
                    Imposto de Renda
                  </button>
                </li>
                <li>
                  <button onClick={() => openPaymentModal()} className="text-left leading-4">
                    Demonstrativo dos pagamentos
                  </button>
                </li>
              </ul>
            </NavItem>
            <NavItem className="border-b-2 border-neutral-light-10">
              <NavLink
                href="/dashboard/payments"
                isActive={pathname.includes('/dashboard/payments')}
              >
                <BarcodeIcon /> <span>Pagamentos</span>
              </NavLink>
            </NavItem>
            <NavItem className="border-b-2 border-neutral-light-10">
              <NavLink
                href="/dashboard/ventures"
                isActive={pathname.includes('/dashboard/ventures')}
              >
                <VenturesIcon /> <span>Empreendimentos</span>
              </NavLink>
            </NavItem>
          </ul>
        </div>
      </aside>
    </>
  )
}
