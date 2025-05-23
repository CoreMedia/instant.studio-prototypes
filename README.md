## Local Development Setup

### Prerequisites

- Node.js (v18 or later)
- pnpm (v8 or later)

### Installation

1. Navigate to the project directory:
   ```bash
   cd frontend/content_chooser
   ```

1. Install dependencies:
   ```bash
   pnpm install
   ```

1. Start the development server:
   ```bash
   pnpm start
   ```

The development server will start and automatically open your browser to `http://localhost:1234`.

### Development Scripts

- `pnpm start` - Starts the development server
- `pnpm build` - Builds the project for production

## GitHub Pages Deployment

This project is automatically deployed to GitHub Pages whenever changes are pushed to the `main` branch. The deployment process is handled by GitHub Actions.

### Deployment Process

1. When changes are pushed to the `main` branch, the GitHub Actions workflow is triggered
2. The workflow:
   - Sets up Node.js v18
   - Installs pnpm v8
   - Installs project dependencies
   - Builds the project
   - Deploys the built files to GitHub Pages

### Manual Deployment

You can also trigger a manual deployment by:
1. Going to the "Actions" tab in your GitHub repository
2. Selecting the "Deploy to GitHub Pages" workflow
3. Clicking "Run workflow"

### Deployment Configuration

The deployment is configured in `.github/workflows/deploy.yml`. The workflow:
- Uses GitHub Pages for hosting
- Builds the project using pnpm
- Deploys the contents of the `frontend/content_chooser/dist` directory

### Accessing the Deployed Site

Once deployed, your site will be available at [coremedia.github.io](https://coremedia.github.io/instant.studio-prototypes)
