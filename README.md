# FinTrack Frontend

The **FinTrack Frontend** is a React and TypeScript-based application designed to help users manage their financial data effectively. It provides a user-friendly interface for tracking holdings, visualizing portfolio data, and managing assets.

---

## **Features**

### **User Authentication**
- **Login**: Secure login functionality for users.
- **Register**: Allows new users to create an account.
- **Session Management**: Ensures secure and persistent user sessions.

---

### **Dashboard**
- Displays an overview of the user's financial data.
- Includes navigation links to key sections of the application.
- Provides a summary of holdings, balances, and portfolio performance.

---

### **Holdings Management**
- **Detailed Holdings Table**:
  - Displays a list of user holdings with details such as:
    - Asset Name
    - Symbol
    - Quantity
    - Asset Type
    - Price in Base Currency
    - Total Value in Base Currency
  - Automatically calculates prices and total values in the selected base currency.
- **Editable Holdings Table**:
  - Allows users to categorize holdings into custom categories and subcategories.
  - Features dropdowns for category and subcategory selection.
  - Supports editing, confirming, and removing categories.
- **Base Currency Support**:
  - Displays all prices and values in the user's selected base currency (e.g., USD, EUR).

---

### **Portfolio Visualization**
- **Portfolio Pie Chart**:
  - Visualizes the distribution of holdings in a pie chart.
  - Displays asset values and percentages in the base currency.
  - Allows filtering by category to focus on specific asset groups.
  - Custom tooltips provide detailed information about each slice, including:
    - Asset Name
    - Value
    - Percentage of Total Portfolio
    - Subcategory Details (if applicable).

---

### **Balance Sheet**
- Displays the user's balance sheet with a breakdown of assets and liabilities.
- Provides a clear view of the user's net worth.
- Includes navigation links for easy access to other sections.

---

### **Asset Management**
- Allows users to manage their assets, including adding, editing, and removing assets.
- Provides a detailed view of asset performance and history.
- Supports categorization and tagging of assets for better organization.

---

### **Category Management**
- Users can create, edit, and delete custom categories for their holdings.
- Subcategories allow for more granular organization of assets.
- Categories are integrated into the holdings table and portfolio visualization.

---

### **Base Currency Support**
- All financial data is displayed in the user's selected base currency.
- Supports dynamic conversion of prices and values based on real-time exchange rates.
- Automatically fetches and applies the correct exchange rates for FOREX holdings.

---

### **Responsive Design**
- Fully responsive layout for seamless use on desktops, tablets, and mobile devices.
- Optimized for performance and usability across different screen sizes.

---

### **Error Handling**
- Displays user-friendly error messages for failed API requests or invalid inputs.
- Includes loading states to indicate ongoing data fetching processes.

---

## **Getting Started**

### **Prerequisites**
- Node.js (v16 or later)
- npm or yarn

### **Installation**
To get started with the FinTrack frontend, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd FinTrack/frontend

2. **Install dependencies**:
   ```bash
    npm install

3. **Run the application**:
   ```bash
    npm start
