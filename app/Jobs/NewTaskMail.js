"use strict";
const Mail = use("Mail");
const Helpers = use("Helpers");
class NewTaskMail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  // determina quantos desses jobs eu quero processar simultaneamente
  static get concurrency() {
    return 1;
  }

  // This is required. This is a unique key used to identify this job.
  // uma chave unica para cada job
  static get key() {
    return "NewTaskMail-job";
  }

  // This is where the work is done.
  //a logica
  // os parametros iram vir através do TaskHook
  async handle({ email, username, title, file }) {
    //so para saber se foi executado
    console.log(`JOB: ${NewTaskMail.key}`);

    // !!exemplo = faz c que a variavel exemplo retorne um valor boleano
    await Mail.send(
      ["emails.new_task"],
      {
        username,
        title,
        hasAttachement: !!file
      },
      message => {
        message
          .to(email)
          .from("dougsrodrigues@outlook.com", "Douglas")
          .subject("Nova tarefa para vocÊ");

        //adicionando o anexo , se existir

        if (file) {
          message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
            filename: file.name // o nome que vai chegar ao usuario vai ser o nome do upload
          });
        }
      }
    );
  }
}

module.exports = NewTaskMail;
