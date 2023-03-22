import { classNames } from '@/utils/classNames'
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'

type FeedbackProps = {
  error: boolean
  message: string
} | null

type DefaultContextProps = {
  setFeedback: (value: FeedbackProps) => void
}

type DefaultProviderProps = {
  children: ReactNode
}

const DefaultContext = createContext<DefaultContextProps>({} as DefaultContextProps)

export default function DefaultProvider({ children }: DefaultProviderProps) {
  const [feedback, setFeedback] = useState<FeedbackProps>(null)

  const toast = useRef<HTMLDivElement>(null)
  const toastIcon = useRef<SVGSVGElement>(null)

  useEffect(() => {
    function start() {
      toast.current?.classList.remove('left-0')
      toast.current?.classList.remove('-translate-x-full')
      toast.current?.classList.add('left-10')
    }
    function end() {
      toast.current?.classList.add('left-0')
      toast.current?.classList.add('-translate-x-full')
      toast.current?.classList.remove('left-10')
    }
    start()
    setTimeout(end, 3000)
  }, [feedback])

  return (
    <DefaultContext.Provider value={{ setFeedback }}>
      {children}
      {feedback !== null && (
        <div
          ref={toast}
          className={classNames(
            feedback.error ? 'bg-red' : 'bg-green',
            'absolute left-0 bottom-10 p-5 rounded-lg shadow-3 text-neutral-light',
            'transition-all -translate-x-full duration-500'
          )}
        >
          <p className="font-bold flex items-center">{feedback.message}</p>
        </div>
      )}
    </DefaultContext.Provider>
  )
}

export function useDefaultContext() {
  const context = useContext(DefaultContext)
  return context
}
