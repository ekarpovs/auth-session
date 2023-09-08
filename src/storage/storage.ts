import MongoStore from "connect-mongo";

export type StorageConfig = {
  uri: string;
  db: string;
  collection: string;
};
export const sessionStorage = (config: StorageConfig): MongoStore => {
  // const uri = process.env.SESSION_STORAGE_URI;
  // const db = process.env.SESSION_STORAGE_DB;
  // const collection = process.env.SESSION_STORAGE_COLLECTION;

  // Create session storage
  return MongoStore.create({
    mongoUrl: config.uri,
    dbName: config.db,
    collectionName: config.collection,
    ttl: 20000
  });
};