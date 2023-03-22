import { useDefaultContext } from '@/contexts/Default'
import useUser from '@/hooks/useUser'
import fetchJson from '@/utils/fetchJson'
import Link from 'next/link'
import { FormEvent, useCallback, useEffect, useState, useRef } from 'react'
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri'

export default function LoginPage() {
  const { setFeedback } = useDefaultContext()
  const inputUsername = useRef<HTMLInputElement>(null)
  const [passowrdIsVisible, setPassowrdVibility] = useState<boolean>(false)
  const { mutateUser } = useUser({
    redirectTo: '/dashboard/news',
    redirectIfFound: true,
  })

  useEffect(() => {
    inputUsername.current?.focus()
  }, [inputUsername])

  const handleLogin = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const username = event.currentTarget.username.value
      const password = event.currentTarget.password.value

      if (username === '' || password === '') {
        setFeedback({ error: true, message: 'Erro! Preencha os campos login e senha!' })
        return
      }

      try {
        mutateUser(
          await fetchJson('/api/session/login', {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          })
        )

        setFeedback({ error: false, message: 'Sucesso!' })
      } catch (error) {
        console.error(error)
        setFeedback({ error: true, message: 'Erro! Usuário e/ou senha inválidos!' })
      }
    },
    [mutateUser, setFeedback]
  )

  return (
    <section className="min-h-screen grid place-content-center p-8">
      <div className="flex gap-20">
        <div className="max-w-md">
          <h1 className="sr-only">Login</h1>
          <h2 className="mb-3 text-4xl font-bold">Olá, cliente Natos!</h2>
          <p className="mb-8 text-neutral-100 text-lg leading-6">
            O Portal do cliente é um espaço criado para você que adquiriu seu apartamento de lazer
            compartilhado.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col">
            <div className="flex flex-col space-y-3 mb-6">
              <input
                ref={inputUsername}
                type="text"
                name="username"
                placeholder="Login"
                className="px-5 py-3 w-full bg-neutral-light-100 placeholder:text-neutral-100 outline-none rounded-full"
              />
              <div className="relative">
                <input
                  type={passowrdIsVisible ? 'text' : 'password'}
                  name="password"
                  placeholder="Senha"
                  className="px-5 py-3 w-full bg-neutral-light-100 placeholder:text-neutral-100 outline-none rounded-full"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-100 text-lg">
                  {passowrdIsVisible ? (
                    <RiEyeLine
                      className="cursor-pointer"
                      onClick={() => setPassowrdVibility(!passowrdIsVisible)}
                    />
                  ) : (
                    <RiEyeCloseLine
                      className="cursor-pointer"
                      onClick={() => setPassowrdVibility(!passowrdIsVisible)}
                    />
                  )}
                </span>
              </div>
            </div>
            <Link href="/access/recover" className="mb-3 text-neutral-200 font-bold">
              Esqueceu a senha?
            </Link>
            <button className="py-3 bg-blue border-2 border-blue rounded-full text-neutral-light font-bold">
              Entrar
            </button>
            <Link
              href="/access/create"
              className="lg:hidden mt-3 text-center text-neutral-200 font-bold"
            >
              Primeiro acesso? <span className="text-blue">Registrar</span>
            </Link>
          </form>
        </div>
        <div className="hidden lg:block max-w-md">
          <h2 className="mb-7 font-bold text-4xl">Já é cliente mas é seu primeiro acesso?</h2>
          <p className="mb-4 text-neutral-100 text-lg leading-6">
            Siga o link abaixo e faça seu cadastro com senha para acessar sua área restrita em nosso
            portal!
          </p>
          <p className="mb-4 text-neutral-100 text-lg leading-6">
            &quot;Ao encaminhar minhas informações, declaro estar ciente que meus dados pessoais
            serão tratados conforme a{' '}
            <Link href="/privacy-policy" className="text-blue">
              Política de Privacidade
            </Link>
            .&quot;
          </p>
          <Link
            href="/access/create"
            className="py-3 px-5 inline-flex bg-neutral-dark text-neutral-light rounded-full"
          >
            Criar acesso
          </Link>
        </div>
      </div>
    </section>
  )
}
