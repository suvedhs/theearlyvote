import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async () => {
  const allEarlyVotingData = {}
  return {
    props: {
      allEarlyVotingData,
    },
  };
}

export default function Home({
  allEarlyVotingData
}) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Live in Texas? Enter your address and find your nearest polling locations.</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <form action="/api/form" method="post">
          <label htmlFor="address">Polling Place Search</label><br/>
          <input type="text" id="address" name="address" /><br/>
          <button type="submit">Submit</button>
        </form>
      </section>
    </Layout>
  )
}