import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from './pages/Login';
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {

  //get the authenticated user from auth context
  const {currentUser} = useContext(AuthContext);

  //sideffect to not allow scrolling of the page
  useEffect(()=> {
    document.body.style.overflowY = "hidden"
  },[])


  //used router to define routes
  //used auth context for protected routes
  const router = createBrowserRouter([{
    path: '/',
    element: <Navbar />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login',
        element: currentUser===null ? <Login /> : <Navigate to='/dashboard' />
      },
      {
        path: '/register',
        element: currentUser!==null  ? <Navigate to='/dashboard' /> : <Register />
      },
      {
        path: '/dashboard',
        element: currentUser!==null ? <Dashboard /> : <Navigate to='/login' />
      }
    ]
  }])

  //renders the app through route provider
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
