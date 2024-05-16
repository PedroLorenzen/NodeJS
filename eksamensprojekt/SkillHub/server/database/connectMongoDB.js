import { connect, disconnect } from './connection.js';

const initializeConnection = async () => {
  try {
    const db = await connect();
    const collections = await db.collections();
    console.log('Collections:', collections.map(col => col.collectionName));
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await disconnect();
  }
};

initializeConnection();
