// // // import { useState } from 'react'
// // // import reactLogo from './assets/react.svg'
// // // import viteLogo from '/vite.svg'
// // // import './App.css'

// // // function App() {
// // //   const [count, setCount] = useState(0)

// // //   return (
// // //     <>
// // //       <div>
// // //         <a href="https://vite.dev" target="_blank">
// // //           <img src={viteLogo} className="logo" alt="Vite logo" />
// // //         </a>
// // //         <a href="https://react.dev" target="_blank">
// // //           <img src={reactLogo} className="logo react" alt="React logo" />
// // //         </a>
// // //       </div>
// // //       <h1>Vite + React</h1>
// // //       <div className="card">
// // //         <button onClick={() => setCount((count) => count + 1)}>
// // //           count is {count}
// // //         </button>
// // //         <p>
// // //           Edit <code>src/App.jsx</code> and save to test HMR
// // //         </p>
// // //       </div>
// // //       <p className="read-the-docs">
// // //         Click on the Vite and React logos to learn more
// // //       </p>
// // //     </>
// // //   )
// // // }

// // // export default App


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './auth/AuthContext';
import Productos from './pages/Productos';
import Ventas from './pages/Ventas';
import Clientes from './pages/Clientes';
import Historial from './pages/Historial';
import Usuarios from './pages/Usuarios';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/productos" element={
            <PrivateRoute>
              <Productos />
            </PrivateRoute>
          } />
          <Route path="/ventas" element={
            <PrivateRoute>
              <Ventas />
            </PrivateRoute>
          } />
          <Route path="/clientes" element={
            <PrivateRoute>
              <Clientes />
            </PrivateRoute>
          } />
          <Route path="/historial" element={
            <PrivateRoute>
              <Historial />
            </PrivateRoute>
          } />
          <Route path="/usuarios" element={
            <PrivateRoute>
              <Usuarios />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;




// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import PrivateRoute from './routes/PrivateRoute';
// import { AuthProvider } from './auth/AuthContext';
// import Productos from './pages/Productos';
// import Ventas from './pages/Ventas';
// import Clientes from './pages/Clientes';
// import Historial from './pages/Historial';
// import Usuarios from './pages/Usuarios';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         {/* ToastContainer debe estar aquí para que funcione en todas las páginas */}
//         <ToastContainer 
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="colored"
//         />
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/" element={
//             <PrivateRoute>
//               <Dashboard />
//             </PrivateRoute>
//           } />
//           <Route path="/productos" element={
//             <PrivateRoute>
//               <Productos />
//             </PrivateRoute>
//           } />
//           <Route path="/ventas" element={
//             <PrivateRoute>
//               <Ventas />
//             </PrivateRoute>
//           } />
//           <Route path="/clientes" element={
//             <PrivateRoute>
//               <Clientes />
//             </PrivateRoute>
//           } />
//           <Route path="/historial" element={
//             <PrivateRoute>
//               <Historial />
//             </PrivateRoute>
//           } />
//           <Route path="/usuarios" element={
//             <PrivateRoute>
//               <Usuarios />
//             </PrivateRoute>
//           } />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;