import React, { useEffect, useState } from "react";
import axios from "../../axios";
import Chart from "../../components/Polls/Chart";
import Panel from "../../components/Polls/Panel";
import { convertToHumanReadable } from "../../utils/helper";

const Polls = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ name: "", description: "", votes: {} ,electionStarted:false,startDate:Date,endDate:Date });


  useEffect(() => {
    axios.get("/polls/").then((res) => {
      console.log("response:",res.data);
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
        {!data.electionStarted && data.startDate &&
      <div style={{ marginTop: '10px' }}>Election starts on {""}
      {convertToHumanReadable(data.startDate)}
      </div>}
       {data.electionStarted && data.endDate &&
      <div style={{ marginTop: '10px' }}>Election ends on {""}
      {convertToHumanReadable(data.endDate)}
      </div>}
        {data.electionStarted &&
        <button
        onClick={endElection}
        className="end-election-button button-primary"
      >
        End Election Now
      </button>
      }
    
      </>
    </Panel>
  );
};

export default Polls;