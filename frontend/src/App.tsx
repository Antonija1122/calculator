import React, {useState} from 'react';

import styles from './App.module.scss'

interface StatusOk {
    status: "OK"
    value: string
}

interface StatusError {
    status: "Error"
    description: string
}

interface OperatorClick {
    type: "operator"
    value: string
}

interface TextClick {
    type: "text"
    value: string
}

interface ClearClick {
    type: "clear"
}

interface EqClick {
    type: "eq"
}

type KeyboardEvent = OperatorClick | TextClick | ClearClick | EqClick

interface KeyboardProps {
    onClick: (ev: KeyboardEvent) => void
}

const Keyboard: React.FunctionComponent<KeyboardProps> = (props) => {

    const operators = ["+", "-", "*", "/"]
    const values = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0"]

    return (
        <div className={styles.Keyboard}>

            {operators.map((v, key) => (
                <button key={`op${key}`} className={`${styles.Button} ${styles.Operator}`}
                        onClick={() => props.onClick({type: "operator", value: v})}>{v}</button>
            ))}

            {values.map( (v, key) => (
                <button key={`num${key}`} className={styles.Button} onClick={() => props.onClick({type: "text", value: v})}>{v}</button>
            ))}
            <button key={'dot'} className={styles.Button}>.</button>

            <button key={'lb'} className={`${styles.Button} ${styles.OpenBracket}`} onClick={() => props.onClick({type: "text", value: "("})}>(
            </button>
            <button key={'rb'} className={`${styles.Button} ${styles.CloseBracket}`} onClick={() => props.onClick({type: "text", value: ")"})}>)
            </button>
            <button key={'ac'} className={`${styles.Button} ${styles.AC}`} onClick={() => props.onClick({type: "clear"})}>AC</button>
            <button key={'eq'} className={`${styles.Button} ${styles.EQ}`} onClick={() => props.onClick({type: "eq"})}>=</button>
        </div>
    )
}

const App: React.FunctionComponent = () => {

    const [inputValue, setInputValue] = useState<string>("")
    const [result, setResult] = useState<StatusOk | StatusError>()

    const solveExpression = async () => {

        const result = await fetch("/evaluate", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({input: inputValue})
        })

        const json = await result.json()
        setResult(json)
    }

    const renderResult = () => {
        if (result === undefined) return null

        if (result.status === "Error") {
            return <div className={styles.Error}>ERROR: {result.description}</div>
        }

        return <div className={styles.Success}>Result: {result.value}</div>
    }

    const onKeyboardClick = (ev: KeyboardEvent) => {
        if (ev.type === "text") {
            setInputValue(s => s + ev.value)
        } else if (ev.type === "clear") {
            setInputValue("")
        } else if (ev.type === "operator") {
            setInputValue(s => s + ev.value)
        } else if (ev.type === "eq") {
            solveExpression()
        }
    }

    return (
        <div className={styles.App}>

            <div className={styles.Header}>Simple Calculator</div>

            <input className={styles.Input} type={"text"} value={inputValue} disabled={true}/>

            <div className={styles.Result}>{renderResult()}</div>

            <Keyboard onClick={onKeyboardClick}/>
        </div>
    )
}

export default App;
