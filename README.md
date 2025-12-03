STUDENT TEACHER APPOINTMENT BOOKING
-----------------------------------

Author: Baibhab Roy
Domain: Front end Development
Technologies: HTML, CSS, JavaScript, Firebase
Difficulty Level: Easy

PROBLEM STATEMENT
-----------------

Traditional appointment systems cause delays, long queues, and inconvenience.
This project solves that by building a web-based appointment booking system that allows:

Students to book appointments anytime

Teachers to approve/reject bookings

Admins to manage teachers & system users

Accessible from any device through the internet.
Built with Firebase for real-time database, authentication, and security.

SYSTEM MODULES
--------------
ADMIN

> Add Teacher
> Update / Delete Teacher
> Approve registered students
> Manage system data
> View all teachers
> Logging of all admin actions

TEACHER
>Login
>View scheduled appointments
>Approve / Cancel appointments
>View messages sent by students
>View complete appointment history

STUDENT
>Register
>Login
>Search teachers
>Book appointment
>Send purpose/message
>View appointment status

FEATURES
--------

AUTHENTICATION
>Firebase Authentication (Email + Password)
>Separate login for Student / Teacher / Admin

DATABASE
>Firestore Collections:
  students
  teachers
  admin

LOGGING
>Every action (login/logout, booking, update) is logged using:
  JavaScript logging functions
  Stored inside browser console or Cloud Logging (optional)

SYSTEM ARCHITECTURE
-------------------
1. CLIENT SIDE (Browser)
   HTML/CSS/JS → Sends requests → Firebase

2. BACKEND (FireBase Services)
   >Firebase Auth (Login/Registration)
   >Firestore (Data storage and real-time syncing)

3. DATA FLOW
  >User logs in → Firebase Authentication validates credentials
  >User info fetched from Firestore
  >UI updates according to user role
  >Appointment stored under /appointments
  >Teacher/admin actions update Firestore
  >Real-time updates visible without page refresh

TEST CASES
----------

| Test Case         | Input                   | Expected Output               |
| ----------------- | ----------------------- | ----------------------------- |
| Student Login     | correct email/pass      | Redirect to student-dashboard |
| Student Login     | wrong password          | Error popup message           |
| Admin Add Teacher | valid data              | Teacher appears in DB + table |
| Logout            | click logout            | Redirect to login page        |


OPTIMIZATION
------------
Code Optimization
  >Reusable Firebase functions
  >Centralized script.js
  >Removed repeated DOM queries
  >Clean class-based event handling
  >Architecture Optimization
  >Real-time listeners only when needed
  >LocalStorage caching

AUTHOR
------
NAME: Baibhab Roy
EMAIL: baibhabrofficial@gmail.com












