import React, { useState ,useEffect} from "react";
import { Formik } from "formik";
import axios from "../../axios";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().min(3).required(),
  description: yup.string().min(10).required(),
});

interface Candidate {
  name: string;
}

const Start = () => {
  const [candidates, setCandidates] = useState<Array<Candidate>>([]);
  const [verifiedCandidates, setVerifiedCandidates] = useState([]);
  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>("");

    const [startDate, setStartDate] = useState<Date | null>(null);
    // const [startDate, setStartDate] = useState(new Date("2024-01-20T12:00:00"));
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [electionStarted, setElectionStarted] = useState(false);


  useEffect(() => {
    axios
      .get("/users/verifiedcandidates")
      .then((res) => {
        setVerifiedCandidates(res.data);
      })
      .catch((error) => console.log({ error }));
  }, []);

  const handleScheduleElection = () => {
    console.log("Election scheduled!");
    setElectionStarted(false)

  };

  const handleStartElectionNow = () =>{
    setElectionStarted(true)
  }



  return (
    <>
    <div className="form-container">
      {error !== "" ? <div className="error-message">{error}</div> : null}

      <Formik
        initialValues={{
          name: "",
          description: "",
        }}
        validationSchema={schema}
        onSubmit={({ name, description }) => {
         

          let candidatesError = "";

          if (candidates.length < 2) candidatesError = "Not Enough Candidates";

          for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i];

            if (candidate.name.length < 2) {
              candidatesError = "invalid name " + candidate.name;
              break;
            }
          }
          setError(candidatesError);

          if (candidatesError === "") {
            const formData = {
              name,
              description,
              candidates,
              electionStarted,
              startDate: electionStarted ? null : startDate,
              endDate: electionStarted ? null : endDate,
            };
            axios
              .post("/polls/start", formData)
              .then((_) => {
                window.location.reload();
              })
              .catch((err) => {
                let error = err.message;
                if (err?.response?.data) error = err.response.data;
                setError(error.slice(0, 50));
              });
          }
        }}
      >
        {({ errors, touched, getFieldProps, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                id="name"
                type="text"
                placeholder="Poll Name"
                {...getFieldProps("name")}
              />

              <div className="form-error-text">
                {touched.name && errors.name ? errors.name : null}
              </div>
            </div>

            <div className="input-container">
              <input
                id="description"
                type="text"
                placeholder="Poll Description"
                {...getFieldProps("description")}
              />

              <div className="form-error-text">
                {touched.description && errors.description
                  ? errors.description
                  : null}
              </div>
            </div>

            {candidates.length !== 0 ? (
              <div className="candidates-container">
                {candidates.map(({ name}, index) => (
                  <div key={index} className="candidate-wrapper">
                    <span>{name}</span>
                    <span
                      onClick={() => {
                        const newList = [...candidates];
                        const i = newList.indexOf({ name});
                        newList.splice(i, 1);

                        setCandidates(newList);
                      }}
                      className="remove"
                    >
                      <i className="bi bi-dash-circle"></i>
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="input-container">
              <div className="add-candidate-wrapper">
              <select
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  value={name}
                >
                  <option value="">Select a Candidate</option>
                  {verifiedCandidates.map((candidate: Candidate) => (
                    <option key={candidate.name} value={candidate.name}>
                      {candidate.name}
                    </option>
                  ))}
                </select>

                <button
                  className=""
                  type="button"
                  onClick={() => {
                    if (name !== "") {
                      const newCandidate = { name };
                      setCandidates([...candidates, newCandidate]);
                      setName("");
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="startDate">Start Date:</label>
              <input
                id="startDate"
                type="datetime-local"
                {...getFieldProps("startDate")}
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </div>

            <div className="input-container">
              <label htmlFor="endDate">End Date:</label>
              <input
                id="endDate"
                type="datetime-local"
                {...getFieldProps("endDate")}
                onChange={(e) => setEndDate(new Date(e.target.value))}
              />
            </div>

            <div className="input-container">
              <button
                className="login-button button-primary"
                type="button"
                // onClick={handleScheduleElection}
                onClick={() => {
                  handleScheduleElection();
                  handleSubmit();
                }}
              >
                Schedule Election
              </button>
            </div>


            <button className="login-button button-primary" 
            // type="submit"
            type="button"
            onClick={() => {
              handleStartElectionNow();
              handleSubmit();
            }}
            >
              Start Election Now
            </button>
          </form>
        )}
      </Formik>
    </div>
      </>
  );
};

export default Start;
