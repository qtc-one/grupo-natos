import Link from 'next/link'
import { useState } from 'react'
import { BsChatRightDotsFill, BsEnvelope } from 'react-icons/bs'
import { FaTimes } from 'react-icons/fa'
import { FiChevronRight } from 'react-icons/fi'
import { ImWhatsapp } from 'react-icons/im'

export const ContactOptions = () => {
  const [isVisible, setVisibility] = useState<boolean>(false)

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <button
        onClick={() => setVisibility(!isVisible)}
        className="inline-grid place-content-center w-16 h-16 rounded-full shadow-[0_0_26px_rgba(0,0,0,0.11)] bg-blue text-neutral-light text-2xl"
      >
        {isVisible ? <FaTimes /> : <BsChatRightDotsFill />}
      </button>
      <ul
        className={`rounded-xl shadow-[0px_0px_19px_rgba(0,0,0,0.25)] right-0 bottom-20 w-80 bg-neutral-light z-20 ${
          isVisible ? 'absolute' : 'hidden'
        }`}
      >
        <li className="px-4 py-5">
          <a
            href="https://api.whatsapp.com/send?phone=5562999392057&text=Ol%C3%A1"
            className="relative flex items-center gap-3"
          >
            <span className="grid place-content-center w-10 h-10 rounded-full bg-green text-xl text-neutral-light">
              <ImWhatsapp />
            </span>
            <span>
              <strong className="text-lg font-bold leading-4 block">Whatsapp Atendimento</strong>
              <small>Fale conosco através do Whatsapp</small>
            </span>
            <FiChevronRight className="absolute right-0 text-3xl" />
          </a>
        </li>
        <li className="border-t-2 border-neutral-dark-10"></li>
        <li className="px-4 py-5">
          <a
            href="https://api.whatsapp.com/send?phone=5562996915677&text=Ol%C3%A1"
            className="relative flex items-center gap-3"
          >
            <span className="grid place-content-center w-10 h-10 rounded-full bg-green text-xl text-neutral-light">
              <ImWhatsapp />
            </span>
            <span>
              <strong className="text-lg font-bold leading-4 block">Whatsapp Cobrança</strong>
              <small>Fale conosco através do Whatsapp</small>
            </span>
            <FiChevronRight className="absolute right-0 text-3xl" />
          </a>
        </li>
        <li className="border-t-2 border-neutral-dark-10"></li>
        <li className="px-4 py-5">
          <Link href="/dashboard/contact" legacyBehavior>
            <a className="relative flex items-center gap-3">
              <span className="grid place-content-center w-10 h-10 rounded-full bg-red text-xl text-neutral-light">
                <BsEnvelope />
              </span>
              <span>
                <strong className="text-lg font-bold leading-4 block">Email</strong>
                <small>Fale conosco através do Email</small>
              </span>
              <FiChevronRight className="absolute right-0 text-3xl" />
            </a>
          </Link>
        </li>
      </ul>
    </div>
  )
}
