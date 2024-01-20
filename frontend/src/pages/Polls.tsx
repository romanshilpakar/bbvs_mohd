import React, { useEffect, useState } from "react";
import Panel from "../components/Polls/Panel";
import Chart from "../components/Polls/Chart";
import axios from "../axios";
import { convertToHumanReadable } from "../utils/helper";

const Polls = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ name: "", description: "", votes: {},electionStarted:false,startDate:Date,endDate:Date });

  useEffect(() => {
    axios
      .get("/polls/")
      .then((res) => {
        // setData(res.data);
        const modifiedData = {
          ...res.data,
          // Set votes object with 0 for all candidates
          votes: Object.fromEntries(Object.keys(res.data.votes).map(candidate => [candidate, 0]))
        };

        setData(modifiedData);
        setLoading(false);
      })
      .catch((err) => console.log({ err }));
  }, []);


  useEffect(() => {
    const checkAutostart = async () => {
      if (!data.electionStarted && data.startDate) {
        const currentDate = new Date();
        const startsDate = new Date(data.startDate as any as string);

        if (currentDate > startsDate) {
          console.log("election started");
          try {
            await axios.post("/polls/autostartelection");
            axios.get("/polls/").then((res) => {
              setData(res.data);
            });      
            window.location.reload() 
          } catch (error) {
            console.error("Error autostarting election:", error);
          }
        }
      }
    };

    // Check autostart every 10 seconds
    const autostartInterval = setInterval(checkAutostart, 5000);

    return () => {
      clearInterval(autostartInterval);
    };
  }, [data.electionStarted, data.startDate]);

  useEffect(() => {
    const checkAutoEnd = async () => {
      if (data.electionStarted && data.endDate) {
        const currentDate = new Date();
        const endsDate = new Date(data.endDate as any as string);

        if (endsDate < currentDate) {
          endElection();
        }
      }
    };

    // Check autostart every 10 seconds
    const autostartInterval = setInterval(checkAutoEnd, 5000);

    return () => {
      clearInterval(autostartInterval);
    };
  }, [data.electionStarted, data.endDate]);


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
      <div style={{ marginTop: '10px' }}>Election starts on {data.startDate}</div>
      }
       {data.electionStarted && data.endDate &&
      <div style={{ marginTop: '10px' }}>Election ends on {""}
      {convertToHumanReadable(data.endDate)}
      </div>
      }
      {data.electionStarted &&
      <div style={{ marginTop: '10px' }}>Result will be displayed after election ends</div>
      }
      </>
    </Panel>
  );
};

export default Polls;
