import {ExpressionElementType} from "../expression/expression_element";

export interface Operator {
    expressionType: ExpressionElementType
    priority: number
}


export const operators: Map<string, Operator> = new Map([
    [ "+", { expressionType: ExpressionElementType.ADD, priority: 0 } ],
    [ "-", { expressionType: ExpressionElementType.SUB, priority: 0 } ],
    [ "*", { expressionType: ExpressionElementType.MUL, priority: 1 } ],
    [ "/", { expressionType: ExpressionElementType.DIV, priority: 2 } ],
])
