"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
// Adonis n entende os relacionamentos so com base das tabelas do banco de dados
class Task extends Model {
  static boot() {
    super.boot();

    this.addHook("afterCreate", "TaskHook.sendNewTaskMail");
    this.addHook("beforeUpdate", "TaskHook.sendNewTaskMail");
  }
  // essa tarefa pertence a um projeto
  project() {
    return this.belongsTo("App/Models/Project");
  }
  //essa tarefa pode pertencer a um usuario
  user() {
    return this.belongsTo("App/Models/User");
  }

  //essa tarefa pode ter um anexo
  file() {
    return this.belongsTo("App/Models/File");
  }
}

module.exports = Task;
