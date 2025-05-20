import logo from './logo.svg';
import './App.css';
import EventCard from './Components/EventCard';
import MyEventsPage from './Pages/MyEventsPage';
import EventForm from './Components/EventForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
              <EventCard title="Event 1" description="Description 1" location="Location 1" date="2021-01-01" />
            </header>
          </div>
        } />
        <Route path="/my-events" element={<MyEventsPage />} />
        <Route path="/my-events/new" element={<EventForm />} />
        <Route path="/my-events/:id/edit" element={<EventForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
