import { classNames } from '@/utils/classNames'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

export type NewsCardProps = {
  key?: string
  slug: string
  date: string
  title: string
  image: StaticImageData | string
  isOld?: boolean
}

const style = {
  defaults: {
    body: 'px-5 pt-3 pb-7 bg-blue',
    label: 'block mb-2 text-sm',
    heading: 'h-16 text-ellipsis overflow-hidden font-bold leading-5',
  },
  status: {
    new: {
      body: 'bg-blue',
      label: 'text-neutral-light',
      heading: 'text-neutral-light',
    },
    old: {
      body: 'bg-neutral-light',
      label: 'text-neutral-200',
      heading: 'text-neutral-dark',
    },
  },
}

export const NewsCard = ({ key = '', slug, date, title, image, isOld }: NewsCardProps) => {
  let filterTitle =
    title.length > 50
      ? `${title
          .split(' ')
          .filter((word, index) => index < 10 && word)
          .toString()
          .replaceAll(',', ' ')}...`
      : title

  return (
    <Link href={`/dashboard/news/${slug}`} key={key} legacyBehavior>
      <a>
        <div className="h-72 rounded-xl shadow-1 overflow-hidden my-5">
          <div className="relative w-full h-44">
            <Image src={image} alt="" fill className="object-cover" />
            {!isOld && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-neutral-light text-xs font-bold">
                Destaques
              </span>
            )}
          </div>
          <div
            className={classNames(style.defaults.body, style.status[isOld ? 'old' : 'new'].body)}
          >
            <span
              className={classNames(
                style.defaults.label,
                style.status[isOld ? 'old' : 'new'].label
              )}
            >
              {date}
            </span>
            <p
              className={classNames(
                style.defaults.heading,
                style.status[isOld ? 'old' : 'new'].heading
              )}
            >
              {filterTitle}
            </p>
          </div>
        </div>
      </a>
    </Link>
  )
}
