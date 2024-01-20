import React, { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import Chart from "../../components/Polls/Chart";
import Finished from "../../components/Polls/Finished";
import Panel from "../../components/Polls/Panel";
import Running from "../../components/Polls/Running";
import Waiting from "../../components/Waiting";
import { AuthContext } from "../../contexts/Auth";
import { convertToHumanReadable } from "../../utils/helper";

const User = () => {
  const [voteState, setVoteStatus] = useState<
    "finished" | "running" | "not-started" | "checking"
  >("checking");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ name: "", description: "", votes: {},electionStarted:false,startDate:Date,endDate:Date,completed:false });
  const [votable, setVotable] = useState("");

  const authContext = useContext(AuthContext);
    // console.log("voteState:",voteState);


  useEffect(() => {
    console.log("This is main page");

    axios
      .get("/polls/status")
      .then((res) => {
        setVoteStatus(res.data.status);
        setLoading(false);
      })
      .catch((error) => console.log({ error }));
  }, []);

  useEffect(() => {
    if(voteState === "finished"){
      axios.get("/polls/").then((res) => {
        setData(res.data);
        // console.log(res);
         
        setLoading(false);
      });

    }else if (voteState !== "checking") {
      axios.get("/polls/").then((res) => {
        // setData(res.data);
        // console.log(res);
           const modifiedData = {
          ...res.data,
          // Set votes object with 0 for all candidates
          votes: Object.fromEntries(Object.keys(res.data.votes).map(candidate => [candidate, 0]))
        };

        setData(modifiedData);
        setLoading(false);
      });

      axios
        .post("/polls/check-voteability", {
          id: authContext.id.toString(),
        })
        .then((res) => {
          setVotable(res.data);
        })
        .catch((err) => console.log(err));
    }
  });

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

  if (loading || voteState === "checking") return <div></div>;

  if (voteState === "not-started") return <Waiting />;

  return (
    <Panel name={data.name} description={data.description}>
      <>
        {voteState === "running" ? <Running /> : <Finished />}

        <Chart
          enableVote={votable === "not-voted"}
          userId={authContext.id}
          userName={authContext.name}
          votes={data.votes}
        />
        {!data.electionStarted && data.startDate &&
      <div style={{ marginTop: '10px' }}>Election starts on {""}
      {convertToHumanReadable(data.startDate)}
      </div>
        }
       {data.electionStarted && data.endDate && !data.completed &&
       <div style={{ marginTop: '10px' }}>Election ends on {""}
       {convertToHumanReadable(data.endDate)}
       </div>
      }
      </>
    </Panel>
  );
};

export default User;
