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
  aides_territoire_id: number;
  created_at: Generated<Timestamp>;
  description: Generated<string>;
  id: Generated<number>;
  nom: Generated<string>;
  uuid: string;
}

export interface ProjetTable {
  created_at: Generated<Timestamp>;
  description: string;
  id: Generated<number>;
  recommendations: Generated<Json>;
  uuid: string;
}

export interface DB {
  agent_table: AgentTable;
  aide_table: AideTable;
  projet_table: ProjetTable;
}
