# Note Taking Application - Frontend

This is the frontend of a **Note Taking Application** built with **Next.js** and **ShadCN**. The application includes a login system, reusable UI components, and both public and private routes for secure access.

## Features

- **Built with Next.js** - Optimized performance and routing.  
- **UI powered by ShadCN** - Modern and customizable UI components.  
- **Authentication** - Private and public routes for secured access using **JWT tokens**.
-  **Reusable Components** - Navbar, Footer, and other UI elements inside `/frontend/src/components` for better maintainability.  
- **Testing with Jest** - `babel.config.js` and `jest.config.js` is set up for Jest to test the `frontend/src/app/login/LoginTest.test.tsx` page.  

---

## Folder Structure

```sh
/frontend
├── /public            # Static assets (images, icons, etc.)
├── Dockerfile         # To set up docker instructions
├── ...
├── ...
├── /src
├──├── /app            # Auto-routes in Next.js (public & private routes)
├──├── /components     # Reusable components like Navbar, Footer
├──├── jest.setup.js   # For jest configurations
├──├── ...
├──├── ...
     
```
---

## Built With

- **Next.js** - React framework for server-side rendering.
- **ShadCN** - UI components for styling.
- **Jest** - JavaScript testing framework.
- **Babel** - Compiler setup for Jest testing.
- **Tailwind CSS** - Styling framework.