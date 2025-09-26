import AdminPage from './Pages/admin.jsx';
import EditProfile from "./Components/EditProfile.jsx";
import ProfilePage from "./Components/ProfilePage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./Components/NavBar.jsx";
import Footer from "./Components/Footer.jsx";
import Login from "./Components/LoginForm.jsx";
import './App.css';
import Events from "./Pages/Events.jsx";
import EventDetails from "./Pages/EventDetails.jsx";
import MyBookings from "./Pages/MyBookings.jsx";
import MyEventsPage from "./Pages/MyEventsPage.jsx";
import EventForm from "./Pages/EventForm.jsx";
import EventAnalyticsPage from "./Pages/EventAnalyticsPage.jsx";
import RegisterForm from "./Components/RegisterForm.jsx";
import ForgotPassword from "./Components/ForgotPassword.jsx"; // Make sure this file exists

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} /> {/* Registration route */}
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Forgot password route */}
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/my-events" element={<MyEventsPage />} />
        <Route path="/my-events/new" element={<EventForm />} />
        <Route path="/my-events/:id/edit" element={<EventForm />} />
        <Route path="/my-events/analytics" element={<EventAnalyticsPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

