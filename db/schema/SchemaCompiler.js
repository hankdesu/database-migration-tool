import colors from 'colors/safe.js';

class SchemaCompiler {
  constructor() {
    this.sql = '';
  }

  schemaLog(sqlString) {
    if (process.env.NODE_ENV === 'DEBUG') {
      console.log(colors.blue('SQL: '), sqlString);
    }
    return this;
  }

  integer({ columnName }) {
    const sqlString = `${columnName} integer`;
    this.schemaLog(sqlString);
    return sqlString;
  }

  serial({ columnName }) {
    const sqlString = `${columnName} serial`;
    this.schemaLog(sqlString);
    return sqlString;
  }

  numeric({ columnName, precision, scale }) {
    const sqlString = `${columnName} NUMERIC(${precision}, ${scale})`;
    this.schemaLog(sqlString);
    return sqlString;
  }

  timestamp({ columnName }) {
    const sqlString = `${columnName} TIMESTAMP`;
    this.schemaLog(sqlString);
    return sqlString;
  }

  varchar({ columnName, columnLength }) {
    const sqlString = `${columnName} varchar(${columnLength})`;
    this.schemaLog(sqlString);
    return sqlString;
  }

  text({ columnName }) {
    const sqlString = `${columnName} text`;
    this.schemaLog(sqlString);
    return sqlString;
  }

  primary() {
    const sqlString = ' PRIMARY KEY';
    this.schemaLog(sqlString);
    return sqlString;
  }

  unique() {
    const sqlString = ` UNIQUE`;
    this.schemaLog(sqlString);
    return sqlString;
  }

  notNull() {
    const sqlString = ` NOT NULL`;
    this.schemaLog(sqlString);
    return sqlString;
  }

  default({ value }) {
    const sqlString = ` DEFAULT ${value}`;
    this.schemaLog(sqlString);
    return sqlString;
  }

  compile({ statements }) {
    const compileResult = statements.reduce((acc, cur) => {
      const operationString = this[cur.operation].call(this, cur);
      acc[cur.schemaId] = acc[cur.schemaId] ? `${acc[cur.schemaId]}${operationString}` : `${operationString}`;
      return acc;
    }, {});
    const sql = Object.values(compileResult).join(',\n');
    return sql;
  }
}

export default SchemaCompiler;
