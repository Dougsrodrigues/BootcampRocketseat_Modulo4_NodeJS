"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProjectSchema extends Schema {
  up() {
    this.create("projects", table => {
      table.increments();
      // todo projeto é criado por um usuario
      // FK user_id
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE") //caso algum campo seja atualizado, ira atualizar aqui tbm
        .onDelete("SET NULL"); // se o usuario for deletado, o user_id passa a ser nulo
      table.string("title").notNullable();
      table.text("description").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("projects");
  }
}

module.exports = ProjectSchema;
