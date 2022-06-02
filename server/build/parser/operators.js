"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operators = void 0;
const expression_element_1 = require("../expression/expression_element");
exports.operators = new Map([
    ["+", { expressionType: expression_element_1.ExpressionElementType.ADD, priority: 0 }],
    ["-", { expressionType: expression_element_1.ExpressionElementType.SUB, priority: 0 }],
    ["*", { expressionType: expression_element_1.ExpressionElementType.MUL, priority: 1 }],
    ["/", { expressionType: expression_element_1.ExpressionElementType.DIV, priority: 2 }],
]);
//# sourceMappingURL=operators.js.map