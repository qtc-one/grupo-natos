import { classNames } from '@/utils/classNames'
import { ButtonHTMLAttributes } from 'react'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: 'red' | 'green' | 'blue' | 'white' | 'black'
  isOutline?: boolean
}

export const Button = ({
  color = 'blue',
  className = '',
  children,
  isOutline = false,
  ...rest
}: ButtonProps) => {
  const { button } = theme
  const style = classNames(
    button.box,
    button.border[color],
    isOutline ? button.background.outline : button.background.fill[color],
    isOutline
      ? button.text.outline[color]
      : button.text.fill[color === 'white' ? 'white' : 'default'],
    button.defaults,
    className
  )

  return (
    <button className={`${style}`} {...rest}>
      {children}
    </button>
  )
}

const theme = {
  button: {
    box: 'inline-flex justify-center items-center gap-2 px-10 py-2',
    defaults: 'rounded-full border-2 font-medium transition-all',
    text: {
      fill: {
        default: 'text-neutral-light',
        white: 'text-neutral-dark',
      },
      outline: {
        red: 'text-red',
        blue: 'text-blue',
        green: 'text-green',
        white: 'text-neutral-light',
        black: 'text-neutral-dark',
      },
    },
    border: {
      red: 'border-red',
      blue: 'border-blue',
      green: 'border-green',
      white: 'border-neutral-light',
      black: 'border-neutral-dark',
    },
    background: {
      fill: {
        red: 'bg-red',
        blue: 'bg-blue',
        green: 'bg-green',
        white: 'bg-neutral-light',
        black: 'bg-neutral-dark',
      },
      outline: 'bg-transparent',
    },
  },
}
