/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('user', function (table) {
        table.string('id', 32).notNullable();
        table.string('fullname', 75).notNullable();
        table.string('email', 50).notNullable();
        table.integer("grade").notNullable();
        table.integer("school").notNullable();
        table.string("code");
        table.boolean("verified");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    knex.schema.dropSchema("user");
};
