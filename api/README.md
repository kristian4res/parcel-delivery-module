# parcel-delivery-module API
The standalone API of the parcel-delivery-module. It is responsible for arranging and handling delivery requests. It stores data in a MySQL database.

See **[API documentation](https://documenter.getpostman.com/view/14208601/2s9YsDkvFU#intro)** for more information.

### ⚡ Technologies
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

## 🖥️ Getting Started
1.  Follow [Local Setup](#-local-setup) and run the API.
2.  Create an account using a HTTP client, e.g. [Postman](https://www.postman.com/). For simplicity, this walkthrough will use cURL.
```curl
curl --location --request POST 'localhost:9000/api/v1/parcel-delivery/auth/register' \
--header 'Content-Type: application/json' \
--data '{
    "username": "testuser",
    "password": "TestPassword123!"
}'
```
3.  Log in to your account, completing this will give you a token for authentication in subsequent requests. 
**NB:** Using cURL like the example below will create a file called `cookies.txt` to store the cookies, which will be stored in the current working directory. However, if you are using a GUI-based client like Postman, you don't need to worry about this.  
```curl
curl --location --request POST 'localhost:9000/api/v1/parcel-delivery/auth/login' \
--header 'Content-Type: application/json' \
--data '{
    "username": "testuser",
    "password": "TestPassword123!"
}' -c cookies.txt
```
4.  Make requests:
```curl
<!-- Example Request A: Create new delivery -->
curl --location --request POST 'localhost:9000/api/v1/parcel-delivery/delivery/' \
--header 'Content-Type: application/json' \
--data '{
    "orderId": "25345678949339",
    "serviceLevel": "Express",
    "recipientAddress": "123 Main St, Anytown, USA"
}' -b cookies.txt

<!-- Example Request B: Check newly created delivery -->
curl --location --request GET 'localhost:9000/api/v1/parcel-delivery/delivery?orderId=25345678949339' \
 -b cookies.txt
```
5. Once you're done, you can delete the cookies by removing `cookies.txt` which will end your session. **NB:** If you are using a GUI-based client, you can clear it going to the logout endpoint:
`localhost:9000/api/v1/parcel-delivery/auth/logout`. 

### 🔐 Authentication
This API features its own authentication system using JWTs and cookies. In a microservices architecture, ideally the authentication system should be a separate and standalone service that all other services can use, to make their interactions simpler and easier to manage. Also, delegating the user authentication to a separate service will help improve cohesion and reduce coupling.

## 📃 Local Setup
**Prerequisites:** NodeJS (LTS version), Docker (+ Compose)

1.  [Clone GitHub repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) on your local machine.
2.  Navigate to the project: 
```
cd parcel-delivery-module/api
```
3. Configure and setup the `api-db` service by following its `README.md`.
4. Install API dependencies: 
```
npm install
``` 
5. Setup `api` environment variables by following [Environment Setup](#-environment-setup).
6. Ensure Docker is running.
7. Ensure you've set up `api-db` and in a separate terminal (inside `api` directory), run the `api-db` service: 
```
npm run test:run-mysql
```
8. Run the API: 
```
npm run dev
```

## 🌲 Environment Setup
To run the application, you will need to set environment variables. These are typically secrets that should not be shared, so ⚠️ **ensure you do not commit or upload this file** ⚠️.

1.  Create a `.env` file within `api`.
2.  Add the following variables to the `.env` file and assign the appropriate value to each:
```
SESSION_SECRET=your_session_secret
TOKEN_SECRET=your_token_secret
JWT_SECRET=your_jwt_secret
DATABASE_HOST=your_db_host
DATABASE_PORT=your_db_port
DATABASE_SCHEMA=your_db_name
DATABASE_USERNAME=your_db_username
DATABASE_PASSWORD=your_db_password
```
**NB:** The database variables must match with your `api-db` service details.


## 🧪 Testing
**Prerequisites:** You have followed and completed [Local Setup](#-local-setup) and [Environment Setup](#-environment-setup).

Run test suites:
```
npm run test
```
Run test suites (watch):
```
npm run test:watch
```