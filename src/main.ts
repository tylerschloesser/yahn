import firebase from 'firebase'

import { Model, Sequelize } from 'sequelize'

const firebaseConfig = {
  databaseURL: 'https://hacker-news.firebaseio.com',
}

const app = firebase.initializeApp(firebaseConfig)

const db = app.database()

const sequelize = new Sequelize('postgresql://localhost:5432')

enum ItemType {
  Job = 'job',
  Story = 'story',
  Comment = 'comment',
  Poll = 'poll',
  PollOpt = 'pollopt',
}

interface ItemAttributes {
  id: number
  type: ItemType
}

type ItemCreationAttributes = ItemAttributes

class Item extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
  public id: number
  public type: ItemType
}

interface HnUpdates {
  items: number[]
  profiles: string[]
}

{
  const ref = db.ref('/v0/updates')
  ref.on('value', snap => {
    const updates = <HnUpdates>snap.val()
    console.log(updates)
    const first = updates.items[0]
    if (first) {
      db.ref(`/v0/item/${first}`).once('value', snap2 => {
        console.log(snap2.val())
      })
    }
  })
}

console.log('main')
