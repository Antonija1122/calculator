"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const parser_1 = require("./parser/parser");
const tokenizer_1 = require("./parser/tokenizer");
const expression_element_1 = require("./expression/expression_element");
const cors = require('cors');
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(cors());
const server = app.listen(8080, "0.0.0.0", () => {
    console.log("Listening...");
});
app.use(express_1.default.json());
app.use(cors());
app.post("/evaluate", (request, response) => {
    const input = request.body.input;
    const result = (0, parser_1.parse)((0, tokenizer_1.tokenize)(input));
    if (result.type !== 'success') {
        response.send({ status: "Error", description: result.msg });
        return;
    }
    const value = (0, expression_element_1.evaluateExpression)(result.expression);
    response.send({ status: "OK", value: value });
});
var buildPath = "../../frontend/build/";
app.use(express_1.default.static(path_1.default.join(__dirname, buildPath)));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, buildPath, "index.html"));
});
//# sourceMappingURL=main.js.map