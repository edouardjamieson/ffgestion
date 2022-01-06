import Header from '../components/Header'
import './../styles/styles.css'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getAuth } from '../functions/database/users'
import { useState } from 'react'
import AuthContext from '../components/AuthContext'

function MyApp({ Component, pageProps }) {

  const router = useRouter()

  return (
    <main className="app">
      {/* Balise head */}
      <Head>
        {/* NextJS ajoute par défaut les metas de base (utf8 etc) mais ceci permet d'en ajouter d'autre (ex: du low-level* SEO) */}
        {/* * low-level : le low-level = selectionner body dans css, ça s'applique partout mais très facilement écrasable */}
        <title>FFGestion</title>
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css' />
      </Head>

      <AuthContext>

        {/* Header */}
        <Header />

        {/* Component page-par-page */}
        <Component {...pageProps} />
        
      </AuthContext>

      

    </main>
  )
}

export default MyApp
