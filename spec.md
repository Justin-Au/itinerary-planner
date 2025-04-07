# Let's create a markdown file based on the comprehensive spec.

spec_content = """
# Itinerary Planner - Developer Specification

## 1. Project Overview
The **Itinerary Planner** app helps casual travelers create and manage travel itineraries. The MVP will allow users to manually input itinerary items such as flights, hotels, Airbnb, activities, transportation, and restaurants. The app will also include functionality to adjust dates and times via drag-and-drop, calculate total costs, and provide a daily cost summary. Users will have the option to log in via Google OAuth or create an account using an email address and password. The app will be deployed on **Heroku** for the web, and **Expo** will be used for the mobile app to ensure over-the-air updates.

## 2. Technical Requirements

### 2.1. Frontend
- **Web App**: Built using **React** for dynamic rendering.
- **Mobile App**: Built using **React Native** with **Expo** for cross-platform support.
- **UI/UX**: Minimalistic and intuitive, focusing on essential functionality for itinerary management.

### 2.2. Backend
- **API**: **REST API** using **Node.js** with **Express** for handling HTTP requests and routing.
- **Authentication**:
  - **Google OAuth** for third-party authentication.
  - **Email/Password** login for users who prefer to register without Google login.
- **Session Management**: Use **session-based authentication** (stored on the server) to manage user sessions.
- **Database**: 
  - **PostgreSQL** for the web app.
  - **SQLite** for offline storage on the mobile app.
  - **Prisma** will be used for database migrations.

### 2.3. Database Structure
- **Tables**:
  - **Users**: To store user account data.
  - **Itineraries**: Stores the main itinerary data, linked to users.
  - **Items**: Stores individual itinerary items (e.g., flights, hotels, etc.), linked to itineraries.
  - **Categories**: Stores the types of items (flights, hotels, etc.) and is linked to itinerary items.
  - **Costs**: Stores the cost of each itinerary item and calculates the total cost dynamically.
  
- **Relationships**:
  - One user can have many itineraries.
  - Each itinerary can have many items (flights, hotels, etc.).
  - Items are categorized (e.g., flights, hotels, activities).

### 2.4. Error Handling
- **Logging**:
  - Use **Heroku Logs** for error tracking on the web app.
  - For mobile, leverage **Expo’s built-in error handling and logging** tools.
- **Error Handling Strategy**:
  - Catch and log errors at the API level with appropriate status codes (e.g., 404 for not found, 500 for server errors).
  - Graceful error messages will be returned to users to inform them of issues (e.g., failed login, failed item creation).
  - Generic error pages or modal dialogs for the mobile app when users encounter errors.

## 3. Features (MVP)

1. **User Authentication**:
   - Users can log in using **Google OAuth** or create an account via **email/password**.
   - Session-based authentication will be used to maintain the user’s logged-in state.

2. **Itinerary Management**:
   - Users can **manually input itinerary items** (flights, hotels, Airbnb, activities, transportation, restaurants) with mandatory fields for **name**, **date**, **time**, and **location**.
   - **Optional fields** specific to each type (e.g., flight number for flights, ticket for activities).
   - **Drag-and-drop functionality** to move items between different dates and times within the itinerary.
   - Users can **edit** and **delete** individual items and entire days from their itinerary.
   - **Cost input**: Users can manually enter the cost of each item.
   - **Daily cost summary**: The app calculates the total cost for each day and the overall trip.
   - The itinerary can be **finalized**, but users can still **edit** it at any time.

3. **User Interface**:
   - Minimalist and intuitive design focusing on essential features.
   - Simple buttons for creating, editing, and deleting items and days.
   - Clear visual representation of the itinerary by day, with items grouped by categories.

4. **Data Synchronization**:
   - **Real-time synchronization** between the web and mobile apps via WebSockets or a similar technology.
   - Mobile app will use **SQLite** for offline storage and sync data when online.

5. **Deployment**:
   - The web app will be deployed on **Heroku**.
   - The mobile app will use **Expo** for over-the-air updates, ensuring fast bug fixes and feature releases.

## 4. Testing Strategy

### 4.1. Unit Testing
- **Backend**:
  - Use **Jest** for testing Express API endpoints.
  - Mock database interactions to test business logic without needing a real database.
  - Test error handling to ensure proper responses are returned for invalid requests.
  
- **Frontend**:
  - Use **React Testing Library** to test UI components.
  - Mock API requests to test the frontend’s response to various scenarios (e.g., successful login, failed data fetch).

### 4.2. Integration Testing
- Test end-to-end interactions between the frontend and backend.
- Test user authentication flows, from login to session creation and access to the itinerary data.
- Test drag-and-drop functionality on both web and mobile apps.

### 4.3. User Acceptance Testing (UAT)
- Once the MVP is ready, conduct UAT to ensure the app meets the requirements.
- Focus on the simplicity of the UI, ease of itinerary creation, and accurate cost calculations.
- Gather feedback to improve the app and prioritize future features.

### 4.4. Error Handling Testing
- Simulate server errors (e.g., database connection failure) and ensure the app gracefully handles the situation with appropriate error messages.
- Test edge cases like incomplete or invalid data entry, ensuring proper validation and feedback.

## 5. Future Features (To Be Implemented Later)

- **Itinerary Export** (PDF or CSV).
- **Notifications and Reminders** for upcoming events.
- **Analytics** for tracking user behavior, app usage, and insights.
- **Duplicate Item Creation**: Users will be able to duplicate items between days or itineraries.

## 6. Summary
This specification outlines the technical requirements, backend and frontend architecture, database design, and essential features for the MVP of the **Itinerary Planner** app. The MVP will focus on simplicity, enabling users to manually create and manage itineraries with basic functionalities such as drag-and-drop, cost tracking, and real-time synchronization between the web and mobile apps.
"""
