import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    app.listen(config.port, () => {
      console.log(
        `Gardening Tips & Advice Platform app listening on port ${config.port}`,
      );
    });
  } catch (error) {
    console.error('Error connecting to the database', error);
  }
}

main();
