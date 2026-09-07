import Database from 'better-sqlite3';
import path from 'path';

let instance: Database.Database | null = null;

function getDb(): Database.Database {
  if (!instance) {
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    instance = new Database(dbPath, { verbose: console.log });

    // Create tables if they don't exist
    instance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        google_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        picture TEXT,
        role TEXT DEFAULT 'customer',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

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

      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        rating INTEGER NOT NULL,
        useful TEXT NOT NULL,
        built TEXT NOT NULL,
        testimonial TEXT NOT NULL,
        profile TEXT,
        consent INTEGER NOT NULL,
        approved INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        current_version_id TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS product_versions (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        version_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        status TEXT DEFAULT 'draft',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        actor_id TEXT NOT NULL,
        action TEXT NOT NULL,
        resource TEXT NOT NULL,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

      // Add quantity and user_id columns if they don't already exist
      try {
        instance.exec('ALTER TABLE purchases ADD COLUMN quantity INTEGER DEFAULT 1;');
      } catch (err) {}
      
      try {
        instance.exec('ALTER TABLE purchases ADD COLUMN user_id TEXT;');
      } catch (err) {}
  }
  return instance;
}

const lazyDb = {
  prepare: (sql: string) => getDb().prepare(sql),
  exec: (sql: string) => getDb().exec(sql),
  transaction: (fn: any) => getDb().transaction(fn),
};

export default lazyDb as unknown as Database.Database;
