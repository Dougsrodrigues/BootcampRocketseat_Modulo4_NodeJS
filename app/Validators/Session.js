"use strict";
const Antl = use("Antl"); // lib de internacionalização do adoni
class Session {
  /*
   * Por padrão o adonis para na primeira validação que der errado, então ele n vai checar tudo
   * com o validateAll vai fazer com oque todos os campos serem validados ao mesmo tempo
   * e assim voltando todas as mensagens de uma vez (error)
   */
  get validateAll() {
    return true;
  }
  get rules() {
    return {
      // validation rules
      email: "required|email",
      password: "required"
    };
  }
  get messages() {
    return Antl.list("validation");
  }
}

module.exports = Session;
