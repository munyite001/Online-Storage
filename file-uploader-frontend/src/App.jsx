import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './components/Home';
import './App.css';
import Authenticate from './components/Authenticate';
import Dashboard from './components/Dashboard';

export default function App() {

  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="App">
     {!isDashboard && <Nav />} 

      <Routes>
        <Route path='/' element={ <Home /> }/>
        <Route path="/get-started" element={ <Authenticate /> } />
        <Route path="/dashboard/:userId" element={ <Dashboard /> } />
      </Routes>

    </div>
  );
}