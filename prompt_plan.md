# Prompt 1: Setup and Initial Configuration

We are building the "Itinerary Planner" project. Start by initializing a new repository with the following structure:
- `/backend` for our Node.js/Express server.
- `/frontend-web` for the React web app.
- `/frontend-mobile` for the React Native (Expo) app.

For the backend:
1. Initialize a new Node.js project (`npm init`) inside `/backend`.
2. Install Express, and any initial dependencies (e.g., `express`, `dotenv`, `cors`).
3. Set up a basic Express server with a single health-check route (GET `/health` that returns a simple JSON message).
4. Configure ESLint and Prettier for coding style and format.

For the frontend:
1. Use `create-react-app` in `/frontend-web` for the web application.
2. Set up a basic project structure with a placeholder home page.
3. For the mobile app, initialize a new Expo project inside `/frontend-mobile` with the default template.

Make sure to commit all changes. Once the basic folder structure and initial configurations are in place, run tests to ensure that the server is up and the frontend projects load correctly in the browser and mobile simulator.

*This prompt ends by wiring the basic projects together in the repository.*


# Prompt 2: Setup Database Models using Prisma

Within the `/backend` directory:
1. Install Prisma CLI and initialize Prisma (`npx prisma init`).
2. In your Prisma schema, define the following models:
   - **User**: Fields for id, email, password (for email/password login), and any OAuth fields.
   - **Itinerary**: Fields for id, title, userId (relation to User), startDate, endDate.
   - **Item**: Fields for id, itineraryId, name, date, time, location, costId (if needed), and any optional fields based on the item type.
   - **Category**: Fields for id, name (e.g., flights, hotels, activities) and relationship to Items.
   - **Cost**: Fields for id, amount, currency, and a relationship back to the Item.
3. Define relationships between the models:
   - One User can have many Itineraries.
   - One Itinerary can have many Items.
   - Each Item belongs to one Category.
4. Configure two different datasources/environments (PostgreSQL for web and SQLite for mobile) if possible, or plan to switch the connection string based on the environment.
5. Run Prisma migrations to create the database structure.
6. Create a seed script with sample data for testing.

Ensure that unit tests for database connectivity (using Jest or another testing framework) pass successfully before moving to the next prompt.


# Prompt 3: Build REST API Endpoints and Authentication

In the `/backend` project:
1. Set up routes in Express for:
   - **User Authentication**:
     - Email/Password signup and login endpoints.
     - Google OAuth endpoint stub (simulate OAuth flow for now).
     - Session management (using express-session or a similar library) to maintain login state.
   - **Itinerary Management**:
     - CRUD endpoints for itineraries (create, read, update, delete).
     - CRUD endpoints for itinerary items.
2. Integrate the Prisma client to interact with your database models.
3. Implement basic error handling for each route, returning appropriate HTTP status codes.
4. Write unit tests using Jest for:
   - Authentication endpoints (including error cases, e.g., wrong credentials).
   - Itinerary CRUD endpoints.
5. Verify that each endpoint passes its tests and that sessions are maintained properly.

End this prompt by wiring the authentication and CRUD functionalities into the Express app.


# Prompt 4: Build React Web App Skeleton

Within the `/frontend-web` directory:
1. Create a login/signup page that integrates with the backend authentication endpoints.
2. Build a protected dashboard route that displays the user's itineraries after login.
3. Develop a form page for creating and editing itineraries and itinerary items.
4. Implement basic navigation using React Router.
5. Integrate state management (e.g., React Context) to track user session state.
6. Write tests using React Testing Library to simulate user authentication and CRUD operations.
7. Ensure that API requests to the backend are correctly handled and that error messages are displayed when necessary.

Wire all components together so that a user can sign up/login, see their itinerary list, and navigate to a detail page.


# Prompt 5: Implement Drag-and-Drop for Itinerary Items

In the `/frontend-web` project:
1. Integrate a drag-and-drop library (e.g., `react-beautiful-dnd`).
2. Update the itinerary detail page to allow users to rearrange items by dragging them.
3. Ensure that the new order is reflected in the component state and, if applicable, update the backend via an API call.
4. Write tests to:
   - Simulate drag-and-drop events.
   - Validate that the UI updates as expected and that the correct API request is made.
5. Verify that changes persist and that error handling is in place for API failures.

End this prompt by wiring the drag-and-drop functionality with the itinerary update process.


# Prompt 6: Build React Native (Expo) App Skeleton

Within the `/frontend-mobile` directory:
1. Initialize the Expo project and create screens for:
   - Login/Signup (integrating with the backend authentication endpoints).
   - A dashboard that lists itineraries.
   - A detail view for itineraries that displays items.
2. Set up navigation using React Navigation.
3. Prepare the basic UI elements to mirror the web app functionality.
4. Create an offline storage placeholder using SQLite (install and configure a simple SQLite wrapper) to store itinerary data locally.
5. Write tests (using Jest and the React Native Testing Library) for:
   - Authentication flows.
   - Navigation between screens.
6. Wire the offline storage to initially display cached data while synchronizing with the backend.

Ensure that the mobile app works in the Expo simulator and that navigation and data retrieval are functioning.


# Prompt 7: Integrate Error Handling, Logging, and Real-Time Synchronization

In the `/backend` and frontend projects:
1. Enhance the Express server to include robust error handling middleware. Log errors to the console and (simulate) Heroku Logs.
2. In the mobile app, integrate Expo's error logging and display mechanisms.
3. Set up a WebSocket server (using a library like `socket.io`) in the backend that:
   - Emits itinerary updates in real time.
   - Listens for changes from either client (web or mobile).
4. Update both the React web and React Native apps to subscribe to WebSocket updates for real-time synchronization.
5. Write integration tests to simulate server errors and test real-time data updates.
6. Verify that error messages are user-friendly and that logging occurs as expected.

This prompt ends by wiring the error handling and real-time updates into the overall system.


# Prompt 8: End-to-End Integration and Final Wiring

Now that individual components are complete, perform a final integration by:
1. Writing end-to-end tests that simulate a complete user journey:
   - User sign-up/login.
   - Creating, editing, and deleting itineraries and itinerary items.
   - Rearranging items using drag-and-drop.
   - Observing real-time updates across web and mobile platforms.
2. Setting up a continuous integration (CI) pipeline to run these tests automatically.
3. Verifying that the app gracefully handles edge cases (e.g., network failures, invalid inputs).
4. Double-checking that all code branches (backend API, React web, React Native mobile) are integrated without orphaned or hanging code.

Ensure that the application is fully wired together, with secure authentication, proper error handling, and effective communication between the web and mobile apps.


