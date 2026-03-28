"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var env_js_1 = require("@/env.js");
var app_js_1 = require("./app.js");
app_js_1.app
    .listen({
    port: env_js_1.env.PORT,
    host: "0.0.0.0"
})
    .then(function () {
    console.log("\uD83D\uDE80 Server is running on ".concat(env_js_1.env.BASE_URL));
})
    .catch(function (err) {
    console.error("Error starting server:", err);
    process.exit(1);
});
