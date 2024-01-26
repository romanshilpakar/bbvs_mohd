import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import View from "../pages/View";
import { AuthContext } from "../contexts/Auth";
import UserPollsPage from "../pages/User/Polls";
import HomePage from "../pages/Admin/Home";
import ProfilePage from "../pages/User/Profile";
import PreviousElection from "../pages/User/PreviousElection";
import Default from "../layouts/Default";
import AdminUsersPage from "../pages/Admin/Users";
import AdminCandidatesPage from "../pages/Admin/Candidates";
import AdminVerifyPage from "../pages/Admin/Verify";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import CandidateSignup from "../pages/CandidateSignup";

export default () => {
  const authContext = useContext(AuthContext);

  // console.log("authContext:",authContext)

  const getRoutes = (): JSX.Element => {
    if (authContext.loading) return <div>loading...</div>;

    if (authContext.authenticated) {
      // if the user is authenticated then

      const adminMenu = [
        { name: "Home", link: "/" },
        { name: "Verify Voters", link: "/users" },
        { name: "Verify Candidates", link: "/candidates" },
        { name: "Search Past Election", link: "/previouselection" },
        { name: "Profile", link: "/profile" },
      ];

      const userMenu = [
        { name: "Polls", link: "/" },
        { name: "Search Past Election", link: "/previouselection" },
        { name: "Profile", link: "/profile" },
      ];

      const candidateMenu = [
        { name: "Polls", link: "/" },
        { name: "Search Past Election", link: "/previouselection" },
        { name: "Profile", link: "/profile" },
      ];

      if (authContext.isAdmin) {
        // if the user is admin
        return (
          <Default menu={adminMenu}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/users" element={<AdminUsersPage />} />
              <Route path="/candidates" element={<AdminCandidatesPage />} />
              <Route path="/verify/:name/:id" element={<AdminVerifyPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/previouselection" element={<PreviousElection />} />

            </Routes>
          </Default>
        );
      } else if (authContext.isCandidate) {
        // if the user is candidate
        return (
          <Default menu={candidateMenu}>
            <Routes>
              <Route path="/" element={<UserPollsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/previouselection" element={<PreviousElection />} />

            </Routes>
          </Default>
        );
      } else {
        //  if the user in not admin
        return (
          <Default menu={userMenu}>
            <Routes>
              <Route path="/" element={<UserPollsPage />} />
              <Route path="/profile" element={<ProfilePage  />} />
              <Route path="/previouselection" element={<PreviousElection />} />
            </Routes>
          </Default>
        );
      }
    } else {
      // if the user is not authenticated
      return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/candidatesignup" element={<CandidateSignup />} />    
          <Route path="/view" element={<View />} />
          <Route path="/forgotpassword" element={<ForgotPassword/>} />
          <Route path="/resetpassword/:token" element={<ResetPassword/>} />
          
        </Routes>
      );
    }
  };

  return getRoutes();
};
