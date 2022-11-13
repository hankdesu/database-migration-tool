import { readFile } from 'fs/promises';

export default async function readJSONFile(path) {
  try {
    const configFile = await readFile(path);
    const config = JSON.parse(configFile);
    return config;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
