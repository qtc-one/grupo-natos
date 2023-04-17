import { Button } from '@/components/ui/atoms/Button'
import Feedback from '@/components/ui/atoms/Feedback'
import { Input } from '@/components/ui/atoms/Input'
import fetchJson from '@/utils/fetchJson'
import { FormEvent, useCallback, useState } from 'react'

export default function RecoverAccessPage() {
  const [feedback, setFeedback] = useState<{ error: boolean; message: string } | null>(null)
  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (event.currentTarget.login.value.length < 9 || event.currentTarget.login.value > 30) {
      setFeedback({
        error: true,
        message: 'Erro! O login deve possuir entre 9 e 30 dígitos.',
      })
      return
    }

    const body = {
      email: event.currentTarget.email.value,
      login: event.currentTarget.login.value,
    }

    try {
      const response = await fetchJson('/api/user/access/recover', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      console.log(response)
    } catch (error) {
      setFeedback({
        error: true,
        message: 'Erro! Os dados inseridos não correspondem a um cliente Natos!',
      })
    }
  }, [])

  return (
    <>
      <Feedback data={feedback} />

      <div className="container flex justify-center items-end md:items-center pt-10 px-5 lg:px-28 xl:px-56">
        <section className="text-center max-w-sm">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Recuperação de senha</h1>

          <form className="mt-10" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input type="text" name="login" placeholder="Login" minLength={6} required />
              <Input type="email" name="email" placeholder="Email" required />

              <div className="space-y-2">
                <Button className="w-full">Recuperar</Button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </>
  )
}
