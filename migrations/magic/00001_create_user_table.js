function up(db) {
  return db.createTable('users', (table) => {
    table.serial('id').primary();
    table.varchar('username', 50).unique().notNull();
    table.varchar('identity_number', 50).unique().notNull();
    table.numeric('credit', 100, 2).notNull();
    table.text('motto');
    table.timestamp('created_time').default('current_timestamp').notNull();
  });
}

function down(db) {
  return db.dropTable('users');
}

const title = 'Create users table';
const targetTable = 'users';
const upDescription = 'Create users table with id, username, identity_number, credit, motto, created_time column';

export { up, down, title, targetTable, upDescription };
