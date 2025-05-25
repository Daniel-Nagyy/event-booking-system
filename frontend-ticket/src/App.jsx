import AdminPage from './pages/admin';
import UsersPage from './pages/adminUser';
import EditProfile from "./Components/EditProfile";
import ProfilePage from "./Components/ProfilePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import Login from "./Components/LoginForm";
import './App.css';
import Events from "./Pages/Events";
import EventDetails from "./Pages/EventDetails";
import MyBookings from "./Pages/MyBookings";

function App() {
  return (
    <Router>
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/login" element={<Login></Login>} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
      <Footer></Footer>
    </Router>
  );
}

export default App;
