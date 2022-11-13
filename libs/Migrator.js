import colors from 'colors/safe.js';
import fs from 'fs/promises';
import path from 'path';

import DB from '../db/index.js';
import readJSONFile from '../utils/readJSONFile.js';

class Migrator {
  constructor(db) {
    this.db = db;
    this.migrationFile = {
      path: path.resolve('migrations', this.db.config.database),
    };
  }

  async init() {
    this.displayDatabaseInformation();
    await this.createMigrationTable();
  }

  displayDatabaseInformation() {
    const { host, port, database } = this.db.config;
    console.log(colors.blue.bold('Host: '), host, colors.blue.bold('Port: '), port);
    console.log(colors.blue('Database: '), database);
  }

  async getMigrationFilesList() {
    const result = await fs.readdir(this.migrationFile.path);
    return result;
  }

  async getCompleteList(orderBy) {
    let sql = `SELECT name from migrations where name like '0%.js'`;
    if (orderBy) {
      sql += `ORDER BY ${orderBy.name} ${orderBy.direction}`;
    }
    const queryResult = await this.db.query(sql);
    const { rows } = queryResult;
    return rows;
  }

  async getUncompleteList() {
    const migrationFilesList = await this.getMigrationFilesList();
    const completeList = await this.getCompleteList();
    const uncompleteList = migrationFilesList.filter((filename) => !completeList.some((row) => row.name === filename));
    return uncompleteList;
  }

  async createMigrationTable() {
    await this.db.createTableIfNotExists('migrations', (table) => {
      table.serial('id').primary();
      table.varchar('name', 150);
      table.timestamp('created_time').default('current_timestamp');
    });
  }

  async importMigrationFile(filename) {
    const migration = await import(path.resolve(this.migrationFile.path, filename));
    return migration;
  }

  async insertMigrationRecord(filename) {
    console.log('filename: ', filename);
    const result = await this.db.query(`INSERT INTO migrations (name) VALUES ('${filename}');`);
    return result;
  }

  async deleteMigrationRecord(filename) {
    const result = await this.db.query(`DELETE FROM migrations WHERE name = '${filename}';`);
    return result;
  }

  /* eslint-disable no-await-in-loop */
  async executeUp() {
    const uncompleteList = await this.getUncompleteList();
    for (let index = 0; index < uncompleteList.length; index += 1) {
      const filename = uncompleteList[index];
      const migration = await this.importMigrationFile(filename);
      await migration.up(this.db);
      await this.insertMigrationRecord(filename);
    }
  }

  async executeDown() {
    const completeList = await this.getCompleteList({ name: 'name', direction: 'desc' });
    for (let index = 0; index < completeList.length; index += 1) {
      const { name: filename } = completeList[index];
      const migration = await this.importMigrationFile(filename);
      await migration.down(this.db);
      await this.deleteMigrationRecord(filename);
    }
  }
}

export default async function createMigrator() {
  const config = await readJSONFile(path.resolve(process.cwd(), 'config.json'));
  const db = new DB({ config });
  const migrator = new Migrator(db);
  await migrator.init();
  return migrator;
}
