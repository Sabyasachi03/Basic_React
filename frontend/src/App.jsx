import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const MasterLayout = React.lazy(() => import('../src/components/layout/MasterLayout'))
const StateMaster = React.lazy(() => import('../src/pages/Master/State/index'))
const StateMasterLayout = React.lazy(() => import('../src/pages/Master/State/Layout'))
const StateMasterForm = React.lazy(() => import('../src/pages/Master/State/StateForm'))


function App() {
  const router = createBrowserRouter([
    {
      path: 'master',
      element: <MasterLayout />,
      children: [
        {
          path: 'state',
          element: < StateMasterLayout />,
          children: [
            {
              index: true,
              element: <StateMaster />
            },
            {
              path: 'sate-form',
              element: <StateMasterForm />
            },
          ]
        },
      ]
    },
  ])
  
  return (
    <>
      <RouterProvider router={router} />
    </>

  );
}

export default App;