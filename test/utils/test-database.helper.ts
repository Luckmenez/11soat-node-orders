import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';

export class TestDatabaseHelper {
  private static prismaClient: PrismaClient;
  private static sqliteDb: Database.Database;

  static async setupDatabase(): Promise<PrismaClient> {
    // Create in-memory SQLite database
    this.sqliteDb = new Database(':memory:');

    // Enable foreign keys
    this.sqliteDb.pragma('foreign_keys = ON');

    // Create tables
    await this.createTables();

    // Configure Prisma to use the in-memory database
    // Note: For integration tests, we'll use the real Prisma instance
    // but with a test database URL
    this.prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: 'file::memory:?cache=shared',
        },
      },
    });

    await this.prismaClient.$connect();

    return this.prismaClient;
  }

  private static createTables() {
    // Create orders table
    this.sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clientCpf TEXT,
        status TEXT NOT NULL,
        amount REAL NOT NULL,
        transactionId TEXT,
        isRandomClient INTEGER NOT NULL DEFAULT 0,
        codeClientRandom INTEGER,
        observation TEXT,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create order_items table
    this.sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER NOT NULL,
        productId INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        photo TEXT,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        unitPrice REAL NOT NULL,
        observation TEXT,
        type TEXT NOT NULL,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
      )
    `);

    // Create order_item_customizations table
    this.sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS order_item_customizations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderItemId INTEGER NOT NULL,
        itemId INTEGER,
        title TEXT NOT NULL,
        description TEXT,
        photo TEXT,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        unitPrice REAL NOT NULL,
        observation TEXT,
        type TEXT NOT NULL,
        FOREIGN KEY (orderItemId) REFERENCES order_items(id) ON DELETE CASCADE
      )
    `);
  }

  static async cleanDatabase() {
    if (this.prismaClient) {
      // Delete in reverse order to respect foreign keys
      await this.prismaClient.$executeRawUnsafe('DELETE FROM order_item_customizations');
      await this.prismaClient.$executeRawUnsafe('DELETE FROM order_items');
      await this.prismaClient.$executeRawUnsafe('DELETE FROM orders');
    }

    if (this.sqliteDb) {
      this.sqliteDb.exec('DELETE FROM order_item_customizations');
      this.sqliteDb.exec('DELETE FROM order_items');
      this.sqliteDb.exec('DELETE FROM orders');
    }
  }

  static async closeDatabase() {
    if (this.prismaClient) {
      await this.prismaClient.$disconnect();
    }

    if (this.sqliteDb) {
      this.sqliteDb.close();
    }
  }

  static getClient(): PrismaClient {
    return this.prismaClient;
  }

  static getSqliteDb(): Database.Database {
    return this.sqliteDb;
  }
}
