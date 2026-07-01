import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import MenuPage from './pages/MenuPage'
import ProtectedRoute from './components/ProtectedRoute'
import CategoriaPage from './pages/CategoriaPage'
import PlatoPage from './pages/PlatoPage'
import MesaPage from './pages/MesaPage'
import ConsultaMenuPage from './pages/ConsultaMenuPage'
import PedidoPage from './pages/PedidoPage'

import { MainLayout } from './components'

const route = createBrowserRouter([
  {path:'/', element:<LoginPage />},
  {
    element: <MainLayout />,
    children: [
      {path:'/menu', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_USER"]}><MenuPage/></ProtectedRoute>},
      {path:'/categoria', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_USER"]}><CategoriaPage/></ProtectedRoute>},
      {path:'/platos', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN"]}><PlatoPage/></ProtectedRoute>},
      {path:'/mesas', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN"]}><MesaPage/></ProtectedRoute>},
      {path:'/consulta-menu', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_USER"]}><ConsultaMenuPage/></ProtectedRoute>},
      {path:'/pedidos', element:<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_USER"]}><PedidoPage/></ProtectedRoute>},
    ]
  },
  {path:'/no-autorizado', element:<h3>No tienes permisos para acceder a esta página</h3>}
])
function App() {

  return <RouterProvider router={route} />
}

export default App
