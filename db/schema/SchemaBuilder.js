class SchemaBuilder {
  constructor() {
    this.statements = [];
    this.schemaId = '';
  }

  initSchemaId(columnName) {
    this.schemaId = `${columnName}_schema`;
  }

  initStatement(args) {
    const statement = {
      schemaId: this.schemaId,
      ...args,
    };
    this.statements.push(statement);
  }

  integer(columnName) {
    this.initSchemaId(columnName);
    this.initStatement({ columnName, operation: 'integer' });
    return this;
  }

  serial(columnName) {
    this.initSchemaId(columnName);
    this.initStatement({ columnName, operation: 'serial' });
    return this;
  }

  numeric(columnName, precision, scale) {
    this.initSchemaId(columnName);
    this.initStatement({ columnName, precision, scale, operation: 'numeric' });
    return this;
  }

  varchar(columnName, columnLength) {
    this.initSchemaId(columnName);
    this.initStatement({ columnName, columnLength, operation: 'varchar' });
    return this;
  }

  timestamp(columnName) {
    this.initSchemaId(columnName);
    this.initStatement({ columnName, operation: 'timestamp' });
    return this;
  }

  text(columnName) {
    this.initSchemaId(columnName);
    this.initStatement({ columnName, operation: 'text' });
    return this;
  }

  primary() {
    this.initStatement({ operation: 'primary' });
    return this;
  }

  unique() {
    this.initStatement({ operation: 'unique' });
    return this;
  }

  notNull() {
    this.initStatement({ operation: 'notNull' });
    return this;
  }

  default(value) {
    this.initStatement({ value, operation: 'default' });
    return this;
  }
}

export default SchemaBuilder;
