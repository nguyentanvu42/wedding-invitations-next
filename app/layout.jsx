import { AntdRegistry } from '@ant-design/nextjs-registry'
import { WeddingProvider } from '@/contexts/WeddingContext'
import 'antd/dist/reset.css'
import './globals.css'

export const metadata = {
  title: 'Thiệp Cưới',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <AntdRegistry>
          <WeddingProvider>
            {children}
          </WeddingProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
