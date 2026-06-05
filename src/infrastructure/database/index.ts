import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/shared/utils/env";
import * as schema from "./schema/index";

const client = postgres(env.DATABASE_URL, {
	max: 10,
	idle_timeout: 30,
	connect_timeout: 10,
});

export const db = drizzle(client, { schema });
export type DB = typeof db;
