import {Expression, ExpressionElementType} from "../expression/expression_element";
import {CloseBracketToken, OpenBracketToken, reduceTokens, Token} from "./tokenizer";
import {Operator, operators} from "./operators";

export interface ParseError {
    type: "Error"
    msg: string
}

export interface ParseSuccess {
    type: 'success'
    expression: Expression
}

export type ParseResult = ParseError | ParseSuccess


interface OperatorStackOpElem {
    type: "op"
    operator: Operator
}

interface OperatorStackBracketElem {
    type: "bracket"
    bracket: OpenBracketToken | CloseBracketToken
}

interface OperatorStackNegative {
    type: 'negative'
}

type OperatorStackElem = OperatorStackOpElem | OperatorStackBracketElem | OperatorStackNegative

export function parse(tokens: Token[]): ParseResult {

    if (tokens.length === 0) {
        return {type: "Error", msg: "Empty tokens"}
    }

    if (tokens[0].type === 'operator') {
        return {type: "Error", msg: "Expression can't start with operator"}
    }

    tokens = reduceTokens(tokens)


    const expressionStack: Expression[] = []
    const operatorStack: OperatorStackElem[] = []

    for (let i = 0; i < tokens.length; ++i) {
        const token = tokens[i]

        if (token.type === "number") {
            if (operatorStack.length === 0) {
                expressionStack.push({type: 'number', value: Number(token.value)})
            } else {
                const last = operatorStack[operatorStack.length - 1]
                if (last.type === "negative") {
                    operatorStack.pop()
                    const number:Expression = {type: 'number', value: Number(token.value)}
                    expressionStack.push({ type: 'element', elementType: ExpressionElementType.NEGATIVE, values: [number] })
                } else {
                    expressionStack.push({type: 'number', value: Number(token.value)})
                }
            }
        } else if (token.type === 'negative') {
            operatorStack.push({type: "negative"})
        } else if (token.type === "operator") {
            const op = operators.get(token.value)!
            while (operatorStack.length > 0) {
                const last = operatorStack[operatorStack.length - 1]
                if (last.type === 'bracket' || last.type ==='negative' || last.operator.priority < op.priority) break;

                operatorStack.pop()
                if (expressionStack.length < 2) {
                    return {type: "Error", msg: `Error at ${i}`}
                }

                const right = expressionStack.pop()!
                const left = expressionStack.pop()!

                expressionStack.push({type: "element", elementType: last.operator.expressionType, values: [left, right]})
            }

            operatorStack.push({type: "op", operator: op})
        } else if (token.type === "openBracket") {
            operatorStack.push({type: "bracket", bracket: token})
        } else if (token.type === "closeBracket") {

            let foundOpenBracket = false

            while (operatorStack.length > 0) {
                const last = operatorStack.pop()!
                if (last.type === 'bracket') {
                    foundOpenBracket = true
                    break
                }

                if (expressionStack.length < 2) {
                    return {type: "Error", msg: `Error att ${i}`}
                }

                const op = last as OperatorStackOpElem
                const right = expressionStack.pop()!
                const left = expressionStack.pop()!
                expressionStack.push({type: "element", elementType: op.operator.expressionType, values: [left, right]})
            }

            if (!foundOpenBracket) {
                return {type: "Error", msg: "Mismatched brackets"}
            }

            const inBracket = expressionStack.pop()!
            expressionStack.push({type: "element", elementType: ExpressionElementType.BRACKET, values: [inBracket]})
        }
    }

    while (operatorStack.length > 0) {
        const last = operatorStack.pop()!
        if (last.type === 'bracket') {
            return {type: "Error", msg: "Mismatched brackets"}
        }

        if (expressionStack.length < 2) {
            return {type: "Error", msg: `Error`}
        }

        const op = last as OperatorStackOpElem
        const right = expressionStack.pop()!
        const left = expressionStack.pop()!
        expressionStack.push({type: "element", elementType: op.operator.expressionType, values: [left, right]})
    }

    return {type: "success", expression: expressionStack[0]}
}
