import {NumberToken, reduceTokens, tokenize} from "../src/parser/tokenizer";
import {parse} from '../src/parser/parser'
import {evaluateExpression} from "../src/expression/expression_element";

test("1 + 1 -> Tokens", () => {
    const tokens = tokenize("1 + 1")
    expect(tokens.length).toEqual(3)
    expect(tokens[0].type === 'number' && tokens[1].type === 'operator' && tokens[2].type === 'number').toEqual(true)
})

test("12 + 12 -> Tokens", () => {
    const tokens = tokenize("12 + 12")

    expect(tokens.length).toEqual(3)
    expect(tokens[0].type).toEqual("number")

    const firstToken = tokens[0] as NumberToken

    expect(firstToken.value).toEqual("12")
})

test("1 +++ 1 -> Reduce", () => {
    const tokens = reduceTokens(tokenize("1 +++ 1"))

    expect(tokens.length).toEqual(3)
})


test("1 +--- 1 -> Reduce", () => {
    const tokens = reduceTokens(tokenize("1 +--- 1"))
    expect(tokens.length).toEqual(6)
})

function evaluate(s: string): number | undefined {
    const result = parse(tokenize(s))

    if (result.type !== 'success') return undefined

    return evaluateExpression(result.expression)
}

test("Evaluate", () => {
    expect(evaluate("20 + 30")).toEqual(50)

    expect(evaluate("1 + 2 * (3 + 4)")).toEqual(15)
    expect(evaluate("1 + 2 - (4 + 5)")).toEqual(-6)
    expect(evaluate(" 1 + 2")).toEqual(3)
    expect(evaluate("1 * 2")).toEqual(2)
    expect(evaluate("10 + 12 * 3 - 4 * 6 + 12 - (3 + 2 - 1 * 6)")).toEqual(35)

    expect(evaluate("-1*3 + 4")).toEqual(1)
    expect(evaluate("1 + 2(3 + 4)")).toEqual(15)
})
