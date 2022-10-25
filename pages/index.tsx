import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getElectionData } from '../lib/firebase'
import Link from 'next/link'
import { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async () => {
  const allEarlyVotingData = JSON.stringify(getElectionData())
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
        <h2 className={utilStyles.headingLg}>Blog</h2>
      </section>
    </Layout>
  )
}