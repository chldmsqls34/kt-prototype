import Banner from '@/components/common/banner/banner'
import TabMenu from '@/components/common/tab-menu2'
import { MEDIA_BANNER_DATA } from '@/contants'

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Banner>
        <Banner.Heading
          title={MEDIA_BANNER_DATA['/highlight'].title}
          subtitle={MEDIA_BANNER_DATA['/highlight'].description}
        />
        <TabMenu tabs={MEDIA_BANNER_DATA['/highlight'].tabs} />
      </Banner>
      <div> {children}</div>
    </div>
  )
}

export default Layout