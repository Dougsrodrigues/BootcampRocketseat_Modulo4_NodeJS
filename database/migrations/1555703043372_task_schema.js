"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TaskSchema extends Schema {
  up() {
    this.create("tasks", table => {
      table.increments();
      // toda tarefa vai pertencer a algum projeto
      table
        .integer("project_id")
        .unsigned()
        .references("id")
        .inTable("projects")
        .onUpdate("CASCADE") //caso algum campo seja atualizado, ira atualizar aqui tbm
        .onDelete("CASCADE") // se o usuario for deletado, as tarefas vão ser tbm
        .notNullable();
      // a tarefa pode esta relacionada ao usuario, ex: tal usuario tem q realizar tal tarefa
      // FK user_id
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE") //caso algum campo seja atualizado, ira atualizar aqui tbm
        .onDelete("SET NULL"); // se o usuario for deletado, o user_id passa a ser nulo
      // toda tarefa pd ter um arquivo(anexo)
      // FK file_id
      table
        .integer("file_id")
        .unsigned()
        .references("id")
        .inTable("files")
        .onUpdate("CASCADE") //caso algum campo seja atualizado, ira atualizar aqui tbm
        .onDelete("SET NULL"); // se o usuario for deletado, o user_id passa a ser nulo

      table.string("title").notNullable();
      table.text("description");
      table.timestamp("due_date");
      table.timestamps();
    });
  }

  down() {
    this.drop("tasks");
  }
}

module.exports = TaskSchema;
