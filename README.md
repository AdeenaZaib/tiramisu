
***

# tiramisu. Catering Management System

**tiramisu.** is a premium, fully decoupled, cloud-connected web application designed to digitize and streamline catering operations from end to end. Built with a modern **Next.js** frontend and a robust **Spring Boot** REST backend, the system empowers catering businesses to manage their full operational workflow digitally while providing customers with a transparent, intuitive self-service experience.

## Tech Stack
* **Frontend:** Next.js, React, inline CSS (Premium UI/UX)
* **Backend:** Java, Spring Boot, RESTful APIs, JDBC
* **Database:** Supabase (Cloud-hosted PostgreSQL)
* **Testing:** JUnit 5, Mockito (Backend White-Box Testing)

---

## Key Features

### For Customers (Event Planning)
* **Menu Exploration:** Browse the full catalog and dynamically filter dishes by cuisine (e.g., Pakistani, Italian).
* **Event Draft Workflow:** Build an event draft by selecting menu items and assigning specific pax quantities.
* **Automated Cost Calculation:** Real-time calculation of item subtotals, inclusive of a 10% tax rate.
* **Order History & Invoicing:** View chronological order status updates and access detailed digital invoices.
* **Post-Order Actions:** Securely cancel "Pending" orders or leave a 1-to-5 star rating and feedback on "Delivered" orders.

### For Managers (Admin Console)
* **Menu Management (CRUD):** Add, edit, and delete active menu items in real-time.
* **Fulfillment Tracking:** Monitor all incoming bookings and update fulfillment statuses (*Pending, Confirmed, Delivered, Cancelled*) to manage kitchen workflow.
* **Analytics Dashboard:** View database-aggregated business intelligence, including Total Active Orders, Total Revenue (Rs), and a live feed of recent customer feedback.

---

## How to Run the Project

Because this is a decoupled architecture, you will need to run the **Backend (Spring Boot)** and the **Frontend (Next.js)** simultaneously in two separate terminal windows.

### Prerequisites
* **Java 17** or higher installed.
* **Maven** installed.
* **Node.js** (v18+) and npm installed.
* A **Supabase** (PostgreSQL) database configured.

### 1. Start the Spring Boot Backend
1. Open your terminal and navigate to the `backend` folder.
2. Ensure your `src/main/resources/application.properties` file contains your active Supabase database credentials:
   ```properties
   spring.datasource.url=jdbc:postgresql://[YOUR_SUPABASE_URL]:5432/postgres
   spring.datasource.username=[YOUR_DB_USER]
   spring.datasource.password=[YOUR_DB_PASSWORD]
   ```
3. Run the backend server using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will start and listen on `http://localhost:8080`.*

### 2. Start the Next.js Frontend
1. Open a **new** terminal window and navigate to the `frontend` (Next.js) folder.
2. Install the required Node dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will start and listen on `http://localhost:3000`.*

### 3. View the Application
Open your web browser and navigate to **[http://localhost:3000](http://localhost:3000)** to view the landing page. 

* **To access the Customer Portal:** Create an Event Draft or log in as a Customer.
* **To access the Admin Console:** Log in using Manager credentials.
