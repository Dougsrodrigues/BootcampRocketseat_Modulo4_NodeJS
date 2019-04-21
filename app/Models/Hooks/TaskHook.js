"use strict";

const TaskHook = (exports = module.exports = {});

// const Mail = use("Mail");
// const Helpers = use("Helpers");

const Kue = use("Kue");
const Job = use("App/Jobs/NewTaskMail");

TaskHook.sendNewTaskMail = async taskInstance => {
  //verificar se essa task tem o user id e se ele foi editado recentemente
  //dirty grava dentro do model quais foram as novas alterações
  if (!taskInstance.user_id && !taskInstance.dirty.user_id) return;

  // preciso ver qual o usuario dessa task
  // await taskInstance.user().fetch() vai trazer automaticamente o user relacionado a essa task
  const { email, username } = await taskInstance.user().fetch();
  // vai trazer o anexo, se existir.
  const file = await taskInstance.file().fetch();

  const { title } = taskInstance;

  // Agora o email fica assim =>
  //Parametros , Configuração
  Kue.dispatch(Job.key, { email, username, file, title }, { attempts: 3 });

  //  EMAIL PASSOU PARA PROCESSO DE FILA/REDIS
  // // !!exemplo = faz c que a variavel exemplo retorne um valor boleano
  // await Mail.send(
  //   ["emails.new_task"],
  //   {
  //     username,
  //     title,
  //     hasAttachement: !!file
  //   },
  //   message => {
  //     message
  //       .to(email)
  //       .from("dougsrodrigues@outlook.com", "Douglas")
  //       .subject("Nova tarefa para vocÊ");

  //     //adicionando o anexo , se existir

  //     if (file) {
  //       message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
  //         filename: file.name // o nome que vai chegar ao usuario vai ser o nome do upload
  //       });
  //     }
  //   }
  // );
};
