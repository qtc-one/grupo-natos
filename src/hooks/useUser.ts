import Router from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'

export default function useUser({ redirectTo = '', redirectIfFound = false } = {}) {
  const { data: user, mutate: mutateUser } = useSWR('/api/user')

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLogged) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLogged)
    ) {
      Router.push(redirectTo)
    }
  }, [user, redirectIfFound, redirectTo])

  return { user, mutateUser }
}
