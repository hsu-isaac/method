create schema "dunkin";

CREATE TABLE "dunkin.entity" (
	"entity_id" VARCHAR(255) NOT NULL UNIQUE,
	"dunkin_id" VARCHAR(255) NOT NULL UNIQUE,
	"individual" BOOLEAN NOT NULL,
	"individual_first_name" VARCHAR(255),
	"individual_last_name" VARCHAR(255),
	"corporation_name" VARCHAR(255),
	"corporation_ein" integer,
	"corporation_address" integer,
	CONSTRAINT "entity_pk" PRIMARY KEY ("entity_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "dunkin.accounts" (
	"id" serial(255) NOT NULL UNIQUE,
	"holder_id" VARCHAR(255) NOT NULL,
	CONSTRAINT "accounts_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "accounts" ADD CONSTRAINT "accounts_fk0" FOREIGN KEY ("holder_id") REFERENCES "entity"("entity_id");
