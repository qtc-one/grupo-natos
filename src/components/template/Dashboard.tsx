import useUser from '@/hooks/useUser'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'

import { OverlayLayer } from '../ui/atoms/OverlayLayer'
import { ContactOptions } from '../ui/organisms/ContactOptions'
import { DashboardHeader } from '../ui/organisms/DashboardHeader'
import { DashboardSidebar } from '../ui/organisms/DashboardSidebar'

type Props = {
  title: string
  description: string
  children: ReactNode
}

export default function TemplateDashboard({ title, description, children }: Props) {
  const { user } = useUser({ redirectTo: '/login' })
  const { asPath } = useRouter()
  const [showSidebar, setSidebarVisibility] = useState<boolean>(false)

  let username = ''
  if (user?.name) {
    username = user?.name?.split(' ')[0].toLowerCase()
    username = username[0].toUpperCase() + username.substring(1)
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <div className="relative flex">
        {showSidebar && <OverlayLayer onClick={() => setSidebarVisibility(false)} />}

        <DashboardSidebar
          isOpen={showSidebar}
          onClick={() => setSidebarVisibility(false)}
          pathname={asPath}
        />

        <div className="w-full min-h-screen">
          <DashboardHeader
            title={title}
            username={`Olá, ${username}!`}
            handleSidebar={() => setSidebarVisibility(true)}
          />

          <main>{children}</main>
        </div>

        <ContactOptions />
      </div>
    </>
  )
}
