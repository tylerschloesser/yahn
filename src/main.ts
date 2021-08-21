import firebase from 'firebase'
import { Item, ItemAttributes, List, ListType } from './db'
import crypto from 'crypto'

const firebaseConfig = {
  databaseURL: 'https://hacker-news.firebaseio.com',
}

const app = firebase.initializeApp(firebaseConfig)
const db = app.database()

interface HnUpdates {
  items: number[]
  profiles: string[]
}

{
  const ref = db.ref('/v0/updates')
  ref.on('value', (updatesSnap) => {
    const updates = <HnUpdates>updatesSnap.val()
    console.log(`fetching ${updates.items.length} items`)
    for (const itemId of updates.items) {
      db.ref(`/v0/item/${itemId}`).once('value', async (itemSnap) => {
        const item: ItemAttributes = Object.assign(
          <Partial<ItemAttributes>>{
            deleted: false,
            dead: false,
            url: null,
            title: null,
            kids: null,
            score: null,
            by: null,
          },
          itemSnap.val(),
        )

        try {
          await Item.upsert(item)
        } catch (error) {
          console.error('failed to insert', item, error)
        }
      })
    }
  })
}

const md5 = (str: string) => crypto.createHash('md5').update(str).digest('hex')

db.ref('/v0/topstories').on('value', async (topStoriesSnap) => {
  const topStoryIds = <number[]>topStoriesSnap.val()
  const hash = md5(JSON.stringify(topStoryIds))

  try {
    await List.upsert({
      type: ListType.TopStories,
      item_ids: topStoryIds,
    })
    console.log(`updated topstories (${hash})`)
  } catch (error) {
    console.log('failed to update topstories', error)
  }
})
