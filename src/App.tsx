import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/Navbar';
import Place from "./pages/Place";
import Main from "./pages/Main";
import SignIn from "./pages/SignIn";
import Notice from "./pages/Notice";
import Event from "./pages/Event";
import Promotion from "./pages/Promotion";
import User from "./pages/User";
import WriteNotice from "./pages/WriteNotice";
import ViewNotice from "./pages/ViewNotice";
import PlaceApproval from "./pages/PlaceApproval";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/place" element={<Place />} />
                    <Route path="/place/approval" element={<PlaceApproval />} />
                    <Route path="/notice" element={<Notice />} />
                    <Route path="/notice/write" element={<WriteNotice />} />
                    <Route path="/notice/view" element={<ViewNotice />} />
                    <Route path="/event" element={<Event />} />
                    <Route path="/promotion" element={<Promotion />} />
                    <Route path="/user" element={<User />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
