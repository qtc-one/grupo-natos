import TemplateDashboard from '@/components/template/Dashboard'
import { Box } from '@/components/ui/atoms/Box'
import useArticleBySlug from '@/hooks/useArticleBySlug'
import useUser from '@/hooks/useUser'
import Image from 'next/image'
import { useRouter } from 'next/router'

const PostPage = () => {
  const { user } = useUser()
  const { slug } = useRouter().query
  const { data, isLoading } = useArticleBySlug(user, String(slug))

  return (
    <TemplateDashboard title="Notícia" description="Notícia">
      <Box>
        {isLoading ? (
          <p>carregando...</p>
        ) : (
          <div className="relative flex flex-col lg:flex-row gap-10 max-w-[1536px]">
            <div className="relative lg:w-1/2">
              <div className="sticky top-5 rounded-xl overflow-hidden">
                <Image
                  src={String(data?.featuredImage.node.sourceUrl)}
                  width={768}
                  height={384}
                  alt=""
                />
              </div>
            </div>
            <div className="pr-2 pb-7 lg:w-1/2">
              <span className="text-gray-500">
                {new Date(String(data?.date)).toLocaleDateString()}
              </span>
              <h2 className="mt-3 mb-6 text-2xl lg:text-3xl">{data?.title}</h2>
              <div
                className="space-y-5 xl:text-lg"
                dangerouslySetInnerHTML={{ __html: String(data?.content) }}
              />
            </div>
          </div>
        )}
      </Box>
    </TemplateDashboard>
  )
}

export default PostPage
