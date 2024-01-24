module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            host : '127.0.0.1',
            port : 5432,
            user : 'postgres',
            password : 'JaiAvi10:14',
            database : 'postgres'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
};
