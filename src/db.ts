import { DataTypes, Model, Sequelize } from 'sequelize'

const sequelize = new Sequelize('postgresql://localhost:5432/test', {
  logging: false,
})

export enum ItemType {
  Job = 'job',
  Story = 'story',
  Comment = 'comment',
  Poll = 'poll',
  PollOpt = 'pollopt',
}

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
  title: string | null
}

export type ItemCreationAttributes = ItemAttributes

export class Item extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
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