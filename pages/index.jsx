import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { getAuth } from '../functions/database/users'

export default function Home() {

  const router = useRouter()

  getAuth()
  .then(auth => { if(!auth) router.push('/login') })

  return (
    <Layout
      title="Aujourd'hui"
    >
      
      yo

    </Layout>
  )
}
