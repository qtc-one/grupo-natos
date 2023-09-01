import 'swiper/css'
import 'swiper/css/pagination'

import TemplateDashboard from '@/components/template/Dashboard'
import { Box } from '@/components/ui/atoms/Box'
import { Button } from '@/components/ui/atoms/Button'
import useUser from '@/hooks/useUser'
import useVenturesContent from '@/hooks/useVenturesContent'
import Image from 'next/image'
import nProgress from 'nprogress'
import { useEffect, useState } from 'react'
import { FiDownload } from 'react-icons/fi'
import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

const PostPage = () => {
  const { user } = useUser()
  const ventures = useVenturesContent(user)

  const [isLoading, setLoading] = useState(true)
  const [selectedTab, setTab] = useState<number>(0)

  useEffect(() => {
    nProgress.start()

    if (!ventures.isLoading) {
      setLoading(false)
    }

    nProgress.done()
    nProgress.remove()
  }, [ventures.isLoading])

  return (
    <TemplateDashboard title="Empreendimentos" description="Empreendimentos">
      {ventures.content && ventures.content.length > 0 ? (
        <Box>
          <Swiper spaceBetween={10} slidesPerView="auto">
            {ventures.content?.map((venture, index) => {
              return (
                <SwiperSlide key={index} className="max-w-[200px]">
                  <Button
                    className="w-full text-xs"
                    onClick={() => setTab(index)}
                    isOutline={selectedTab !== index}
                  >
                    {venture.title}
                  </Button>
                </SwiperSlide>
              )
            })}
          </Swiper>

          <div className="relative flex flex-col lg:flex-row gap-10 max-w-[1536px] mt-10">
            <div className="relative lg:w-1/2">
              <div className="sticky top-5">
                <Swiper
                  className="rounded-xl overflow-hidden"
                  spaceBetween={10}
                  slidesPerView="auto"
                  modules={[Pagination]}
                  pagination={{ clickable: true }}
                >
                  <SwiperSlide>
                    <div className="pb-10">
                      <iframe
                        className="w-full h-[360px] rounded-2xl"
                        src={ventures.content?.[selectedTab].video}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </SwiperSlide>
                  {ventures.content?.[selectedTab].images.nodes.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative bg-neutral-light pb-10">
                        <div className="absolute top-0 left-0 right-0 bottom-10 rounded-2xl bg-[rgba(0,0,0,0.2)]"></div>
                        <Image
                          src={image.sourceUrl}
                          width={768}
                          height={384}
                          alt=""
                          className="rounded-2xl"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <h3 className="mt-6 mb-3 text-2xl font-bold">Documentos</h3>
                <ul>
                  <li>
                    <a
                      rel="noreferrer"
                      href={
                        ventures.content?.[selectedTab].title === 'Solar das Águas Park Resort'
                          ? 'https://www.gruponatos.com.br/seu-produto-solar/pasta-tecnica.html'
                          : 'https://www.gruponatos.com.br/seu-produto-olimpia/pasta-tecnica.html'
                      }
                      target="_blank"
                      className="inline-flex items-center gap-2 text-blue"
                      download
                    >
                      <FiDownload /> Pasta Técnica
                    </a>
                  </li>
                  {ventures.content?.[selectedTab].documents.nodes.map((document, index) => (
                    <li key={index}>
                      <a
                        rel="noreferrer"
                        href={document.mediaItemUrl}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-blue"
                        download
                      >
                        <FiDownload /> {document.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="pr-2 pb-7 lg:w-1/2">
              <h2 className="mt-3 mb-6 lg:text-3xl">{ventures.content?.[selectedTab].title}</h2>
              <div
                className="space-y-5 xl:text-lg"
                dangerouslySetInnerHTML={{
                  __html: String(ventures.content?.[selectedTab].content),
                }}
              />
            </div>
          </div>
        </Box>
      ) : (
        <></>
      )}
    </TemplateDashboard>
  )
}

export default PostPage
