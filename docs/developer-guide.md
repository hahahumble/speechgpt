# Development Guide for SpeechGPT
This development guide provides an overview of the SpeechGPT project, its technology stack, and the file structure. Follow the instructions below to get started with development.

## Technology Stack
SpeechGPT uses the following technology stack:

- [React 18](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TailwindCSS](https://tailwindcss.com/)

## File Structure
The project is organized as follows:

```text
.
├── .github
├── assets
├── docs
├── public
└── src
    ├── apis
    ├── assets
    ├── components
    ├── constants
    ├── css
    ├── db
    ├── helpers
    ├── locales
    ├── pages
    ├── store
    ├── typings
    └── utils
```

## Directory Descriptions
- `.github`: Contains GitHub Actions workflows and configurations.
- `assets`: Contains project-specific assets, such as images or other media files.
- `docs`: Holds documentation files for the project.
- `public`: Includes static files and assets used in the project.
- `src`: The main source code directory for the application.
  - `apis`: Contains API-related functions and configurations.
  - `components`: Holds React components used throughout the application.
  - `constants`: Includes constant values and configurations.
  - `css`: Holds CSS files and styles for the project.
  - `db`: Contains database configurations and related files.
  - `helpers`: Stores helper functions for specific tasks and logic.
  - `locales`: Stores localization and internationalization files.
  - `pages`: Contains the main page components for the application.
  - `store`: Contains Redux store configurations and related files.
  - `typings`: Contains TypeScript type definitions and interfaces.
  - `utils`: Stores utility functions and helper methods.

## Git Commit Guidelines
When committing changes to the repository, follow these commit message conventions to maintain a consistent and readable Git history:

- `feat`: New features or modifications to existing features.
- `fix`: Bug fixes.
- `docs`: Changes to documentation files.
- `style`: Formatting changes that do not affect code execution (e.g., whitespace, formatting, missing semicolons, etc.).
- `refactor`: Code changes that are neither new features nor bug fixes but improve code quality.
- `perf`: Performance-enhancing code changes.
- `test`: Adding missing tests or updating existing tests.
- `chore`: Changes to build processes or auxiliary tools.
- `revert`: Reverting a previous commit (e.g., revert: type(scope): subject (revert to version: xxxx)).

## Getting Started
1. Clone the repository.
```shell
git clone https://github.com/hahahumble/speechgpt.git
```

2. Install the required dependencies.
```shell
yarn install
```

3. Start the development server. The application should be accessible at http://localhost:5173.
```shell
yarn dev
```

4. Build the application for production. The output files will be in the dist directory.
```shell
yarn build
```

5. Run the application in production mode. The application should be accessible at http://localhost:4173.
```shell
yarn serve
```

Code formatting(Using Prettier).
```shell
yarn format
```

🚀 Start your SpeechGPT development journey! If you encounter any problems during the development process, please feel free to check out the documentation or submit a question on GitHub. Have fun developing! 🎉
