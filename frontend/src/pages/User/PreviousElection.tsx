import React, { useEffect, useState } from "react";
import axios from "../../axios";
import Chart from "../../components/Polls/Chart";
import Panel from "../../components/Polls/Panel";

const PreviousElection = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ name: string; description: string; votes: Record<string, number> }[]>([]);

  useEffect(() => {
    axios.get("/polls/allpoll").then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {data.length === 0 ? (
        <div>No Previous Elections</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[...data].reverse().map((election, index) => (
            <Panel key={index} name={election.name} description={election.description}>
              <Chart votes={election.votes} />
            </Panel>
          ))}
        </div>
      )}
    </>
  );
};

export default PreviousElection;
