import { Button } from '@/components/ui/atoms/Button'
import Feedback from '@/components/ui/atoms/Feedback'
import { Input } from '@/components/ui/atoms/Input'
import { InputPassword } from '@/components/ui/atoms/InputPassword'
import fetchJson from '@/utils/fetchJson'
import { FormEvent, useCallback, useState } from 'react'

export default function CreateAccessPage() {
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
      document: event.currentTarget.document.value,
      password: event.currentTarget.password.value,
      birthdate: new Date(event.currentTarget.birthdate.value).toISOString(),
    }

    try {
      const response = await fetchJson('/api/user/access/create', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
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
          <h1 className="text-3xl md:text-4xl font-medium mb-6">Criar acesso ao portal</h1>
          <p className="text-gray-500 text-lg">
            O acesso ao portal é exclusivo para aqueles que já são nossos clientes.
          </p>

          <form className="mt-10" onSubmit={handleSubmit}>
            <p className="text-left mb-1">Data de nascimento</p>
            <div className="space-y-4">
              <Input type="date" name="birthdate" required />
              <Input type="text" name="document" mask="cpf" placeholder="CPF" required />
              <Input type="text" name="login" placeholder="Login" minLength={6} required />
              <Input type="email" name="email" placeholder="Email" required />
              <InputPassword
                name="password"
                placeholder="Senha"
                minLength={6}
                maxLength={6}
                required
              />
              <div className="space-y-2">
                <Button className="w-full">Criar Acesso</Button>
                {/* <ButtonLink href="/login" className="w-full" color="red" isOutline>
                Cancelar
              </ButtonLink> */}
              </div>
              <small className="block w-4/5 mt-3 mx-auto leading-4">
                Ao clicar em {`"Criar acesso"`} você aceita nossos{' '}
                <span className="text-blue-700 cursor-pointer">termos de uso</span>
              </small>
            </div>
          </form>
        </section>
      </div>
    </>
  )
}
