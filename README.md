# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

Frontend (React) README – Flaky Test Analyzer & LLM
Tools
Overview
This frontend is built using **React.js** and provides multiple QA-focused tools, including:
1. **Flaky Test Analyzer** – Upload test run results (CSV/JSON), detect flaky tests, and get AI-based
   suggestions.
2. **Generate Test from Design** – Enter Jira story or screen description to generate test cases in BDD
   & TDD format.
3. **Other QA Tools** – Depending on your version, additional tabs may exist.
   The UI interacts with the backend (Spring Boot) via REST APIs.
---
Prerequisites
On **Windows** and **macOS**:
- **Node.js** (v18.x or newer) – Includes `npm`
- Download: https://nodejs.org/en/download/
- **Git** – For cloning the repository
- Download: https://git-scm.com/downloads
  To verify installations:
node -v
npm -v
git --version

---
Installation Steps
1. Clone the Repository

git clone https://github.com/your-org/your-fe-repo.git
cd your-fe-repo

2. Install Dependencies

npm install

3 Start the Development Server
npm start

This launches the React app in your default browser at:
http://localhost:3000

---
Common Issues & Fixes
- **CORS Errors** – Ensure backend has CORS enabled.
- **API URL not found** – Verify backend URL and port are correct.
- **Dependency errors** – Delete `node_modules` and run `npm install` again.
---