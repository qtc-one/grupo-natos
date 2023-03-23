import { classNames } from '@/utils/classNames'
import { MouseEventHandler } from 'react'

type Props = {
  onClick: MouseEventHandler<HTMLDivElement>
  className?: string
}

export const OverlayLayer = ({ className = '', onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className={classNames('absolute top-0 left-0 right-0 bottom-0 z-20', className)}
    ></div>
  )
}
