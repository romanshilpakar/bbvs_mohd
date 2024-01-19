import React, { useEffect, useState } from "react";
import axios from "../../axios";
import Chart from "../../components/Polls/Chart";
import Panel from "../../components/Polls/Panel";

const Polls = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ name: "", description: "", votes: {} ,electionStarted:false,startDate:Date });

  useEffect(() => {
    axios.get("/polls/").then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  const endElection = () => {
    axios
      .post("/polls/end")
      .then((_) => window.location.reload())
      .catch((err) => console.log({ err }));
  };

  if (loading) return <div></div>;

  return (
    <Panel name={data.name} description={data.description}>
      <>
        <Chart votes={data.votes} />
        {/* {data.electionStarted ? */}
        <button
        onClick={endElection}
        className="end-election-button button-primary"
      >
        End Election
      </button>
      {/* :(
        <div>Election starts on {data.startDate}</div>
      )} */}

        
      </>
    </Panel>
  );
};

export default Polls;