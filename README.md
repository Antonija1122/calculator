# Simple Calculator

This is simple NodeJS + Typescript calculator. Frontend
is developed using React framework.

[Shunting yard](https://en.wikipedia.org/wiki/Shunting_yard_algorithm) algorithm is used for parsing math expression
and building Expression tree. 


## Build

### With Docker
If you already use Docker, this project can be easily 
installed by:

```docker build -t simple-calculator .```

It will build docker image that can be run with: 

```docker run -p 8080:8080 simple-calculator```

It will map docker's exposed `8080` port to local `8080` port. If this
port is already used you can try to with argument `-p 8080:8081` or some 
other port.

### Without Docker

First go into `frontend` folder and type:

```npm install```

```npm run build```

After that go into `server` folder and type:

```npm install```

```npm run build```

```node .```

It will start server on local port `8080`
