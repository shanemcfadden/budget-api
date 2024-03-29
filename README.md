# Budget API

For the past few years, I've been tracking my income and expenses in a Google Sheets file for each year. I list each transaction in a monthly sheet and label it according to the type of transaction (Travel, Food, Rent, etc) and the account it is associated with. This has mostly worked well, but as the number of transactions grows throughout the year, calculating the current balance for each account and the total spent in each category becomes an incredibly expensive (i.e. slow) process for the front end of the application. In addition, migrating to a new Google Sheets file at the beginning of every year is incredibly time consuming. I wanted something more scalable.

As a result, I built this REST API for a simple budget tracking application from scratch using Typescript, Express, and MySQL. Users can create multiple budgets and track their income and expenses across various bank accounts and transaction categories. I designed this API to be coupled with a front-end web or mobile application that could display transaction data using tables and charts. It still doesn't have all of the features of my Google Sheets files, but I plan to continue building it until it suits my needs. Because the API stores strictly budget data (instead of an entire Sheets file with cell size, formatting, etc.), it's my hope that this API will run faster and scale much more easily than my previous setup.

## Technology used

- Typescript
- NodeJS
- Express (NodeJS web framework)
- MySQL (SQL Database)
- JSON Web Tokens (Authentication)
- Mocha, Chai, & Sinon (unit tests)
- Postman (integration tests/documentation)

## Skills improved

- Organize code and make it more DRY by separating routing, validation, controller, and model logic.
- Implement authentication using JSON Web Tokens.
- Query a database without an ORM by passing escaped variables into SQL files dynamically.
- Write unit tests that explore both happy and unhappy paths.
- Automate integration tests in Postman.
- Write documentation.
- Test on various versions of NodeJS using node version manager.

## Possible next steps

- Build front-end web application to connect to this API
- Include routes that allow users to get transactions by account/category/subcategory/date. That would allow users with larger budgets to only retrieve the data they need for a given session.
- Allow users to add transfers between accounts.
- Allow users to add other authorized users to view/edit their budgets.
- Allow users to track predicted monthly income/expenses by category.
- Write integration tests for unhappy paths.
- Consider Swagger as an alternative to Postman for executable API documentation.

## Documentation

[Budget API Documentation](https://documenter.getpostman.com/view/14663488/TzJuAdH2)

[![Budget API Documentation](images/APIDocumentation.jpg)](https://documenter.getpostman.com/view/14663488/TzJuAdH2)

## Database schema

[Budget API Database Schema](https://drawsql.app/shane-mcfadden/diagrams/budget-api)

[![Budget API Database Schema](images/databaseSchema.jpg)](https://drawsql.app/shane-mcfadden/diagrams/budget-api)

## Run project locally

NodeJS v14.0.0+ and a MySQL server instance are required to run the project locally. Yarn package manager is also recommended, but not required. If not using yarn, replace all instances of `yarn` commands with `npm` commands.

### Build

1. Clone the budget-api repository and navigate to the home directory.
2. Run `yarn install` to install dependencies.
3. Ensure that your local MySQL server is running.
4. Create a new database in your local MySQL server called 'budget'.
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
   MYSQL_PASSWORD=<local MySQL password>
   MYSQL_USER=<local MySQL user>
   PORT=3000
   ```

8. Test that setup succeeded by running `yarn run dev`. App will display the following when set up successfully:

   ```sh
   App is listening on port 3000
   Connected to MySQL database
   ```

### Test

#### Unit tests

Run all unit tests by running `yarn test`. To test while watching for file changes, run `yarn test:watch`.

![Run unit tests](images/unitTests.gif)

#### Integration tests

Run integration tests by importing `integration-tests.postman_collection.json` into Postman. While the server is running on your local machine, run the collection's test using the collection runner.

**Note: the default value for the baseUrl collection variable is 'localhost:3000'.** If you are running your server on a different port, update the variable before running the tests.

![Run integration tests](images/integrationTests.gif)

### Run

#### Development server

The development server can be run in default mode by running `yarn run dev` or in watch mode by running `yarn run dev:watch`. When making file changes, it is recommended to run the server in watch mode, as it will restart the server with every change saved to typescript files.

**Watch mode does not track changes to SQL files.** If you make a change to a .sql file, restart the server manually to serve the changes.

#### Production server

The production server runs the javascript build using the process manager pm2. This allows for multiple instances of the server to run at once, and instances will automatically restart if an uncaught error crashes the application.

1. Run `yarn build` to compile the typescript source code into javascript.
2. Run `yarn start` to spin up the server. While the server is running, you may run `npx pm2 status` to monitor all instances.
3. Run `yarn stop` to stop all instances and delete their processes.
