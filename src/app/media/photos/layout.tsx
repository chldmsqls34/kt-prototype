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
          title={MEDIA_BANNER_DATA['/photos'].title}
          subtitle={MEDIA_BANNER_DATA['/photos'].description}
        />
        <TabMenu tabs={MEDIA_BANNER_DATA['/photos'].tabs} />
      </Banner>
      <div> {children}</div>
    </div>
  )
}

export default Layout
