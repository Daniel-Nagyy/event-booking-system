
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/admin';
import UsersPage from './pages/adminUser';
import './App.css';

function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
