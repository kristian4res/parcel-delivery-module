# parcel-delivery-module - Backend API Database
The database for the backend API of parcel-delivery-module.
It is meant to be used with the backend API (`api`).

### ⚡ Technologies
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)


## 🌲 Environment Setup
To spin up the database in Docker, you will need to set environment variables. These are typically secrets that should not be shared, so ⚠️ **ensure you do not commit or upload this file** ⚠️.


1.  Create a `.env` file within `api-db`.
2.  Add the following variables to the `.env` file and assign the appropriate value to each:
```
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=your_database_name
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
```
**NB:** For the backend API (`api`) and the database, to interact with each other, the user details in the `.env` files for `api-db` and `api` must match.