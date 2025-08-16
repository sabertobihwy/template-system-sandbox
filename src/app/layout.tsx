import { generateCdnUrl } from '@/lib/theme-loader/getManifest';
import {
  getManifests,
  buildHeadTags
} from '../lib/theme-loader'
import { ReactBridge } from '@/lib/theme-loader/utils/ReactBridge';

// app/layout.tsx
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const themeName = /* 从域名/headers 解析 */ 'cool';
  const scenes = /* SSR 解析 */['shop'];
  const current = /* 当前路由对应场景 */      'shop';
  const version = 'v1';
  const cdnBase = 'https://theme-system.pages.dev'

  const cdnUrl = generateCdnUrl(cdnBase)

  const { vendor, theme } = await getManifests(themeName, version, cdnUrl);

  const { importMapJson, links } = buildHeadTags({
    cdnBase,
    cdnUrl,
    themeName,
    vendor,
    theme,
    scenes,
    currentScene: current,
    cssFetchPriority: 'high',
    strategy: 'conservative', // 或 'aggressive'
  });

  return (
    <html lang="zh-CN">
      <head>
        <script type="importmap" dangerouslySetInnerHTML={{ __html: importMapJson }} />
        {links.map((t, i) => {
          if (t.tag === 'link') {
            return (
              <link
                key={i}
                rel={t.rel}
                href={t.href}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                as={(t as any).as} // undefined: ignore
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                crossOrigin={(t as any).crossOrigin}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fetchPriority={(t as any).fetchPriority}
              />
            );
          }
          if (t.tag === 'meta') {
            return <meta key={i} name={t.name} content={t.content} />;
          }
          return null;
        })}
      </head>
      <body>
        <ReactBridge />
        {children}
      </body>
    </html>
  );
}

