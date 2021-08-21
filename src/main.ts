import firebase from 'firebase'

import { DataTypes, Model, Sequelize } from 'sequelize'

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
  deleted: boolean
  type: ItemType
  by: string
  time: Date
  text: string
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
  public text!: string
  public dead!: boolean
  public parent!: number | null
  public kids!: number[] | null
  public url!: string | null
  public title!: string | null
}

Item.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
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
    type: DataTypes.STRING(32),
    allowNull: false,
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  dead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  parent:  {
    type: DataTypes.INTEGER.UNSIGNED,
  },
  kids:  {
    type: DataTypes.ARRAY(DataTypes.INTEGER.UNSIGNED),
  },
  url: {
    type: DataTypes.STRING(128),
  },
  title: {
    type: DataTypes.STRING(128),
  },
},
  {
    tableName: 'items',
    sequelize,
  }
)

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
