import pg from 'pg';

import SchemaBuilder from './schema/SchemaBuilder.js';
import SchemaCompiler from './schema/SchemaCompiler.js';

const { Client } = pg;

class DB {
  constructor({ config }) {
    this.config = config;
  }

  async query(sql) {
    const client = new Client(this.config);
    try {
      await client.connect();
      const result = await client.query(sql);
      await client.end();
      return result;
    } catch (error) {
      await client.end();
      console.error(error);
      throw new Error(error);
    }
  }

  async createTable(tableName, callback) {
    const schemaBuilder = new SchemaBuilder();
    const schemaCompiler = new SchemaCompiler();
    let createTableSQL = `CREATE TABLE ${tableName} `;

    callback(schemaBuilder);
    const compilerResult = schemaCompiler.compile({ statements: schemaBuilder.statements });

    createTableSQL += `(\n${compilerResult}\n);`;
    const result = await this.query(createTableSQL);

    return result;
  }

  async createTableIfNotExists(tableName, callback) {
    const schemaBuilder = new SchemaBuilder();
    const schemaCompiler = new SchemaCompiler();
    let createTableSQL = `CREATE TABLE IF NOT EXISTS ${tableName} `;

    callback(schemaBuilder);
    const compilerResult = schemaCompiler.compile({ statements: schemaBuilder.statements });

    createTableSQL += `(\n${compilerResult}\n);`;
    const result = await this.query(createTableSQL);

    return result;
  }

  async dropTable(tableName) {
    const dropTableSQL = `DROP TABLE ${tableName}`;
    const result = await this.query(dropTableSQL);

    return result;
  }
}

export default DB;
