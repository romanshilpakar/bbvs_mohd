import React, { useEffect, useState } from "react";
import axios from "../../axios";
import Chart from "../../components/Polls/Chart";
import Panel from "../../components/Polls/Panel";

const PreviousElection = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ name: string; description: string; votes: Record<string, number> }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // console.log("data:",data)

  useEffect(() => {
    axios.get("/polls/allpoll").then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  const filteredData = data.filter((election) =>
    election.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    // <>

    //   {data.length === 0 ? (
    //     <div>No Previous Elections</div>
    //   ) : (
    //     <div style={{ display: "flex", flexDirection: "column" }}>
    //       {[...data].reverse().map((election, index) => (
    //         <Panel key={index} name={election.name} description={election.description}>
    //           <Chart votes={election.votes} />
    //         </Panel>
    //       ))}
    //     </div>
    //   )}
    // </>
    <>
    <div style={{ display: "flex", flexDirection: "column",width:"800px" }}>
      <h2>Enter Election Title to search for:</h2>
      <input
        type="text"
        placeholder="Search by Election Title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "400px", height: "40px" }}
      />
      {searchTerm !== '' && filteredData.length === 0 ? (
        <div style={{marginTop:"10px"}}>No Previous Elections matching the given election title</div>
      ) : searchTerm === '' ? (
        <div style={{marginTop:"10px"}}>Search Previous Election by name....</div>
      ) : (
        <>
        <div style={{marginTop:"10px"}}>Found Elections:</div>
        
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[...filteredData].reverse().map((election, index) => (
            <Panel key={index} name={election.name} description={election.description}>
              <Chart votes={election.votes} />
            </Panel>
          ))}
        </div>
        </>

      )}
      </div>
    </>
  );
};

export default PreviousElection;
