# Budget API

A REST API for a simple budget tracking application. Users can create multiple budgets and track their income and expenses across bank accounts and transaction categories. I designed this API to be coupled with a front end web or mobile application that could display transaction data using tables and charts.

## Tools used

- Typescript
- MySQL
- Express (NodeJS web framework)
- Mocha, Chai, & Sinon (unit tests)
- Postman (integration tests/documentation)

## Things learned

- How to organize code and make it more DRY by separating routing, controller, and model logic.
- How to query a database without an ORM by passing escaped variables into SQL files dynamically.
- How to write unit tests that explore both happy and unhappy paths.
- How to automate integration tests in Postman.
- How to write documentation.

## Possible next steps

- Include routes that allow users to get transactions by account/category/subcategory/date. That would allow users with larger budgets to only retrieve the data they need for a given session.
- Allow users to add other authorized users to view/edit their budgets.
- Write integration tests for unhappy paths.

## Running the Project Locally

NodeJS LTS 14.16.1+ and mysql server are required to run the project locally. Yarn package manager is also recommended, but not required.

### Setup

1. Clone the repository and navigate to the home directory
2. run `yarn install` or `npm install` to install dependencies
3. Create a .env file and add the following content to establish environment variables:

```
PORT=3000
JWT_SECRET=<random string>
MYSQL_HOST=localhost
MYSQL_USER=<local mysql user>
MYSQL_PASSWORD=<local mysql password>
MYSQL_DATABASE=budget
```

4. Create a new database in your local mysql instance. **If you choose to use a user other than root to connect to the database, be sure to grant said user SELECT, INSERT, UPDATE, DELETE, CREATE, and DROP privileges for the new database.** This can be accomplished using the mysql cli like so:

```
mysql> GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP ON budget.* TO '<user>'@'localhost';
mysql> FLUSH PRIVILEGES;
```

5. Create the required tables by running the query in \_\_rootdir/src/databases/queries/reset.sql

```
# current directory: budget-api
mysql> USE budget;
mysql> source ./src/databases/queries/reset.sql;
```

6. Test that setup succeeded by running `yarn run dev` or `npm run dev`. App will display the following when running successfully:

```
App is listening on port 3000
Connected to MySql server
```

## Running in Development mode

The development server can be run in default mode by running `yarn run dev` or in watch mode by running `yarn run dev:watch`. When making file changes, it is recommended to run the server in watch mode, as it will restart the server with every change saved to typescript files.

**Watch mode does not track changes to .sql files.** If you make a change to a .sql file, restart the server manually to serve the changes.

## Running in Production mode

The production server runs the javascript build using the process manager pm2. This allows for multiple instances of the server to run at once, and instances will automatically restart if an uncaught error crashes the application.

1. Run `yarn build` to compile the typescript source code into javascript.
2. Run `yarn start` to spin up the server. While server is running, you may run `npx pm2 status` to monitor all instances.
3. Run `yarn stop` to stop the servers and delete their processes.

## Testing

### Unit tests

Run all unit tests by running `yarn test`. To test while watching for changes, run `yarn test:watch`.

### Integration tests

Run integration tests by importing `integration-tests.postman_collection.json` into Postman. While the server is running on your local machine, run the collection's test by using the collection runner.

**Note: the default value for the baseUrl collection variable is 'localhost:3000'.** If you are running your server on a different port, update the variable before running the tests.
