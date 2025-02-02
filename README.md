# parcel-delivery-module
A service for arranging parcel collection and deliveries.

It is composed of multiple services, but the main service is the API (```api```, see its `README.md` for details) which can be used independently from a ```client```.
Ideally the client for this API would be something that will be used by the employees or couriers.

**NB:** Currently this system supports the basic requirements and functionality required for a parcel delivery system. This is by no means a fully featured service that covers all aspects of a parcel delivery system.


## To find out more visit:
-   **[Software Requirements Specification: Parcel Delivery System](https://docs.google.com/document/d/1DZESlczFekCYw8yuztUiBszL7SONV_vz6B3BjHBlhA4/edit?usp=sharing)**
-   **[Figma Planning Board](https://www.figma.com/file/9jCVMFEz9YHVn9jXrB2U8q/parcel_delivery_system_v1?type=whiteboard&node-id=0%3A1&t=BI4ZJeuVQGxdNfTM-1)**
-   **[API documentation](https://documenter.getpostman.com/view/14208601/2s9YsDkvFU#intro)**


### ⚡ Technologies
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)


## 📃 Local Setup
1.  Install Docker and Docker Compose from the [official Docker website](https://docs.docker.com/get-docker/).
2.  [Clone GitHub repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) on your local machine.
3.  Navigate to the project: ```cd parcel-delivery-module```.
4.  Ensure that the Docker is running.
5.  Follow and complete the `Local Setup` and `Environment Setup` for all services: `api`, and `api-db`.
6.  Build Docker images: ```docker-compose build```.
7.  Start services: ```docker-compose up```.
8.  Verify services are running with ```docker-compose ps```.
9.  Access the API by going to: ```http://localhost:9000/api/v1/parcel-delivery/```.

See [API documentation](https://documenter.getpostman.com/view/14208601/2s9YsDkvFU#intro) for the list of available endpoints.

When contributing please first read: [DEV.md](https://github.com/BUAdvDev2023/parcel-delivery-module/blob/main/DEV.md)