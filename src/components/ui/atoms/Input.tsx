import { classNames } from '@/utils/classNames'
import handleFormMasks, { availableMasks } from '@/utils/masks'
import { InputHTMLAttributes, KeyboardEvent, useCallback } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  mask?: availableMasks
}

export const Input = ({ mask, type, disabled, ...rest }: Props) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, mask: availableMasks) => handleFormMasks(e, mask),
    []
  )

  return (
    <input
      type={type}
      className={classNames(
        disabled ? 'text-neutral-200 cursor-not-allowed' : '',
        'w-full px-4 py-2 border-2 border-transparent rounded-full outline-none bg-neutral-light-100 text-lg'
      )}
      onKeyDown={(e) => {
        if (type === 'email') handleKeyDown(e, 'email')
        else if (mask !== undefined) handleKeyDown(e, mask)
      }}
      disabled={disabled}
      {...rest}
    />
  )
}
