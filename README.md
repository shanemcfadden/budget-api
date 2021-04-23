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

## Documentation

[Budget API Documentation](https://documenter.getpostman.com/view/14663488/TzJuAdH2)

## Database schema

[Budget API Database Schema](https://drawsql.app/shane-mcfadden/diagrams/budget-api)

## Running the project locally

NodeJS LTS 14.16.1+ and a mysql server instance are required to run the project locally. Yarn package manager is also recommended, but not required. If not using yarn, replace all instances of `yarn` commands with `npm` commands.

### Setup

1. Clone the budget-api repository and navigate to the home directory.
2. Run `yarn install` to install dependencies.
3. Ensure that your local mysql server is running.
4. Create a new database in your local mysql server called 'budget'.
5. If you plan to use a user other than root to connect to the database, be sure to grant said user SELECT, INSERT, UPDATE, DELETE, CREATE, and DROP privileges for the new database.

   ```sh
   # mysql CLI
   mysql> GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP ON budget.* TO '<user>'@'localhost';
   mysql> FLUSH PRIVILEGES;
   ```

6. Create the required tables by running the contents of `src/databases/queries/reset.sql`

   ```sh
   # mysql CLI
   # current directory: budget-api
   mysql> USE budget;
   mysql> source ./src/databases/queries/reset.sql;
   ```

7. Create a .env file in the root directory and add the following content to establish environment variables:

   ```txt
   # .env
   JWT_SECRET=<random string>
   MYSQL_DATABASE=budget
   MYSQL_HOST=localhost
   MYSQL_PASSWORD=<local mysql password>
   MYSQL_USER=<local mysql user>
   PORT=3000
   ```

8. Test that setup succeeded by running `yarn run dev`. App will display the following when set up successfully:

   ```sh
   App is listening on port 3000
   Connected to MySql server
   ```

### Running in development mode

The development server can be run in default mode by running `yarn run dev` or in watch mode by running `yarn run dev:watch`. When making file changes, it is recommended to run the server in watch mode, as it will restart the server with every change saved to typescript files.

**Watch mode does not track changes to SQL files.** If you make a change to a .sql file, restart the server manually to serve the changes.

### Running in production mode

The production server runs the javascript build using the process manager pm2. This allows for multiple instances of the server to run at once, and instances will automatically restart if an uncaught error crashes the application.

1. Run `yarn build` to compile the typescript source code into javascript.
2. Run `yarn start` to spin up the server. While the server is running, you may run `npx pm2 status` to monitor all instances.
3. Run `yarn stop` to stop all instances and delete their processes.

## Testing

### Unit tests

Run all unit tests by running `yarn test`. To test while watching for file changes, run `yarn test:watch`.

### Integration tests

Run integration tests by importing `integration-tests.postman_collection.json` into Postman. While the server is running on your local machine, run the collection's test using the collection runner.

**Note: the default value for the baseUrl collection variable is 'localhost:3000'.** If you are running your server on a different port, update the variable before running the tests.
