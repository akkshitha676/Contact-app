# Contact List Application

A modern, feature-rich contact management application built with React and Tailwind CSS. This application provides a comprehensive solution for managing contacts with advanced filtering, sorting, favorites, and beautiful animations.

## Features

### Core Functionality
- **View Contacts** - Display all contacts in an organized, alphabetically sorted list
- **Alphabetical Navigation** - Quick-access alphabet slider to jump to specific sections
- **Search Functionality** - Real-time search contacts by name, email, or phone number
- **Add New Contacts** - Create new contacts with name, phone, and optional email
- **Edit Contacts** - Update existing contact information
- **Delete Contacts** - Remove contacts with confirmation dialog
- **Contact Details View** - Detailed view with quick actions (Call, Email)

### Advanced Features
- **Favorites System** - Mark contacts as favorites with star icon
- **Multiple View Modes** - Switch between Grid and List view
- **Advanced Filtering** - Filter by All, Favorites
- **Multiple Sort Options** - Sort by Name (A-Z) or Recently Added
- **Filter Panel** - Collapsible filter panel with all options
- **Statistics Dashboard** - View total contacts and favorites count
- **Smooth Animations** - Beautiful fade-in, slide, and scale animations
- **Form Validation** - Validates phone numbers (supports international formats) and email addresses
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI** - Sleek slate/gray color scheme with smooth transitions

### Phone Number Support
- **Indian Format**: `9876543210`, `98765 43210`, `+91 98765 43210`
- **International Format**: `+1 234 567 8900`, `+44 20 1234 5678`
- Automatic formatting and validation

## 🛠️ Technologies Used

- **React** (v18+) - JavaScript library for building user interfaces
- **Tailwind CSS** (v3.4+) - Utility-first CSS framework
- **Lucide React** - Beautiful icon library with 1000+ icons
- **JavaScript ES6+** - Modern JavaScript features (hooks, useMemo, useEffect)
- **CSS Animations** - Custom keyframe animations for smooth transitions

## 🛠️ Technologies Used

- **React** - JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **JavaScript ES6+** - Modern JavaScript features

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 14.0 or higher)
- **npm** (comes with Node.js)

To check if you have Node.js and npm installed, run:
```bash
node --version
npm --version
```

If not installed, download from: https://nodejs.org/

## Installation & Setup

### Step 1: Create React App
```bash
npx create-react-app contact-app
cd contact-app
```

### Step 2: Install Dependencies
```bash
# Install Lucide Icons
npm install lucide-react

# Install Tailwind CSS
npm install -D tailwindcss@3.4.1 postcss autoprefixer
```

### Step 3: Configure Tailwind CSS

Create `tailwind.config.js` in the root directory:
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Create `postcss.config.js` in the root directory:
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Step 4: Update CSS

Replace the content of `src/index.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 5: Add Application Code

Replace the content of `src/App.js` with the ContactListApp component code.

### Step 6: Clean Up (Optional)

Delete or empty `src/App.css` as it's not needed.

## 🏃‍♂️ Running the Application

### Development Mode

Start the development server:
```bash
npm start
```

The application will open automatically at `http://localhost:3000`

### Build for Production

Create an optimized production build:
```bash
npm run build
```

The build folder will contain the optimized files ready for deployment.

### Run Tests
```bash
npm test
```

## Project Structure
```
contact-app/
├── node_modules/          # Dependencies
├── public/
│   ├── index.html        # HTML template
│   └── ...
├── src/
│   ├── App.js            # Main application component
│   ├── index.css         # Tailwind CSS imports
│   ├── index.js          # React entry point
│   └── ...
├── package.json          # Project dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
└── README.md            # This file
```

## Usage Guide

### Adding a Contact
1. Click the **"Add Contact"** button
2. Fill in the required fields (Name and Phone)
3. Optionally add an email address
4. Click **"Add Contact"** to save

### Viewing Contact Details
1. Click on any contact card
2. View full contact information
3. Use quick action buttons to Call or Email

### Editing a Contact
1. Click on a contact to view details
2. Click **"Edit Contact"**
3. Modify the information
4. Click **"Save Changes"** or **"Cancel"**

### Deleting a Contact
1. Click on a contact to view details
2. Click **"Delete"**
3. Confirm deletion in the popup dialog

### Searching Contacts
- Type in the search bar to filter contacts by name in real-time

### Alphabetical Navigation
- Click letters on the right sidebar to quickly jump to contacts starting with that letter

## 🔧 Troubleshooting

### PowerShell Execution Policy Error

If you encounter a PowerShell script execution error on Windows:

**Solution 1:** Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Solution 2:** Use Command Prompt instead of PowerShell in VS Code.

### Port Already in Use

If port 3000 is already in use:
```bash
# Kill the process on port 3000
npx kill-port 3000

# Or specify a different port
PORT=3001 npm start
```

### Module Not Found Error

If you get module not found errors:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Tailwind Styles Not Loading

If Tailwind CSS styles aren't working:

1. Ensure `tailwind.config.js` and `postcss.config.js` exist in root
2. Verify `src/index.css` contains Tailwind directives
3. Delete `node_modules` and reinstall:
```bash
   rm -rf node_modules
   npm install
   npm start
```

## Form Validation Rules

### Phone Number
- Required field
- Must be a valid Indian mobile number
- Formats accepted:
  - `9876543210`
  - `98765 43210`
  - `+91 98765 43210`
  - `+91 9876543210`
- Must start with digits 6-9

### Email
- Optional field
- Must be valid email format if provided
- Example: `user@example.com`

### Name
- Required field
- Cannot be empty

## Customization

### Colors

The app uses an orange and green color scheme. To customize:

Edit Tailwind classes in `src/App.js`:
- `from-orange-500` - Primary color
- `from-green-50` - Secondary color

### Contact Data

Default contacts are hardcoded in the initial state. To modify:

Edit the `useState` initialization in `App.js`:
```javascript
const [contacts, setContacts] = useState([
  { id: 1, name: 'Your Name', email: 'email@example.com', phone: '+91 98765 43210' },
  // Add more contacts...
]);
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy automatically

### Netlify

1. Build the project: `npm run build`
2. Drag and drop the `build` folder to [netlify.com](https://netlify.com)

### GitHub Pages
```bash
npm install gh-pages --save-dev
```

Add to `package.json`:
```json
"homepage": "https://yourusername.github.io/contact-app",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

Deploy:
```bash
npm run deploy
```



##  Author

Akkshitha - Created as part of the Tria Frontend Assignment.
