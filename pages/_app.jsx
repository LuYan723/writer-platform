import Head from "next/head";

export default function App({ Component, pageProps }) {
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
      </Head>
      <Component {...pageProps} />
    </>
  );
}
