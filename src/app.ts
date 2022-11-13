import React, { StrictMode } from "https://esm.sh/react@18.2.0";
import ReactDOM from "https://esm.sh/react-dom@18.2.0";

import {
  Outlet,
  RouterProvider,
  createReactRouter,
  createRouteConfig,
} from 'https://esm.sh/@tanstack/react-router@0.0.1-beta.11';

const routeConfig = createRouteConfig().createChildren((createRoute) => [
  createRoute({
    path: '/',
    element: <Index />,
  }),
  createRoute({
    path: 'about',
    element: <About />,
  }),
])

const router = createReactRouter({ routeConfig })

function App() {
  return (
    <>
      <RouterProvider router={router}>
        <div>
          <router.Link to="/">Home</router.Link>{' '}
          <router.Link to="/about">About</router.Link>
        </div>
        <hr />
        <Outlet />
      </RouterProvider>
    </>
  )
}

function Index() {
  return (
    <div>
      <h3>Welcome Home!</h3>
    </div>
  )
}

function About() {
  return <div>Hello from About!</div>
}

const rootElement = document.getElementById('app');
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}