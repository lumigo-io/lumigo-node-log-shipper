# lumigo-node-log-shipper

[`@lumigo/lumigo-log-shipper`](https://) is Lumigo's log shipper for Node.js.

## Usage 

Install `@lumigo/lumigo-log-shipper`:

npm: 
~~~bash
$ npm i @lumigo/lumigo-log-shipper
~~~

In your lambda's code: 
~~~js
const LumigoLogger = require("@lumigo/lumigo-log-shipper");

module.exports.<HANDLER_NAME> = (event, context, callback) => {
  LumigoLogger.shipLogs(event); 
};
~~~

With programtic error:
~~~js
const LumigoLogger = require("@lumigo/lumigo-log-shipper");

module.exports.<HANDLER_NAME> = (event, context, callback) => {
  LumigoLogger.shipLogs(event, "[Error]"); 
};
~~~
Add to your lambda's `serverless.yml`
```bash
    - Effect: Allow
      Action:
        - "sts:AssumeRole"
      Resource:
        - "*"
```