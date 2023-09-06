## Application Name - Trainer assist

### Purpose
the application is created for trainers and trainee's which allows the trainee to set training sessions from selected trainers with diffrent specializations , and the trainer can preview and manage he's training session.


### Usage
in terminal run npm install to install all the dependencies which are located in the package.json file
Run seed using npm run seed i-am-a-pro, this will generate three users holding three diffrent rules such as trainer, trainee, admin, running the seed will also add users with the trainer role to the Trainer collection no need to update that.
afterwards run the server using npm run start , and then run the client using npm start.
the application is requring mongo DB. in the env file there is the mongo_uri link you can change it to your own string db
There is a folder called uploads which holds all the users ulpoaded photo's, after running the seed there will be three pictures of the seed users.

### Overview 
New users can sign up as trainee or trainers.edit their own details and upload a profile picture.
trainee's can view the trainers list within the site rate them , specify fields of specialty , see how other trainee's rated them and set up a training session with their selected trainer
Trainers can view the trainning session requested by the trainee's allow them or dissaprove them.
Trainer can also add or change their specialties.
There is also an Admin account which can monitor over all the site users , edit their details and delete them.
All the users can upload profile photo's which are saved in uploads file.

### Dependencies
#### dotenv
Allows you to load environment variables from a .env file.
Used for configuring environment-specific settings.
#### express
A popular Node.js framework for building web applications.
Used for creating API endpoints and handling HTTP requests.
#### cors
Middleware for enabling Cross-Origin Resource Sharing (CORS).
Helps manage cross-origin requests between different domains.
#### helmet
A security middleware for Express.js.
Enhances your application's security by setting various HTTP headers.
#### cookie-parser
Middleware for parsing cookies in HTTP requests.
Used to handle cookies in your application.
#### morgan
HTTP request logger middleware.
Provides request logging for debugging and monitoring.
database (custom module)
Responsible for connecting to the database.
Replace with specific database library or tool you're using (e.g., MongoDB, MySQL, etc.).
errorHandler (custom middleware)
Custom error-handling middleware for handling errors in the application.
Provides a consistent way to handle errors and return appropriate responses.
#### jwt (custom module)
Custom module for working with JSON Web Tokens (JWT).
Includes functions for authentication and authorization.
#### path
A built-in Node.js module for handling file paths.
Used for working with file and directory paths in your application.
