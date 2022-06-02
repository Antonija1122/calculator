import {operators} from "./operators";

export interface NumberToken {
    type: 'number'
    value: string
}

export interface OperatorToken {
    type: 'operator'
    value: string
}

export interface NegativeOperatorToken {
    type: 'negative'
}

export interface OpenBracketToken {
    type: 'openBracket'
}

export interface CloseBracketToken {
    type: 'closeBracket'
}

export type Token = NumberToken | OperatorToken | OpenBracketToken | CloseBracketToken | NegativeOperatorToken


function isDigit(v: string) {
    return v >= "0" && v <= "9"
}

function isOperator(v: string) {
    return operators.has(v)
}

function isDecimalPoint(v: string) {
    return v === '.'
}

function isOpenBracket(v: string) {
    return v === '('
}

function isCloseBracket(v: string) {
    return v === ')'
}

function isSpace(v: string) {
    return v === ' ' || v === '\t'
}

function isNegativeOperator(v: string) {
    return v === '-'
}

/**
 * Take tokens and reduce to new array. Convert expressions like:
 *      2 +++ 2 -> 2 + 2
 *      2 +- 2 -> 2 - 2
 *      2 -+ 2 -> 2 - 2
 *      2 -- 2 -> 2 + 2
 * @param tokens
 */

export function reduceTokens(tokens: Token[]): Token[] {
    const reducedTokens: Token[] = []

    for (let i = 0; i < tokens.length; ++i) {
        const token = tokens[i]

        if (token.type !== 'operator' || reducedTokens.length === 0) {
            if (reducedTokens.length === 0) {
                reducedTokens.push(token)
                continue
            }

            if (token.type === "openBracket" && reducedTokens[reducedTokens.length - 1].type === 'number') {
                reducedTokens.push({type: "operator", value: '*'})
            }
            reducedTokens.push(token)
        } else {
            const last = reducedTokens[reducedTokens.length - 1]

            if (last.type !== 'operator') {
                reducedTokens.push(token)
                continue
            }

            const currentOperator = token as OperatorToken
            const lastOperator = last as OperatorToken

            if (currentOperator.value === "+") {
                continue
            } else if (lastOperator.value === "+" && currentOperator.value === "-") {
                reducedTokens.pop()
                reducedTokens.push(currentOperator)
            } else if (lastOperator.value === "-" && currentOperator.value === "-") {
                reducedTokens.pop()
                reducedTokens.push({type: "operator", value: "+"})
            } else {
                reducedTokens.push(last)
            }
        }
    }

    return reducedTokens
}

export function tokenize(s: string): Token[] {

    const tokens: Token[] = []

    let numberBuffer: string[] = []

    const createNumberToken = () => {
        if (numberBuffer.length !== 0) {
            tokens.push({type: 'number', value: numberBuffer.join("")})
            numberBuffer = []
        }
    }

    for (let i = 0; i < s.length; ++i) {
        const c = s.charAt(i)
        if (isSpace(c)) continue

        if (isDigit(c) || isDecimalPoint(c)) {
            numberBuffer.push(c)
        } else {
                createNumberToken()
            if (isNegativeOperator(c)) {
                if (tokens.length === 0) {
                    tokens.push({type: 'negative'})
                    continue
                } else {
                    const last = tokens[tokens.length - 1]
                    if (last.type != "number" && last.type != 'closeBracket') {
                        tokens.push({type: 'negative'})
                        continue
                    }
                }
            }
            if (isOperator(c)) {
                tokens.push({type: 'operator', value: c})
            } else if (isOpenBracket(c)) {
                tokens.push({type: 'openBracket'})
            } else if (isCloseBracket(c)) {
                tokens.push({type: 'closeBracket'})
            }
        }
    }

    createNumberToken()

    return tokens
}
