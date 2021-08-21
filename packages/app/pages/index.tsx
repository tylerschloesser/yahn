import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React, {Fragment} from 'react'
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
    'type': 'eq.story',
    'dead': 'eq.false',
    'deleted': 'eq.false',
    'order': 'time.desc',
    'limit': '10',
  }).map(([k, v]) => `${k}=${v}`)
    .join('&')
  const items: ItemAttributes[] = await fetch(`http://localhost:3000/items?${params}`)
    .then(res => res.json())
  return { props: { items } }
}

interface HomeProps {
  items: ItemAttributes[]
}

const withHost = (item: ItemAttributes) => {
  const { host } = new URL(item.url!)
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
        {items
          .map(withHost)
          .map((item, i) => (
          <Fragment key={item.id}>
            <div className={styles.storyRank}>{i + 1}.</div>
            <div className={styles.item} key={item.id}>
              <div>
                <a href={item.url!}>{item.title}</a> <a className={styles.storyHost} href={`https://news.ycombinator.com/from?site=${item.host}`}>({item.host})</a>
              </div>
              <div>
                {item.score !== null ? `${item.score} points` : '1 point'}
                {' by '}
                <a href={`https://news.ycombinator.com/user?id=${item.by}`}>{item.by}</a>
              </div>
            </div>
          </Fragment>
        ))}
      </main>
    </div>
  )
}

export default Home
