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

const route = createBrowserRouter([
  {path:'/', element:<LoginPage />},
  {path:'/menu', element:<ProtectedRoute allowedRoles={["ROLE_Administrador","ROLE_Mesero"]}><MenuPage/></ProtectedRoute>},
  {path:'/categoria', element:<ProtectedRoute allowedRoles={["ROLE_Administrador","ROLE_Mesero"]}><CategoriaPage/></ProtectedRoute>},
  {path:'/platos', element:<ProtectedRoute allowedRoles={["ROLE_Administrador"]}><PlatoPage/></ProtectedRoute>},
  {path:'/mesas', element:<ProtectedRoute allowedRoles={["ROLE_Administrador"]}><MesaPage/></ProtectedRoute>},
  {path:'/consulta-menu', element:<ProtectedRoute allowedRoles={["ROLE_Administrador","ROLE_Mesero"]}><ConsultaMenuPage/></ProtectedRoute>},
  {path:'/pedidos', element:<ProtectedRoute allowedRoles={["ROLE_Administrador","ROLE_Mesero"]}><PedidoPage/></ProtectedRoute>},
  {path:'/no-autorizado', element:<h3>No tienes permisos para acceder a esta página</h3>}
])
function App() {

  return <RouterProvider router={route} />
}

export default App
