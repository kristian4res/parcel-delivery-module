import 'dotenv/config';
import { server } from "./app";
import { checkEnvVars } from "./helpers/functions";

process.on('uncaughtException', (err: Error) => {
    console.error('Uncaught exception, shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

const databaseEnvVars = ['DATABASE_HOST', 'DATABASE_PORT', 'DATABASE_SCHEMA', 'DATABASE_USERNAME', 'DATABASE_PASSWORD', 'SESSION_SECRET', 'TOKEN_SECRET', 'JWT_SECRET'];
if (checkEnvVars(databaseEnvVars).includes(false)) {
    console.error('Required environment variables are missing, shutting down...');
    process.exit(1);
}

const port = process.env.PORT || 9000;
export const serverInstance = server.listen(port, () => {
    console.log('Parcel Delivery Backend 🖥️ is listening at:', port);
});

process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled rejection, shutting down...');
    console.error(err.name, err.message);
    serverInstance.close(() => {
        process.exit(1);
    });
});

if (process.env.NODE_ENV === 'production') {
    process.on('SIGTERM', () => {
        console.log('Terminating gracefully...');
        serverInstance.close(() => {
            console.log('Process terminated');
        });
    });
}