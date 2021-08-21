import firebase from 'firebase'

import { DataTypes, Model, Sequelize } from 'sequelize'

const firebaseConfig = {
  databaseURL: 'https://hacker-news.firebaseio.com',
}

const app = firebase.initializeApp(firebaseConfig)

const db = app.database()

const sequelize = new Sequelize('postgresql://localhost:5432/test', {
  logging: false,
})

enum ItemType {
  Job = 'job',
  Story = 'story',
  Comment = 'comment',
  Poll = 'poll',
  PollOpt = 'pollopt',
}

interface ItemAttributes {
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
  title: string | null
}

type ItemCreationAttributes = ItemAttributes

class Item extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
  public id!: number
  public deleted!: boolean
  public type!: ItemType
  public by!: string
  public time!: Date
  public text!: string | null
  public dead!: boolean
  public parent!: number | null
  public kids!: number[] | null
  public url!: string | null
  public title!: string | null
}

Item.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('job', 'story', 'comment', 'poll', 'pollopt'),
    allowNull: false,
  },
  by: {
    type: new DataTypes.STRING(32),
    allowNull: false,
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
  },
  dead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  parent:  {
    type: DataTypes.INTEGER,
  },
  kids:  {
    type: new DataTypes.ARRAY(DataTypes.INTEGER),
  },
  url: {
    type: new DataTypes.STRING(256),
  },
  title: {
    type: new DataTypes.STRING(128),
  },
},
  {
    tableName: 'items',
    timestamps: false,
    sequelize,
  }
)

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
