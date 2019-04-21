"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Project = use("App/Models/Project");

/**
 * Resourceful controller for interacting with projects
 */
class ProjectController {
  /**
   * Show a list of all projects.
   * GET projects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request }) {
    /*
     * .query() = inicia a criação de uma query
     * .with() = carrega um relacionamento automaticamente e preenche os dados do usuario na listagem dos produtos
     *
     * então ao inves de ser user_id: 1 vai ter o username : Fulano, email: exemplo@ex.com ...
     *
     */
    const { page } = request.get(); // retorna os query parms
    const projects = await Project.query()
      .with("user")
      .paginate(page); // paginação
    return projects;
  }

  /**
   * Create/save a new project.
   * POST projects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const data = request.only(["title", "description"]);
    // recuperando o id do usuario logado
    // auth.user tem acesso a todos os dados do usuario logado
    const project = await Project.create({ ...data, user_id: auth.user.id });

    return project;
  }

  /**
   * Display a single project.
   * GET projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params }) {
    const project = await Project.findOrFail(params.id);

    //retornando mais informações
    // dando um load nos relacionamentos do arquivo models/project
    await project.load("user");
    await project.load("tasks");

    return project;
  }

  /**
   * Update project details.
   * PUT or PATCH projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request }) {
    const project = await Project.findOrFail(params.id);

    const data = request.only(["title", "description"]);

    // coloca os dados que vieram da requisição dentro do objeto buscado
    project.merge(data);

    await project.save();

    return project;
  }

  /**
   * Delete a project with id.
   * DELETE projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params }) {
    const project = await Project.findOrFail(params.id);

    await project.delete();
  }
}

module.exports = ProjectController;
