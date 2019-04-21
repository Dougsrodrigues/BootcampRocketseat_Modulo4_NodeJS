"use strict";

const Route = use("Route");

Route.post("users", "UserController.store").validator("User");
Route.post("sessions", "SessionController.store").validator("Session");
Route.post("passwords", "ForgotPasswordController.store").validator(
  "ForgotPassword"
);
Route.put("passwords", "ForgotPasswordController.update").validator(
  "ResetPassword"
);

Route.get("files/:id", "FileController.show");

//Essas rotas so seram acessiveis caso o usuario estiver logado
Route.group(() => {
  Route.post("/files", "FileController.store");

  //toda essa parte de get,post,delete com uma unica linha de codigo.
  //apiOnly exclui os metodos create e edit
  //validator quando é resource = fazer um Map com o metodo que vc quer validar e o validator
  Route.resource("projects", "ProjectController")
    .apiOnly()
    .validator(new Map([[["projects.store"], ["Project"]]]));

  /*
   * projects.task resultara em uma requisição com o seguinte composição: /projects/:projects_id/task
   * é recomendavel usar so quando algo depender de uma coisa para ser criado
   * no caso, task depende de project para ser criado
   */
  Route.resource("projects.tasks", "TaskController")
    .apiOnly()
    .validator(new Map([[["projects.tasks.store"], ["Task"]]]));
}).middleware(["auth"]);
