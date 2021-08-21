import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React, { Fragment } from 'react'
import styles from '../styles/Home.module.css'

// TODO move this to shared package
export enum ItemType {
  Job = 'job',
  Story = 'story',
  Comment = 'comment',
  Poll = 'poll',
  PollOpt = 'pollopt',
}

// TODO move this to shared package
export interface ItemAttributes {
  id: number
  deleted: boolean
  type: ItemType
  by: string
  time: Date
  text: string | null
  dead: boolean
  parent: number | null
  kids: number[] | null
  url: string | null
  score: number | null
  title: string | null
}

export async function getServerSideProps() {
  const params = Object.entries({
    limit: '30',
  })
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
  const items: ItemAttributes[] = await fetch(
    `http://localhost:3000/topstories?${params}`,
  ).then((res) => res.json())
  return { props: { items } }
}

interface HomeProps {
  items: ItemAttributes[]
}

const withHost = (item: ItemAttributes) => {
  let host: string | null = null
  if (item.url) {
    host = new URL(item.url!).host.split('.').slice(-2).join('.')
  }
  return { ...item, host }
}

const Home: NextPage<HomeProps> = ({ items }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {items.map(withHost).map((item, i) => (
          <Fragment key={item.id}>
            <div className={styles.storyRank}>{i + 1}.</div>
            <div className={styles.story} key={item.id}>
              <div>
                <a
                  href={
                    item.url ??
                    `https://news.ycombinator.com/item?id=${item.id}`
                  }
                >
                  {item.title}
                </a>
                {item.host && (
                  <>
                    {' '}
                    <a
                      className={styles.storyHost}
                      href={`https://news.ycombinator.com/from?site=${item.host}`}
                    >
                      ({item.host})
                    </a>
                  </>
                )}
              </div>
              <div className={styles.storySub}>
                {item.score !== null ? `${item.score} points` : '1 point'}
                {' by '}
                <a href={`https://news.ycombinator.com/user?id=${item.by}`}>
                  {item.by}
                </a>
                {' | '}
                <a href={`https://news.ycombinator.com/item?id=${item.id}`}>
                  {item.kids?.length === 1
                    ? '1 comment'
                    : (item.kids?.length ?? 0) > 0
                    ? `${item.kids!.length} comments`
                    : 'discuss'}
                </a>
              </div>
            </div>
          </Fragment>
        ))}
      </main>
    </div>
  )
}

export default Home
