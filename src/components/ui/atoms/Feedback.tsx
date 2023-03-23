import { classNames } from '@/utils/classNames'
import { useEffect, useRef } from 'react'

type Props = {
  data: {
    error: boolean
    message: string
  } | null
}

export default function Feedback({ data }: Props) {
  const toast = useRef<HTMLDivElement>(null)

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
  }, [data])

  return (
    <>
      {data !== null && (
        <div
          ref={toast}
          className={classNames(
            data.error ? 'bg-red' : 'bg-green',
            'z-50 absolute left-0 bottom-10 p-5 rounded-lg shadow-3 text-neutral-light',
            'transition-all -translate-x-full duration-500'
          )}
        >
          <p className="font-bold flex items-center">{data.message}</p>
        </div>
      )}
    </>
  )
}
