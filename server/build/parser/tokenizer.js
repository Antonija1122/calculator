"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = exports.reduceTokens = void 0;
const operators_1 = require("./operators");
function isDigit(v) {
    return v >= "0" && v <= "9";
}
function isOperator(v) {
    return operators_1.operators.has(v);
}
function isDecimalPoint(v) {
    return v === '.';
}
function isOpenBracket(v) {
    return v === '(';
}
function isCloseBracket(v) {
    return v === ')';
}
function isSpace(v) {
    return v === ' ' || v === '\t';
}
function isNegativeOperator(v) {
    return v === '-';
}
/**
 * Take tokens and reduce to new array. Convert expressions like:
 *      2 +++ 2 -> 2 + 2
 *      2 +- 2 -> 2 - 2
 *      2 -+ 2 -> 2 - 2
 *      2 -- 2 -> 2 + 2
 * @param tokens
 */
function reduceTokens(tokens) {
    const reducedTokens = [];
    for (let i = 0; i < tokens.length; ++i) {
        const token = tokens[i];
        if (token.type !== 'operator' || reducedTokens.length === 0) {
            if (reducedTokens.length === 0) {
                reducedTokens.push(token);
                continue;
            }
            if (token.type === "openBracket" && reducedTokens[reducedTokens.length - 1].type === 'number') {
                reducedTokens.push({ type: "operator", value: '*' });
            }
            reducedTokens.push(token);
        }
        else {
            const last = reducedTokens[reducedTokens.length - 1];
            if (last.type !== 'operator') {
                reducedTokens.push(token);
                continue;
            }
            const currentOperator = token;
            const lastOperator = last;
            if (currentOperator.value === "+") {
                continue;
            }
            else if (lastOperator.value === "+" && currentOperator.value === "-") {
                reducedTokens.pop();
                reducedTokens.push(currentOperator);
            }
            else if (lastOperator.value === "-" && currentOperator.value === "-") {
                reducedTokens.pop();
                reducedTokens.push({ type: "operator", value: "+" });
            }
            else {
                reducedTokens.push(last);
            }
        }
    }
    return reducedTokens;
}
exports.reduceTokens = reduceTokens;
function tokenize(s) {
    const tokens = [];
    let numberBuffer = [];
    const createNumberToken = () => {
        if (numberBuffer.length !== 0) {
            tokens.push({ type: 'number', value: numberBuffer.join("") });
            numberBuffer = [];
        }
    };
    for (let i = 0; i < s.length; ++i) {
        const c = s.charAt(i);
        if (isSpace(c))
            continue;
        if (isDigit(c) || isDecimalPoint(c)) {
            numberBuffer.push(c);
        }
        else {
            createNumberToken();
            if (isNegativeOperator(c)) {
                if (tokens.length === 0) {
                    tokens.push({ type: 'negative' });
                    continue;
                }
                else {
                    const last = tokens[tokens.length - 1];
                    if (last.type != "number" && last.type != 'closeBracket') {
                        tokens.push({ type: 'negative' });
                        continue;
                    }
                }
            }
            if (isOperator(c)) {
                tokens.push({ type: 'operator', value: c });
            }
            else if (isOpenBracket(c)) {
                tokens.push({ type: 'openBracket' });
            }
            else if (isCloseBracket(c)) {
                tokens.push({ type: 'closeBracket' });
            }
        }
    }
    createNumberToken();
    return tokens;
}
exports.tokenize = tokenize;
//# sourceMappingURL=tokenizer.js.map