
export enum ExpressionElementType {
    ADD = 0,
    SUB,
    MUL,
    DIV,
    NEGATIVE,
    BRACKET
}


export interface ExpressionNumber {
    type: "number"
    value: number
}

export interface ExpressionElementWithChild {
    type: "element"
    elementType: ExpressionElementType
    values: Expression[]
}

export type Expression = ExpressionNumber | ExpressionElementWithChild

function typeToString(t: ExpressionElementType): string {
    switch (t) {
        case ExpressionElementType.ADD:
            return "+"
        case ExpressionElementType.SUB:
            return "-"
        case ExpressionElementType.MUL:
            return "*"
        case ExpressionElementType.DIV:
            return "/"
    }

    return ""
}

export function expressionToString(e: Expression): string {

    if (e.type === "number") {
        return e.value.toString()
    }

    if (e.elementType === ExpressionElementType.BRACKET) {
        return `(${expressionToString(e.values[0])})`
    }

    return expressionToString(e.values[0]) + typeToString(e.elementType) + expressionToString(e.values[1])
}

export function evaluateExpression(e: Expression): number {

    if (e.type === "number") {
        return e.value
    }

    if (e.elementType === ExpressionElementType.BRACKET) {
        return evaluateExpression(e.values[0])
    }

    if (e.elementType === ExpressionElementType.NEGATIVE) {
        return -1 * evaluateExpression(e.values[0])
    }

    const fun = (() => {
        switch (e.elementType) {
            case ExpressionElementType.ADD:
                return (a: number, b: number) => a + b
            case ExpressionElementType.SUB:
                return (a: number, b: number) => a - b
            case ExpressionElementType.MUL:
                return (a: number, b: number) => a * b
            case ExpressionElementType.DIV:
                return (a: number, b: number) => a / b
        }

    })()

    return fun(evaluateExpression(e.values[0]), evaluateExpression(e.values[1]))
}
