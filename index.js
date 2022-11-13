// import path from 'path';

// import DB from './db/index.js';
import createMigrator from './libs/Migrator.js';
// import readJSONFile from './utils/readJSONFile.js';

try {
  const migrator = await createMigrator();
  migrator.executeUp();
} catch (error) {
  console.log('outside error: ', error);
}
// console.log('result: ', result);
