import express from 'express'
import {parse} from "./parser/parser";
import {tokenize} from "./parser/tokenizer";
import {evaluateExpression} from "./expression/expression_element";
const cors = require('cors')

import path from "path"

const app = express()
app.use(cors())

const server = app.listen(8080, "0.0.0.0", () => {
    console.log("Listening...")
})

app.use(express.json())
app.use(cors())
app.post("/evaluate", (request, response) => {

    const input = request.body.input

    const result = parse(tokenize(input))

    if (result.type !== 'success') {
        response.send( { status: "Error", description: result.msg })
        return
    }

    const value = evaluateExpression(result.expression)

    response.send({ status: "OK", value: value } )
})


var buildPath = "../../frontend/build/"
app.use(express.static(path.join(__dirname, buildPath)))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, buildPath, "index.html"))
})


process.on('SIGTERM', () => server.close())
process.on('SIGINT', () => server.close())
