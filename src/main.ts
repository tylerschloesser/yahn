import firebase from 'firebase'
import {Item, ItemAttributes} from './db'

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
  ref.on('value', updatesSnap => {
    const updates = <HnUpdates>updatesSnap.val()
    console.log(`fetching ${updates.items.length} items`)
    for (const itemId of updates.items) {
      db.ref(`/v0/item/${itemId}`).once('value', async itemSnap => {
        const item: ItemAttributes = Object.assign(<Partial<ItemAttributes>>{
          deleted: false,
          dead: false,
          url: null,
          title: null,
          kids: null,
        }, itemSnap.val())

        // TODO figure out why this is null?
        if (item.by === null) {
          console.log(`item.by is null? skipping`, item)
          return
        }

        try {
          await Item.upsert(item)
        } catch (error) {
          console.error('failed to insert', item, error)
        }
      })
    }
  })
}

console.log('main')
