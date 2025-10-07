# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    # Falcorp AI Retail

    A modern, polished React + Vite front-end for Falcorp AiButler — an AI shopping assistant and grocery catalog UI.

    ## Features
    - Chat-style AI assistant UI
    - Grocery browse, prices and stock indicators
    - Tailwind CSS for responsive, modern styling
    - TypeScript + Vite for fast dev and builds

    ## Quick start

    Requirements: Node 18+ and npm

    1. Install dependencies

    ```bash
    npm install
    ```

    2. Run development server

    ```bash
    npm run dev
    ```

    3. Build for production

    ```bash
    npm run build
    ```

    The production-ready files will be in the `dist/` folder.

    ## Deploy to AWS S3 (static website)

    1. Build the project:

    ```bash
    npm run build
    ```

    2. Create an S3 bucket on the AWS Console named `falcorp-ai-retail` (or any unique name). Enable "Static website hosting" and set the index document to `index.html`.

    3. Upload the `dist` folder contents to S3. Using the AWS CLI:

    ```bash
    aws s3 sync ./dist s3://your-bucket-name --delete
    ```

    4. Make the bucket objects public (or configure CloudFront) and use the S3 website endpoint.

    ## Notes
    - `vite.config.ts` is configured with `base: './'` so the app works when served from S3 or a subpath.
    - If you prefer CI/CD, I can add a GitHub Actions workflow to build and deploy to S3 automatically.

    ## License
    Add a license file (e.g., `LICENSE`) if you want to open-source this project.

    ---
    Made with ❤️ — Falcorp AiButler UI
