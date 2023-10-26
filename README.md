## Project setup

### Step 1 - Setting up workspace
Clone the repository into your local directory.
Inside the project's root directory, open up a terminal

### Step 2 - Setting up workspace
In order to run the program, you need to install necessary dependencies. Run `npm run install:all` command. You might have to wait some time depending on your system

### Step 3 - Environment variables
In order to connect to your sql server, you need to add the required information about your database server to a new `.env` file
Create a new `.env` file that has the following text inside (don't forget to replace anything with `{text}` with real values):
* PORT=`{yourport}` <- this one is optional
* DATABASE=`{yourdatabase_name}`
* DB_USER=`{yourdatabase_username}`
* DB_PASS=`{yourdatabase_password}`
* DB_HOST=`{yourdatabase_host}`

### Step 4 - Start server
Run command `npm start` from your terminal to start the api server.

### Step 5 - Result
If you added a PORT (5000 for example) variable into the `.env` file
 - Go to http://localhost:5000, you should see "Hello world!!" text;

If you skipped adding a PORT variable into the `.env` file
 - Go to http://localhost:3000, you should see "Hello world!!" text;

# Next Steps for Backend
## Implement API routes for orders
* `/api/orderitem`
