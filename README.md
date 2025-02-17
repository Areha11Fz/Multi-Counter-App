# Multi Counter App

This project is a simple counter application that allows users to increase or decrease a counter value. The application features an editable title and saves the counter value and title in the browser's local storage, ensuring that the data persists even after the page is refreshed or reopened.

## Project Structure

```
multi-counter-app
├── css
│   └── styles.css      # Contains styles for the website
├── js
│   └── script.js       # Contains JavaScript functionality for the counter
├── index.html          # Main HTML document for the website
└── README.md           # Documentation for the project
```

## Features

- Editable title
- Counter display
- Plus and minus buttons to adjust the counter
- Data persistence using local storage
- Reset all counters button
- Export list button to export counter names and values
- Import and export configuration buttons to save and load counter configurations

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/Areha11Fz/multi-counter-app.git
   ```

2. Navigate to the project directory:
   ```
   cd multi-counter-app
   ```

3. Open `index.html` in your web browser.

## Usage

- Click the "+" button to increase the counter.
- Click the "-" button to decrease the counter.
- Edit the title by clicking on it and typing your desired text.
- Click the "Reset All Counters" button to reset all counters to 0.
- Click the "Export List" button to open a modal with the list of counters and their values, and copy the list to the clipboard.
- Click the "Import Config" button to open a modal where you can paste a JSON configuration to load counters.
- Click the "Export Config" button to open a modal with the JSON configuration of all counters, and copy the configuration to the clipboard.
- The counter value and title will be saved automatically in your browser's local storage.

## Deployment

This project can be easily hosted on GitHub Pages. To do so, follow these steps:

1. Push your code to a GitHub repository.
2. Go to the repository settings.
3. Scroll down to the "GitHub Pages" section.
4. Select the branch you want to use for GitHub Pages (usually `main` or `master`).
5. Save the settings and your site will be live at `https://yourusername.github.io/repository-name`.

## Acknowledgments

- This project was created as a simple demonstration of HTML, CSS, and JavaScript capabilities.
- Special thanks to the open-source community for their resources and inspiration.