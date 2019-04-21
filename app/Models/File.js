"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Env = use("Env");

class File extends Model {
  //campo virtual, n existe no bd mas td vez que mostrar um arquivo ele vai junto
  static get computed() {
    return ["url"];
  }

  getUrl({ id }) {
    return `${Env.get("APP_URL")}/files/${id}`;
  }
}

module.exports = File;
