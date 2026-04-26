import Database from 'better-sqlite3';
import path from 'path';

let instance: Database.Database | null = null;

function getDb(): Database.Database {
  if (!instance) {
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    instance = new Database(dbPath, { verbose: console.log });

    // Create tables if they don't exist
    instance.exec(`
      CREATE TABLE IF NOT EXISTS visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS purchases (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        amount INTEGER NOT NULL,
        product_type TEXT NOT NULL,
        status TEXT NOT NULL,
        razorpay_order_id TEXT,
        razorpay_payment_id TEXT,
        referral_code TEXT,
        referred_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS referrals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        referrer_code TEXT NOT NULL,
        referred_purchase_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add quantity column if it doesn't already exist
    try {
      instance.exec('ALTER TABLE purchases ADD COLUMN quantity INTEGER DEFAULT 1;');
    } catch (err) {
      // Ignore error if column already exists
    }
  }
  return instance;
}

const lazyDb = {
  prepare: (sql: string) => getDb().prepare(sql),
  exec: (sql: string) => getDb().exec(sql),
};

export default lazyDb as unknown as Database.Database;
