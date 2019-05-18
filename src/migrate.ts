import { WsFlareJobsApiApplication } from './application';

/**
 * Automatically sets up database tables in mysql database based on the models in ./models folder
 *
 * @param args
 */
export async function migrate(args: string[]) {
    const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
    console.log('Migrating schemas (%s existing schema)', existingSchema);

    const app = new WsFlareJobsApiApplication();
    await app.boot();
    await app.migrateSchema({existingSchema});

    // Connectors usually keep a pool of opened connections,
    // this keeps the process running even after all work is done.
    // We need to exit explicitly.
    process.exit(0);
}

migrate(process.argv).catch(err => {
    console.error('Cannot migrate database schema', err);
    process.exit(1);
});
