import Header from '../components/Header'
import './../styles/styles.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {

  // ====================================================================
  // Regarde si on est login ou affiche les bons components en conséquence
  // ====================================================================
  let isLoggedIn = true
  // Dans le cas ou on est pas login, on peut cancel tout & return la page de login
  let isAdmin = true
  // Après avoir get le login on pourrait voir si l'user est admin ou non & le passer à nos components

  return (
    <main className="app">
      {/* Balise head */}
      <Head>
        {/* NextJS ajoute par défaut les metas de base (utf8 etc) mais ceci permet d'en ajouter d'autre (ex: du low-level* SEO) */}
        {/* * low-level : le low-level = selectionner body dans css, ça s'applique partout mais très facilement écrasable */}
        <title>FFGestion</title>
      </Head>

      {/* Header */}
      <Header isUserAdmin={isAdmin} />

      {/* Component page-par-page */}
      <Component {...pageProps} />

    </main>
  )
}

export default MyApp
