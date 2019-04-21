"use strict";

const BaseExceptionHandler = use("BaseExceptionHandler");
const Youch = use("youch"); // dependencia q vem c o adonis. um formatador de erros
const Env = use("Env");
const Sentry = require("@sentry/node");
const Config = use("Config");
/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { request, response }) {
    //se for um erro de validação
    if (error.name === "ValidationException") {
      return response.status(error.status).send(error.messages);
    }
    //se o ambiente for desenvolvimeto
    if (Env.get("NODE_ENV") === "development") {
      const youch = new Youch(error, request.request);
      // transformando em JSON para devolver p usuario
      const errorJSON = await youch.toJSON();

      return response.status(error.status).send(errorJSON);
    }

    return response.status(error.status);
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report(error, { request }) {
    const Sentry = require("@sentry/node");
    Sentry.init({
      dsn: Config.get("services.sentry.dsn")
    });
    Sentry.captureException(error);
  }
}

module.exports = ExceptionHandler;
