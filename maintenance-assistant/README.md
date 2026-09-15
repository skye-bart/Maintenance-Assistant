# Maintenance Assistant

## Overview
The Maintenance Assistant is an offline-first web application designed for manufacturing maintenance teams. It allows users to manage maintenance tasks, track work orders, and access key metrics without requiring an internet connection.

## Features
- **Dashboard**: Provides an overview of maintenance activities and key metrics.
- **Task Management**: Create, edit, and manage maintenance tasks and work orders.
- **Offline Functionality**: Utilizes local storage to ensure data persistence without internet access.
- **User-Friendly Interface**: Built with React for a responsive and interactive user experience.

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd maintenance-assistant
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage
1. Start the application:
   ```
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000` to access the Maintenance Assistant.

## File Structure
```
maintenance-assistant
├── public
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src
│   ├── assets
│   │   └── styles.css
│   ├── components
│   │   ├── Dashboard.js
│   │   ├── TaskList.js
│   │   └── TaskForm.js
│   ├── services
│   │   └── localStorageService.js
│   ├── utils
│   │   └── helpers.js
│   ├── App.js
│   └── index.js
├── package.json
├── webpack.config.js
├── .babelrc
└── README.md
```

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.