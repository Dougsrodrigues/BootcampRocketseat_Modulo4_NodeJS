"use strict";

const crypto = require("crypto");

const Mail = use("Mail");

const User = use("App/Models/User");

const moment = require("moment");

class ForgotPasswordController {
  async store({ request, response }) {
    try {
      //repuperando somente o email c o .input da requisição
      const email = request.input("email");
      //encontrando um unico registro c find.by
      const user = await User.findByOrFail("email", email);

      // Criando o token e salvando com a data atual
      user.token = crypto.randomBytes(10).toString("hex");
      user.token_created_at = new Date();

      await user.save();
      //Enviado o email para o usuario
      // [] = template do email
      // {} = variaveis/parametros
      // link vai recuperar as informações baseada no body da requisição
      await Mail.send(
        ["emails.forgot_password"],
        {
          email,
          token: user.token,
          link: `${request.input("redirect_url")}?token=${user.token}`
        },
        message => {
          message
            .to(user.email)
            .from("dougsrodrigues@outlook.com", "Douglas Santiago")
            .subject("Recuperação de Senha");
        }
      );
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: "Algo não deu certo, esse email existe?" } });
    }
  }

  async update({ request, response }) {
    try {
      //recuperando o token e o password enviado pela requisição
      const { token, password } = request.all();

      //procurando usuario
      const user = await User.findByOrFail("token", token);

      //utiliza o moment para comparar se a data de criação do token venceu
      // moment() = cria um objeto com a data atual para comparar com a data do token_created_at
      const tokenExpired = moment()
        .subtract("2", "days")
        .isAfter(user.token_created_at);

      if (tokenExpired) {
        return response
          .status(401)
          .send({ error: { message: "O token expirou" } });
      }
      user.token = null;
      user.token_created_at = null;
      // a senha do usuario vai receber a senha recebida na requisição
      user.password = password;

      await user.save();
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: "Algo deu errado ao resetar sua senha" } });
    }
  }
}

module.exports = ForgotPasswordController;
