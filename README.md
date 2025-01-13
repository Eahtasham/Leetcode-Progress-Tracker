# LeetCode Profile Tracker

LeetCode Profile Tracker is a web application that allows users to track and compare LeetCode profiles for themselves and their friends. Built with Next.js and React, this app provides an intuitive interface to visualize LeetCode progress and statistics.

## Features

- **Multiple User Tracking**: Add and track multiple LeetCode user profiles simultaneously.
- **Real-time Data Fetching**: Utilizes the LeetCode GraphQL API to fetch up-to-date user data.
- **Interactive UI**: Smooth animations and transitions powered by Framer Motion.
- **Responsive Design**: Fully responsive layout that works on desktop and mobile devices.
- **Data Visualization**: 
  - Pie charts showing the distribution of solved problems by difficulty.
  - Tables displaying recent submissions.
- **Local Storage**: Saves added users to local storage for persistence between sessions.
- **Error Handling**: Provides user-friendly error messages for failed data fetches.

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/eahtasham/leetcode-progress-tracker.git
   ```

2. Navigate to the project directory:
   ```
   cd leetcode-progress-tracker
   ```

3. Install the dependencies:
   ```
   npm install
   # or
   yarn install
   ```

4. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and visit \`http://localhost:3000\` to see the app running.

## Usage

1. On the main page, you'll see an input field to enter a LeetCode username.
2. Type in a valid LeetCode username and click "Add User" or press Enter.
3. The user's profile will be fetched and displayed on the page.
4. You can add multiple users to compare their progress side by side.
5. Each user's card displays:
   - Total problems solved
   - Distribution of problem difficulty
   - Recent submissions
6. The app will remember the added users even if you close the browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [LeetCode API](https://leetcode.com/graphql)

