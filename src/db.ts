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
  by: string | null
  time: Date
  text: string | null
  dead: boolean
  parent: number | null
  kids: number[] | null
  url: string | null
  score: number | null
  title: string | null
}

export enum ListType {
  TopStories = 'topstories',
}

export interface ListAttributes {
  type: ListType
  item_ids: number[]
}

export type ListCreationAttributes = ListAttributes

export class List
  extends Model<ListAttributes, ListCreationAttributes>
  implements ListAttributes
{
  public type!: ListType
  public item_ids!: number[]
}

List.init(
  {
    type: {
      type: new DataTypes.ENUM('topstories'),
      primaryKey: true,
    },
    item_ids: {
      type: new DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
  },
  {
    tableName: 'lists',
    timestamps: false,
    sequelize,
  },
)

export type ItemCreationAttributes = ItemAttributes

export class Item
  extends Model<ItemAttributes, ItemCreationAttributes>
  implements ItemAttributes
{
  public id!: number
  public deleted!: boolean
  public type!: ItemType
  public by!: string | null
  public time!: Date
  public text!: string | null
  public dead!: boolean
  public parent!: number | null
  public kids!: number[] | null
  public url!: string | null
  public score!: number | null
  public title!: string | null
}

Item.init(
  {
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
    parent: {
      type: DataTypes.INTEGER,
    },
    kids: {
      type: new DataTypes.ARRAY(DataTypes.INTEGER),
    },
    url: {
      type: new DataTypes.STRING(512),
    },
    score: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: new DataTypes.STRING(128),
    },
  },
  {
    tableName: 'items',
    timestamps: false,
    sequelize,
  },
)
