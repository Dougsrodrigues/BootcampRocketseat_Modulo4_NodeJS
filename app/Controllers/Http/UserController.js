"use strict";

const User = use("App/Models/User");
const Database = use("Database"); //lidando com database
class UserController {
  async store({ request }) {
    // recuperando os dados que o usuario envia
    //poderia usar o request.all para recuperar todos os dados mas queremos so alguns
    const data = request.only(["username", "email", "password"]);

    //queremos somente uma informação da requisição
    const addresses = request.input("addresses");

    //Temos que verificar se todos os dados estão corretos para caso haja algo errado no addresses não ira ter a criação do user
    //sem o trx, o user é criado independente de ter dado certo o address ou não e isso n é bom.
    //usamos o transaction sempre que tivermos mais de uma operação no mesmo controller
    const trx = await Database.beginTransaction();

    // criando um novo usuario
    const user = await User.create(data, trx);

    //criando o endereço do usuario
    await user.addresses().createMany(addresses, trx);

    //caso de tudo certo, ele ira efetuar as att no Banco de dados
    await trx.commit();

    return user;
  }
}

module.exports = UserController;
