DROP TABLE items;
DROP TYPE item_type;

CREATE TYPE item_type AS ENUM ('job', 'story', 'comment', 'poll', 'pollopt');

CREATE TABLE items (
	id      integer PRIMARY KEY,
	deleted boolean NOT NULL,
  type    item_type NOT NULL,
  by      varchar(32) NOT NULL,
  time    timestamp NOT NULL,
  text    text,
  dead    boolean NOT NULL,
  parent  integer, /* TODO not null? */
  /* TODO add poll */
  kids    integer[], /* TODO not null? */
  url     varchar(256), /* TODO not null? */
  /* TODO add score */
  title   varchar(128) /* TODO not null? */
  /* TODO add parts */
  /* TODO add descendants */
);
