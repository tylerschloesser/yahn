DROP TABLE items;
DROP TYPE item_type;

CREATE TYPE item_type AS ENUM ('job', 'story', 'comment', 'poll', 'pollopt');

CREATE TABLE items (
	id          integer PRIMARY KEY,
	deleted     boolean NOT NULL,
  type        item_type NOT NULL,
  by          varchar(32),
  time        timestamp NOT NULL,
  text        text,
  dead        boolean NOT NULL,
  parent      integer, /* TODO not null? */
  /* TODO add poll */
  kids        integer[], /* TODO not null? */
  url         varchar(512), /* TODO not null? */
  score       integer,
  title       varchar(128) /* TODO not null? */
  /* TODO add parts */
  descendants integer,
);

CREATE TYPE list_type AS ENUM ('topstories');
CREATE TABLE lists (
	type     list_type PRIMARY KEY,
  item_ids integer[] NOT NULL,
);

CREATE OR REPLACE VIEW topstories as select items.* from (SELECT unnest(item_ids) id from lists where type='topstories') as list join items on list.id = items.id;

CREATE OR REPLACE FUNCTION comment_ids(parent_id integer) RETURNS TABLE(id integer) AS $func$ SELECT id FROM (select unnest(kids) id from items where id=$1) kids $func$ LANGUAGE sql;
