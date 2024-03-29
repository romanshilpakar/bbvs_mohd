import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "../axios";

type ContextProps = {
  children: JSX.Element;
};

type User = {
  id: number;
  name: string;
  citizenshipNumber: string
  email: string;
  admin: boolean;
  candidate: boolean;
  profileImage: string;
};

export const AuthContext = createContext({
  id: 0,
  name: "",
  email: "",
  citizenshipNumber: "",
  profileImage:"",
  isAdmin: false,
  isCandidate: false,
  authenticated: false,
  accessToken: "",
  loading: true,
  authenticate: (user: User, token: string) => {},
  logout: () => {},
});

export default (props: ContextProps): JSX.Element => {
  const navigate = useNavigate();

  const [authentication, setAuthentication] = useState({
    id: 0,
    name: "",
    email: "",
    citizenshipNumber: "",
    profileImage:"",
    isAdmin: false,
    isCandidate: false,
    authenticated: false,
    accessToken: "",
    loading: true,
  });

  const checkAuthentication = () => {
    axios
      .post("/auth/check")
      .then((res) => {
      authenticate(res.data.user, res.data.accessToken, false)
      // console.log("user:",res.data.user)
      })
      .catch((error) => {
        console.log(error);
        setAuthentication({ ...authentication, loading: false });
      });
  };

  useEffect(() => {
    checkAuthentication();
    const interval = setInterval(checkAuthentication, 5 * 1000);
    return () => clearInterval(interval);
  });

  const authenticate = (
    user: User,
    token: string,
    redirect: boolean = true
  ) => {
    setAuthentication({
      id: user.id,
      name: user.name,
      email: user.email,
      citizenshipNumber: user.citizenshipNumber,
      profileImage:user.profileImage,
      isAdmin: user.admin,
      isCandidate: user.candidate,
      authenticated: true,
      accessToken: token,
      loading: false,
    });

    if (redirect) navigate("/");
  };

  const logout = async () => {
    await axios.post("/auth/logout");

    setAuthentication({
      id: 0,
      name: "",
      email: "",
      citizenshipNumber: "",
      profileImage:"",
      isAdmin: false,
      isCandidate: false,
      authenticated: false,
      accessToken: "",
      loading: false,
    });

    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        id: authentication.id,
        name: authentication.name,
        email: authentication.email,
        citizenshipNumber: authentication.citizenshipNumber,
        profileImage: authentication.profileImage,
        isAdmin: authentication.isAdmin,
        isCandidate: authentication.isCandidate,
        authenticated: authentication.authenticated,
        accessToken: authentication.accessToken,
        loading: authentication.loading,
        authenticate,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
