import TemplateDashboard from '@/components/template/Dashboard'
import { NewsCard } from '@/components/ui/molecules/NewsCard'
import useArticles from '@/hooks/useArticles'
import useUser from '@/hooks/useUser'
import { Article } from '@/pages/api/articles'
import nProgress from 'nprogress'
import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

export default function NewsPage() {
  const { user } = useUser()
  const articles = useArticles(user)

  const [featuresArticles, setFeaturesArticles] = useState<Article[]>([])
  const [comomArticles, setComomArticles] = useState<Article[]>([])

  useEffect(() => {
    nProgress.start()
    if (!articles.isLoading) {
      if (articles.data && articles.data?.length > 0) {
        setFeaturesArticles(
          articles.data.filter((article) => {
            if (
              article.categories.nodes.findIndex((category) => category.name === 'Destaques') !== -1
            ) {
              return article
            }
          })
        )

        setComomArticles(
          articles.data.filter((article) => {
            if (
              article.categories.nodes.findIndex((category) => category.name === 'Destaques') === -1
            ) {
              return article
            }
          })
        )
      }

      nProgress.done()
    }
  }, [articles.isLoading, articles.data])

  return (
    <TemplateDashboard title="Notícias" description="">
      <section className="m-5 p-5 rounded-xl bg-neutral-light">
        {featuresArticles.length > 0 && (
          <>
            <h2 className="text-3xl font-bold">Novidades</h2>
            <Swiper spaceBetween={20} slidesPerView="auto">
              {featuresArticles.map((post, index) => {
                return (
                  <SwiperSlide className="max-w-xs" key={String(index)}>
                    <NewsCard
                      slug={post.slug}
                      date={`${new Date(post.date).getDate()}/${
                        new Date(post.date).getMonth() + 1
                      }/${new Date(post.date).getFullYear()}`}
                      title={post.title}
                      image={post.featuredImage.node.sourceUrl}
                    />
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </>
        )}
      </section>
      <section className="m-5 p-5 rounded-xl bg-neutral-light">
        {comomArticles.length > 0 && (
          <>
            <h2 className="text-3xl font-bold">Notícias anteriores</h2>
            <Swiper spaceBetween={20} slidesPerView="auto">
              {comomArticles.map((post, index) => {
                return (
                  <SwiperSlide className="max-w-xs" key={String(index)}>
                    <NewsCard
                      slug={post.slug}
                      date={`${new Date(post.date).getDate()}/${
                        new Date(post.date).getMonth() + 1
                      }/${new Date(post.date).getFullYear()}`}
                      title={post.title}
                      image={post.featuredImage.node.sourceUrl}
                      isOld
                    />
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </>
        )}
      </section>
    </TemplateDashboard>
  )
}
