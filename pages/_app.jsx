import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SmoothScroll } from "@/components/MotionKit";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [routing, setRouting] = useState(false);
  useEffect(() => {
    const first = String(router.asPath || "/").split("/")[1] || "";
    document.documentElement.lang = first === "en" ? "en" : "zh-CN";
  }, [router.asPath]);
  useEffect(() => {
    const start = () => setRouting(true);
    const end = () => setRouting(false);
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
    };
  }, [router.events]);
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/img/seal-zh.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var s=JSON.parse(localStorage.getItem('writer-palette')||'{}');if(s&&s.palette)document.documentElement.setAttribute('data-palette',s.palette)}catch(e){}"
          }}
        />
        <link rel="stylesheet" href="/styles/tokens.css" />
        <link rel="stylesheet" href="/styles/site.css" />
        <link rel="stylesheet" href="/styles/admin.css" />
        <link rel="stylesheet" href="/styles/editorial.css" />
      </Head>
      <SmoothScroll>
        <div className={routing ? "route-progress active" : "route-progress"} aria-hidden="true" />
        <div className={routing ? "route-veil active" : "route-veil"} aria-hidden="true">
          <span className="route-beam" />
        </div>
        <Component {...pageProps} />
      </SmoothScroll>
    </>
  );
}
