import React, { useEffect, useState } from "react";
import axios from "../../axios";

interface ChartProps {
  votes: any;
  enableVote?: boolean;
  userId?: number;
  userName?: string;
}

interface CandidateProfile {
  profileImages?: {
    [key: string]: string;
  };
}

const Chart = (props: ChartProps) => {
  const votes = props.votes;
  const [profiles, setProfiles] = useState<CandidateProfile | null>(null)
  // console.log("profiles:",profiles)



  useEffect(() => {
    axios
      .get("/polls/")
      .then((res) => {
        console.log("data:",res.data)
        setProfiles(res.data)
        
      })
      .catch((err) => console.log({ err }));
  }, []);

  const getButtons = () => {
    const names = [];

    const vote = (candidate: string) => {
      axios
        .post("/polls/vote", {
          id: props.userId?.toString(),
          name: props.userName,
          candidate,
        })
        .then((_) => window.location.reload())
        .catch((err) => console.log({ err }));
    };

    for (const name in votes) {
      names.push(
        <button
          onClick={() => vote(name)}
          key={name}
          className="button-wrapper text-normal"
        >
          vote
        </button>
      );
    }

    return names;
  };

  const getNames = () => {
    const names = [];

    for (const name in votes) {
      const candidateProfile = profiles?.profileImages?.[name];
      names.push(
        <div key={name} className="name-wrapper text-normal">
         <div>{name}</div> 
          {candidateProfile ? 
          <img src={candidateProfile} alt="profile image"  height={60} width={60}
          style={{ borderRadius: '50%', objectFit: 'cover'}}/>
          :(
            // <i className="bi bi-person-circle"></i>
            <i className="bi bi-person-circle" style={{ fontSize: '60px', width: '60px', height: '60px' }}></i>
          )
           }
        </div>
      );
    }

    return names;
  };

  const getTotal = () => {
    let total = 0;

    for (const name in votes) {
      total += parseInt(votes[name]);
    }

    return total;
  };

  const getBars = () => {
    const bars = [];
    const total = getTotal();

    for (const name in votes) {
      const count = votes[name];
      bars.push(
        <div key={name} className="bar-wrapper">
          <div
            style={{
              height: count != 0 ? `${(count * 100) / total}%` : "auto",
              border: "2px solid #4daaa7",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
              color: "white",
              backgroundColor: "rgb(77, 170, 167)",
              paddingBottom: 10,
              paddingTop: 10,
            }}
          >
            {votes[name]}
          </div>
        </div>
      );
    }

    return bars;
  };

  return (
    <div>
      <div className="bars-container">{getBars()}</div>
      <div className="names-wrapper">{getNames()}</div>

      {props.enableVote ? (
        <div className="buttons-wrapper">{getButtons()}</div>
      ) : null}
    </div>
  );
};

export default Chart;
