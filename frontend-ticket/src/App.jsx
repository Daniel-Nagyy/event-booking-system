import EditProfile from "./Components/EditProfile";
import ProfilePage from "./Components/ProfilePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";

function App() {
  return (
    <Router>
      <NavBar></NavBar>
      <Routes>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfile />} />
      </Routes>
      <Footer></Footer>
    </Router>
  );
}

export default App;
