"use strict";

class SessionController {
  async store({ request, response, auth }) {
    // recupera alguns dados da requisição
    const { email, password } = request.all();

    // gerando o token
    const token = await auth.attempt(email, password);

    return token;
  }
}

module.exports = SessionController;
