import React, { StrictMode } from "https://esm.sh/react@18.2.0?dev";
import ReactDOM from "https://esm.sh/react-dom@18.2.0/client?dev";

import {
  Outlet,
  RouterProvider,
  createReactRouter,
  createRouteConfig,
} from 'https://esm.sh/@tanstack/react-router@0.0.1-beta.11?dev';
// import { TanStackRouterDevtools } from 'https://esm.sh/@tanstack/react-router-devtools@0.0.1-beta.10?dev';
import { z } from 'https://esm.sh/zod@3.19.1?dev';

async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const routeConfig = createRouteConfig().createChildren((createRoute) => [
  createRoute({
    element: <Index />,
    path: '/',
  }),
  createRoute({
    element: <About />,
    path: 'about',
  }),
  createRoute({
    element: <AccessDenied />,
    path: '/access-denied'
  }),
  createRoute({
    meta: {
      doTheThing: true,
    },
    path: 'article',
  }).createChildren((createRoute) => [
    createRoute({
      element: <ArticleList />,
      errorElement: <ArticleListError />,
      path: '/',
    }),
    createRoute({
      element: <ArticleDetail />,
      errorElement: <ArticleDetailError />,
      meta: {
        doAnotherThing: true,
      },
      onMatch: function() {
        console.log('article detail match', arguments);
        return () => {
          console.log('article detail ended', arguments);
        }
      },
      path: ':id',
      parseParams: (params) => ({
        id: z.number().int().parse(Number(params.id)),
      }),
      stringifyParams: ({ id }) => ({ id: `${id}` }),
      loader: async ({ params: { id } }) => {
        console.log('router is', Object.assign({}, router));
        await wait(Math.random() * 1000);

        if (id === 10) {
          throw new Error('uh oh');
        }

        if (id === 4) {
          // simulate a 403
          /*[
            ...router.state.matches,
            ...(router.state.pending?.matches ?? []),
          ].forEach((match) => {
            match.cancel()
          });*/
          router.cancelMatches();
          // console.log('history is', router.history);
          
          
          router.navigationPromise.then(function() {
            console.log('resolve', arguments);
          }, function() {
            console.log('reject', arguments);
          });
          // router.navigate({ replace: true, to: '/access-denied'});
        }

        return { id, something: 'hello' };
      }
    })
  ])
])

const router = createReactRouter({ routeConfig });
function App() {
  return (
    <>
      <RouterProvider router={router}>
        <div>
          <router.Link to="/">Home</router.Link>{' '}
          <router.Link to="/about">About</router.Link>{' '}
          <router.Link to="/article">Articles</router.Link>
        </div>
        <hr />
        <Outlet />
      </RouterProvider>
      {/*<div>
        <TanStackRouterDevtools router={router} initialIsOpen={true} />
      </div>*/}
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
  const goToArticle = (event) => {
    router.navigate({ params: { id: event.target.dataset.to }, to: '/article/:id' }).then(function() {
      console.log("navigation success", arguments);
    },
    function() {
      console.log("navigation failure?", arguments);
    });
  };

  return (<>
    <p>
      Hello from About!
    </p>
    <button onClick={goToArticle} data-to={1} type="button">Go to article 1</button>
  </>);
}

function AccessDenied() {
  return (
    <>
      <h1>Access Denied</h1>
    </>
  );
}

function ArticleList() {
  return (
    <div>
      <h1>
        It is the article list route.
      </h1>
      <ul>
        <li>
          <router.Link
            params={{ id: 1 }}
            to="/article/:id">
              Article 1
          </router.Link>
        </li>
        <li>
          <router.Link
              params={{ id: 2 }}
              to="/article/:id">
              Article 2
          </router.Link>
        </li>
        <li>
          <router.Link
              params={{ id: 'test' }}
              to="article/:id">
                Article Test
          </router.Link>
        </li>
      </ul>
    </div>
  )
}

function ArticleDetail() {
  const match = router.useMatch('/article/:id');

  const {
    loaderData
  } = match;

  console.log('loaderData is', loaderData);

  return (
    <div>
      <p>
        It is the article detail route for article id {match.params.id}.
      </p>
      
      <router.Link
          params={{ id: match.params.id-1 }}
          to="article/:id">
          &lt; Prev 
      </router.Link>
      |
      <router.Link
          params={{ id: match.params.id+1 }}
          to="article/:id">
          Next &gt;
      </router.Link>
      ::
      <router.Link
          params={{ id: 10 }}
          to="article/:id">
          Error state
      </router.Link>
      </div>
  );
}

function ArticleDetailError() {
  return (
    <div>Article detail error</div>
  );
}

function ArticleListError() {
  return (
    <div>Article list error</div>
  );
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