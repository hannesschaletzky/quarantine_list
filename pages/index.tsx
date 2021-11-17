import type { NextPage } from 'next'
import Head from 'next/head'

import { Button } from '@/styles/UI_Elements'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Amazing Boilerplate</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="bg-gray-500">
        HELLO WORLD
      </div>
      <Button>
        Press me...
      </Button>
    </div>
  )
}

export default Home
