"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("@/@types/zod.d.js");
var cors_1 = require("@fastify/cors");
var jwt_1 = require("@fastify/jwt");
var fastify_1 = require("fastify");
var env_js_1 = require("@/env.js");
var http_request_codes_js_1 = require("@/helpers/http-request-codes.js");
var reply_send_error_js_1 = require("@/plugins/reply-send-error.js");
var index_js_1 = require("@/routes/index.js");
var setup_js_1 = require("@/workers/setup.js");
var app = (0, fastify_1.default)({
    logger: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname"
            }
        }
    }
});
exports.app = app;
app.register(cors_1.default, {
    origin: env_js_1.env.CORS_ORIGIN
});
app.register(jwt_1.default, {
    secret: env_js_1.env.JWT_SECRET
});
app.register(reply_send_error_js_1.default);
app.register(index_js_1.routes);
app.addHook("onReady", function () {
    try {
        (0, setup_js_1.setupWorkers)();
        app.log.info("👷 BullMQ Workers initialized successfully");
    }
    catch (error) {
        app.log.error("❌ Failed to initialize BullMQ Workers", error);
    }
});
app.setErrorHandler(function (error, _request, reply) {
    if (env_js_1.env.NODE_ENV !== "production")
        app.log.error(error);
    return reply.sendError(error);
});
app.setNotFoundHandler(function (request, reply) {
    var errorResponse = {
        success: false,
        code: "ROUTE_NOT_FOUND_ERROR",
        details: {
            error: {
                message: "A rota ".concat(request.url, " com o protocolo ").concat(request.method, " na\u0303o foi encontrada")
            }
        }
    };
    return reply.status(http_request_codes_js_1.HTTPStatusCodes.NOT_FOUND).send(errorResponse);
});
