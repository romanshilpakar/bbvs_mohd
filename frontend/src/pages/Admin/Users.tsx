import React, { useEffect, useState } from "react";
import axios from "../../axios";

type User = {
  id: number;
  name: string;
  citizenshipNumber: string;
  email: string;
  verified: boolean;
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [verifiedUsers, setVerifiedUsers] = useState<User[]>([]);
  const [unverifiedUsers, setUnverifiedUsers] = useState<User[]>([]);

  useEffect(() => {
    axios
      .get("/users/allusers")
      .then((res) => {
        const allUsers = res.data;
        const verifiedUsers = allUsers.filter((user: User) => user.verified);
        const unverifiedUsers = allUsers.filter((user: User) => !user.verified);
        setUsers(allUsers);
        setVerifiedUsers(verifiedUsers);
        setUnverifiedUsers(unverifiedUsers);
      })
      .catch((error) => console.log({ error }));
  }, []);

  const verifyUser = (email:string) => {
    axios
      .post("/users/verify", { email: email })
      .then((res) => {
        const index = unverifiedUsers.findIndex((user) => user.email === email);
        const newUnverifiedUsers = [...unverifiedUsers];
        newUnverifiedUsers.splice(index, 1);
        setUnverifiedUsers(newUnverifiedUsers);
  
        const verifiedUser = users.find((user) => user.email === email);
        if (verifiedUser) {
          setVerifiedUsers([...verifiedUsers, verifiedUser]);
        }
      })
      .catch((error) => console.log({ error }));
  };

  const notVerifyUser = (email:string) => {
    axios
      .post("/users/notverify", { email: email })
      .then((res) => {
        console.log(res);
        const index = verifiedUsers.findIndex((user) => user.email === email);
        const newVerifiedUsers = [...verifiedUsers];
        newVerifiedUsers.splice(index, 1);
        setVerifiedUsers(newVerifiedUsers);
  
        const unverifiedUser = users.find((user) => user.email === email);
        if (unverifiedUser) {
          setUnverifiedUsers([...unverifiedUsers, unverifiedUser]);
        }
      })
      .catch((error) => console.log({ error }));
  };


  const deleteUser = (email: string) => {
    axios
    .delete("/users/delete", { data: { email } })
      .then((res) => {
        removeUserFromList(email);
      })
      .catch((error) => console.log({ error }));
  };

  const removeUserFromList = (email: string) => {
    const index = users.findIndex((user) => user.email === email);
    const newUsers = [...users];
    newUsers.splice(index, 1);
    setUsers(newUsers);
    setVerifiedUsers(newUsers.filter((user) => user.verified));
    setUnverifiedUsers(newUsers.filter((user) => !user.verified));
  };

  if (users.length === 0) return <div></div>;

  return (
    <>
    <div className="users-wrapper">
      <p>Unverified Users</p>
      {unverifiedUsers.map((user, index) => (
        <div key={index} className="user-wrapper">
          {user.name}

          <div>
            <button
              onClick={() => verifyUser(user.email)}
              className="button-primary"
              
            >
              verify
            </button>

            <button
              onClick={() => deleteUser(user.email)}
              className="button-black"
            >
              delete
            </button>
          </div>
        </div>
      ))}
    </div>
    <hr />
    <div className="users-wrapper">
      <p>Verified Users</p>
      {verifiedUsers.map((user, index) => (
        <div key={index} className="user-wrapper">
          {user.name}

          <div>
            <button
              onClick={() => notVerifyUser(user.email)}
              className="button-red"
            >
              Unverify
            </button>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default Users;
