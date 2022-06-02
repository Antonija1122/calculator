"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateExpression = exports.expressionToString = exports.ExpressionElementType = void 0;
var ExpressionElementType;
(function (ExpressionElementType) {
    ExpressionElementType[ExpressionElementType["ADD"] = 0] = "ADD";
    ExpressionElementType[ExpressionElementType["SUB"] = 1] = "SUB";
    ExpressionElementType[ExpressionElementType["MUL"] = 2] = "MUL";
    ExpressionElementType[ExpressionElementType["DIV"] = 3] = "DIV";
    ExpressionElementType[ExpressionElementType["NEGATIVE"] = 4] = "NEGATIVE";
    ExpressionElementType[ExpressionElementType["BRACKET"] = 5] = "BRACKET";
})(ExpressionElementType = exports.ExpressionElementType || (exports.ExpressionElementType = {}));
function typeToString(t) {
    switch (t) {
        case ExpressionElementType.ADD:
            return "+";
        case ExpressionElementType.SUB:
            return "-";
        case ExpressionElementType.MUL:
            return "*";
        case ExpressionElementType.DIV:
            return "/";
    }
    return "";
}
function expressionToString(e) {
    if (e.type === "number") {
        return e.value.toString();
    }
    if (e.elementType === ExpressionElementType.BRACKET) {
        return `(${expressionToString(e.values[0])})`;
    }
    return expressionToString(e.values[0]) + typeToString(e.elementType) + expressionToString(e.values[1]);
}
exports.expressionToString = expressionToString;
function evaluateExpression(e) {
    if (e.type === "number") {
        return e.value;
    }
    if (e.elementType === ExpressionElementType.BRACKET) {
        return evaluateExpression(e.values[0]);
    }
    if (e.elementType === ExpressionElementType.NEGATIVE) {
        return -1 * evaluateExpression(e.values[0]);
    }
    const fun = (() => {
        switch (e.elementType) {
            case ExpressionElementType.ADD:
                return (a, b) => a + b;
            case ExpressionElementType.SUB:
                return (a, b) => a - b;
            case ExpressionElementType.MUL:
                return (a, b) => a * b;
            case ExpressionElementType.DIV:
                return (a, b) => a / b;
        }
    })();
    return fun(evaluateExpression(e.values[0]), evaluateExpression(e.values[1]));
}
exports.evaluateExpression = evaluateExpression;
//# sourceMappingURL=expression_element.js.map