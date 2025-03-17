import { Database } from "./database";

export type Book = Database["public"]["Tables"]["books"]["Row"];
export type Chapter = Database["public"]["Tables"]["chapters"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
