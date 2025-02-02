# 

[**1. Introduction 3**](#introduction)

> [1.1 Document Purpose 3](#document-purpose)
>
> [1.2 Document Scope 3](#document-scope)
>
> [1.3 Intended Audience 3](#intended-audience)

[**2. Project Overview & Scope 3**](#project-overview-scope)

> [2.1 Overview 3](#overview)
>
> [2.2 Scope 3](#scope)

[**3. Functional Requirements 3**](#functional-requirements)

> [3.1 Receiving and Validating Delivery Requests
> 3](#receiving-and-validating-delivery-requests)
>
> [3.2 Generating Delivery Information
> 4](#generating-delivery-information)
>
> [3.3 Tracking Deliveries 4](#tracking-deliveries)
>
> [3.4 Updating Deliveries 4](#updating-deliveries)

[**4. Non-Functional Requirements 4**](#non-functional-requirements)

> [4.1 Performance 4](#performance)
>
> [4.2 Security 4](#security)

## **1. Introduction**

### **1.1 Document Purpose**

This Software Requirements Specification (SRS) outlines the baseline
requirements for the development of a Parcel Delivery System.

### **1.2 Document Scope**

The SRS defines the functional requirements for the Parcel Delivery
System, specifying what it should do and how it should perform.

### **1.3 Intended Audience**

This document is intended for the development team, project
stakeholders, and anyone involved in the design, development, or testing
of the system.

## **2. Project Overview & Scope**

### **2.1 Overview**

-   The Parcel Delivery System is designed to receive, validate, and
    process delivery requests, generate delivery information, track and
    update deliveries. The system will provide basic functionalities to
    streamline the arrangement and management of parcel deliveries.

### **2.2 Scope**

-   The Parcel Delivery System will be designed to manage and fulfill
    deliveries for the company.

## **3. Functional Requirements**

### **3.1 Receiving and Validating Delivery Requests**

1.  The system should be able to receive and validate delivery requests
    to ensure they contain the required information in JSON format.

2.  The system should provide endpoints for receiving delivery requests
    that will create or update delivery records.

3.  The system should validate delivery requests for the presence of the
    following:

    1.  Required information:

        -   Recipient's address

        -   Delivery service level (e.g., standard, express)

### **3.2 Generating Delivery Information**

1.  The system should generate delivery information to be serialized in
    JSON format.

2.  The system should generate delivery information when arranging
    deliveries.

### **3.3 Tracking Deliveries**

1.  The system should track deliveries and provide customers with
    information on:

    1.  Delivery ID

    2.  Delivery status

    3.  Estimated delivery date

### **3.4 Updating Deliveries**

1.  The system should provide a way for couriers to easily update the
    status of a parcel.

## **4. Non-Functional Requirements**

### **4.1 Performance**

1.  The system should respond to delivery requests and tracking queries
    in a timely manner.

2.  It should be able to handle a high volume of concurrent delivery
    requests and tracking inquiries.

### **4.2 Security**

1.  User data and delivery information should be stored securely and
    encrypted during transmission.

2.  Access to the system's APIs should be properly authenticated and
    authorized.
