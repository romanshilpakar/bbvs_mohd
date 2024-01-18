import { useEffect, useState } from "react";
import axios from "../../axios";

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  candidate: boolean;
  verified: boolean;
};

const Candidates = () => {
  const [candidates, setCandidates] = useState<User[]>([]);
  const [verifiedCandidates, setVerifiedCandidates] = useState<User[]>([]);
  const [unverifiedCandidates, setUnverifiedCandidates] = useState<User[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPdfPopup, setShowPdfPopup] = useState(false);

  useEffect(() => {
    axios
      .get("/users/allcandidates")
      .then((res) => {
        const candidates = res.data;
        const verifiedCandidates = candidates.filter(
          (candidate: User) => candidate.verified
        );
        const unverifiedCandidates = candidates.filter(
          (candidate: User) => !candidate.verified
        );
        setCandidates(candidates);
        setVerifiedCandidates(verifiedCandidates);
        setUnverifiedCandidates(unverifiedCandidates);
      })
      .catch((error) => console.log({ error }));
  }, []);

  const verifyUser = (email: string) => {
    axios
      .post("/users/verify", { email: email })
      .then((res) => {
        const index = unverifiedCandidates.findIndex(
          (user) => user.email === email
        );
        const newUnverifiedUsers = [...unverifiedCandidates];
        newUnverifiedUsers.splice(index, 1);
        setUnverifiedCandidates(newUnverifiedUsers);

        const verifiedUser = candidates.find((user) => user.email === email);
        if (verifiedUser) {
          setVerifiedCandidates([...verifiedCandidates, verifiedUser]);
        }
      })
      .catch((error) => console.log({ error }));
  };

  const notVerifyUser = (email: string) => {
    axios
      .post("/users/notverify", { email: email })
      .then((res) => {
        const index = verifiedCandidates.findIndex(
          (user) => user.email === email
        );
        const newverifiedCandidates = [...verifiedCandidates];
        newverifiedCandidates.splice(index, 1);
        setVerifiedCandidates(newverifiedCandidates);

        const unverifiedUser = candidates.find((user) => user.email === email);
        if (unverifiedUser) {
          setUnverifiedCandidates([...unverifiedCandidates, unverifiedUser]);
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

  const handleView = async (email: string) => {
    try {
      const response = await axios.post("/users/viewdocument", {
        email: email,
      });
      const responseData = response.data;

      const pdfData = `data:application/pdf;base64,${responseData}`;

      setPdfUrl(pdfData);
      setShowPdfPopup(true);
    } catch (error) {
      console.log(error);
    }
  };

  const closePdfPopup = () => {
    setPdfUrl(null);
    setShowPdfPopup(false);
  };

  const removeUserFromList = (email: string) => {
    const index = candidates.findIndex((user) => user.email === email);
    const newUsers = [...candidates];
    newUsers.splice(index, 1);
    setCandidates(newUsers);
    setVerifiedCandidates(newUsers.filter((user) => user.verified));
    setUnverifiedCandidates(newUsers.filter((user) => !user.verified));
  };

  if (candidates.length === 0) return <div></div>;

  return (
    <>
      {showPdfPopup && pdfUrl && (
        <div className="pdf-popup">
          <button onClick={closePdfPopup} className="pdf-popup-close">
              Close
            </button>
          <div className="pdf-popup-content">
            
            <embed
              src={pdfUrl}
              width="600px"
              height="600px"
              type="application/pdf"
            />
          </div>
          
        </div>
      )}

      {!showPdfPopup && (
        <>
          <div className="users-wrapper">
            <p>Unverified Candidates</p>
            {unverifiedCandidates.map((user, index) => (
              <div key={index} className="user-wrapper">
                {user.name}
                <div>
                  <button
                    onClick={() => handleView(user.email)}
                    className="button-primary"
                  >
                    View Document
                  </button>
                  <button
                    onClick={() => verifyUser(user.email)}
                    className="button-primary"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => deleteUser(user.email)}
                    className="button-black"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <hr />

          <div className="users-wrapper">
            <p>Verified Candidates</p>
            {verifiedCandidates.map((user, index) => (
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
      )}
    </>
  );
};

export default Candidates;
