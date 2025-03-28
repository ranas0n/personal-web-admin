import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Loader from './components/common/Loader/index.tsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Stacks } from './components/Stacks/index.tsx';
import { Projects } from './components/Projects/index.tsx';
import { StackForm } from './components/forms/StackForm.tsx';
import { ProjectForm } from './components/forms/ProjectForm.tsx';
import {
  QueryClientProvider, 
  QueryClient,
} from '@tanstack/react-query'


const queryClient = new QueryClient();

const router = createBrowserRouter([
  //MAIN PAGE
  {
    path: "/",
    element: <App />,
  },

  // STACK PAGES
  {
    path: "/stacks",
    element: <Stacks />,
  },
  {
    path: "/stack/",
    element: <StackForm method='add'/>,
  },
  {
    path: "/stack/:id",
    element: <StackForm method='update'/>,
  },
  
  // PROJECT PAGES
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/project/",
    element: <ProjectForm method='add' />,
  },
  {
    path: "/project/:proj_id",
    element: <ProjectForm method='update'/>,
  },

]);


const Root = () => {
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  return (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {loading ? <Loader /> :<RouterProvider router={router} />}
    </QueryClientProvider>
  </StrictMode>
  )

}

createRoot(document.getElementById('root')!).render(
  <Root />
)
