"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const File = use("App/Models/File");
// Helpers ajuda em algumas funções que o JS ñ tem
const Helpers = use("Helpers");
/**
 * Resourceful controller for interacting with files
 */
class FileController {
  async show({ params, response }) {
    // BUscando o arquivo dentro do banco de dados, id via parametro
    const file = await File.findOrFail(params.id);

    //retornando o arquivo em formato de imagem
    return response.download(Helpers.tmpPath(`uploads/${file.file}`));
  }

  async store({ request, response }) {
    try {
      // Verificar se na requisição existe um arquivo com nome file, caso n exista, n faz nada
      if (!request.file("file")) return;

      const upload = request.file("file", { size: "2mb" });
      // Date.now para que n nenhum arquivo seja reptido, subtype para extensão do arquivo
      const fileName = `${Date.now()}.${upload.subtype}`;
      // faz o upload para a pasta dentro do projeto
      await upload.move(Helpers.tmpPath("uploads"), {
        name: fileName
      });
      // Deu certo? Se não ira cair no catch
      if (!upload.moved()) {
        throw upload.error();
      }

      //criando uma novo registro no bd
      const file = await File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      });
      return file;
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: "Erro no upload de arquivo" } });
    }
  }
}
module.exports = FileController;
