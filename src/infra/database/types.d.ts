/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from 'kysely';

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [x: string]: JsonValue | undefined;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface AgentTable {
  created_at: Generated<Timestamp>;
  id: Generated<number>;
  uuid: string;
}

export interface AideTable {
  aid_types: Generated<string[]>;
  aid_types_full: Generated<Json>;
  categories: Generated<string[]>;
  created_at: Generated<Timestamp>;
  data_provider: Generated<string>;
  description: string;
  description_md: string;
  destinations: Generated<string[]>;
  eligibility_md: string;
  financers: Generated<string[]>;
  financers_full: Generated<Json>;
  id: string;
  is_charged: Generated<boolean>;
  mobilization_steps: Generated<string[]>;
  name: string;
  perimeter: string | null;
  perimeter_scale: string | null;
  programs: Generated<string[]>;
  targeted_audiences: Generated<string[]>;
  token_numb_description: Generated<number>;
  token_numb_eligibility: Generated<number>;
  url: string;
  uuid: Generated<string>;
}

export interface AtPerimeterTable {
  code: string;
  created_at: Generated<Timestamp>;
  id: string;
  name: string;
  scale: string;
  text: string;
  uuid: Generated<string>;
  zipcodes: Generated<string[]>;
}

export interface ClientTable {
  active: Generated<boolean>;
  created_at: Generated<Timestamp>;
  hashed_secret: string;
  id: string;
  iterations: number;
  nom: string;
  salt: string;
}

export interface ProjetTable {
  aides_scores: Generated<Json>;
  at_perimeter_id: string | null;
  client_id: string | null;
  created_at: Generated<Timestamp>;
  criteres_recherche_aide: Generated<Json>;
  description: string;
  etat_avancement: string | null;
  id: Generated<number>;
  porteur: string;
  recommendations: Generated<Json>;
  suuid: string;
  uuid: string | null;
}

export interface ProjetZoneGeographiqueTable {
  at_perimeter_id: string;
  projet_uuid: string;
}

export interface DB {
  agent_table: AgentTable;
  aide_table: AideTable;
  at_perimeter_table: AtPerimeterTable;
  client_table: ClientTable;
  projet_table: ProjetTable;
  projet_zone_geographique_table: ProjetZoneGeographiqueTable;
}
