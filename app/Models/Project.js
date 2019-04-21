"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

// Adonis n entende os relacionamentos so com base das tabelas do banco de dados
class Project extends Model {
  user() {
    // projeto pertence a um usuario
    return this.belongsTo("App/Models/User");
  }

  // projeto pode ter varias tarefas
  tasks() {
    return this.hasMany("App/Models/Task");
  }
}

module.exports = Project;
