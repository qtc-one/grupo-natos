import DefaultProvider from '@/contexts/Default'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function TemplateDefault({ children }: Props) {
  return <DefaultProvider>{children}</DefaultProvider>
}
