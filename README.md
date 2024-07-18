# Patient Notifier Frontend

This is the frontend part of the Patient Notifier system, which is a React application designed to manage patient information and send notifications based on specific criteria.

## Overview

The frontend application includes functionalities to:
- View the list of patients.
  - Allows searching through the list of patients.
  - Retrieves patient data dynamically from the database.
  - Displays patient details including name, age, and contact information.
![Patient List](https://github.com/user-attachments/assets/fae1ac2b-619f-4737-892f-af7a0e293f57)

- Add a new patient.
  - Takes input for patient details such as name, age, gender, and contact information.
  - Validates input fields; for example, it shows an alert if the name field is left empty and does not accept the submission.
  - Adds the new patient to the database upon successful validation.
![add_patient](https://github.com/user-attachments/assets/8f0d8f3e-20ba-4fc0-a1d0-c1f33d8e2e3a)

- Edit patient information.
  - Provides a form to edit existing patient details.
  - Validates inputs similar to the add patient functionality.
  - Updates the patient information in the database upon successful validation.

- Delete a patient.
  - Allows the user to remove a patient from the list.
  - Confirms the deletion action to prevent accidental deletions.

- Send notifications to patients.
  - Simulates sending notifications to patients based on their preferences (e.g., email, SMS).
  - Lists successful delivery results, indicating which patients received the notifications.
![startsending](https://github.com/user-attachments/assets/a3437d82-a42d-46bc-865d-eb819ebf8b00)

- View the list of Target Criteria.
  - Displays a list of patients who meet specific target criteria.
![target table](https://github.com/user-attachments/assets/36c5e206-67e7-404c-9804-cbcc80650fe9)



## Getting Started

These instructions will help you set up and run the frontend application on your local machine for development and testing purposes.

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/patient-notifier-frontend.git
    ```
2. Navigate to the project directory:
    ```sh
    cd patient-notifier-frontend
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

### Running the Application

To start the development server:
```sh
npm start
```
This will run the application in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


## API Endpoints

### Get All Patients
- **URL**: `/patients`
- **Method**: `GET`
- **Description**: Retrieves all patients.
- **Response**: `List<Patient>`

### Get Filtered Patients
- **URL**: `/patients/filtered`
- **Method**: `GET`
- **Description**: Retrieves all filtered patients based on criteria.
- **Response**: `List<FilteredPatient>`

### Add a New Patient
- **URL**: `/patients`
- **Method**: `POST`
- **Description**: Adds a new patient.
- **Request Body**: `Patient`
- **Response**: `void`

### Update an Existing Patient
- **URL**: `/patients/{id}`
- **Method**: `PUT`
- **Description**: Updates an existing patient by ID.
- **Request Body**: `Patient`
- **Response**: `ResponseEntity<?>`

### Delete a Patient
- **URL**: `/patients/{id}`
- **Method**: `DELETE`
- **Description**: Deletes a patient by ID.
- **Response**: `void`

### Find Patients by Name
- **URL**: `/patients/findByName/{name}`
- **Method**: `GET`
- **Description**: Finds patients by name.
- **Response**: `List<Patient>`

### Search Patients with Multiple Criteria
- **URL**: `/patients/search`
- **Method**: `GET`
- **Description**: Searches patients with multiple criteria (name, gender, age range).
- **Response**: `List<Patient>`

### Find Patients by Age Range
- **URL**: `/patients/findByAgeRange/{minAge}/{maxAge}`
- **Method**: `GET`
- **Description**: Finds patients by age range.
- **Response**: `List<Patient>`

### Find Patients by Notification Preference
- **URL**: `/patients/findByNotificationPreference/{preference}`
- **Method**: `GET`
- **Description**: Finds patients by notification preference.
- **Response**: `List<Patient>`

### Send Notifications to Patients
- **URL**: `/patients/sendNotifications`
- **Method**: `POST`
- **Description**: Simulates a system that sends notifications to patients based on their preferences and lists successful delivery results.
- **Response**: `ResponseEntity<List<NotificationResult>>`

