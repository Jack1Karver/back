import { migrate, MigrateDBConfig } from "postgres-migrations";
import { Migration } from "postgres-migrations/dist/types";
import { db } from '../config/db'

const migrationFolder = 'migrations';
const onSuccess = (value: Migration[]): void => {
    if (!value.length) {
        console.log('No new migrations found.');
        return;
    }

    console.log('Applying migrations:');
    value.map((v: Migration) => console.log(v.fileName));
};

migrate(<MigrateDBConfig>db, migrationFolder)
    .then(onSuccess)
    .catch((e) => console.error(e));