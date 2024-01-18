import React, { useEffect, useState } from "react";
import axios from "../../axios";
import Chart from "../../components/Polls/Chart";
import Panel from "../../components/Polls/Panel";

const Polls = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ name: "", description: "", votes: {} });
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  useEffect(() => {
    // Try to get the endDate from local storage
    const storedEndDate = localStorage.getItem("endDate");

    if (storedEndDate) {
      setEndDate(new Date(storedEndDate));
    } else {
      // If not found, fetch the data from the server and set the endDate
      axios.get("/polls/").then((res) => {
        setData(res.data);
        setLoading(false);
        const currentDate = new Date();
        const newEndDate = new Date(currentDate.getTime() + 2 * 30000); // 2 minutes in milliseconds
        setEndDate(newEndDate);
        // Store the endDate in local storage
        localStorage.setItem("endDate", newEndDate.toISOString());
      });
    }
  }, []);

  useEffect(() => {
    const calculateRemainingTime = () => {
      const currentDate = new Date();

      if (endDate && currentDate < endDate) {
        const timeDifference = endDate.getTime() - currentDate.getTime();
        setRemainingTime(timeDifference);
      } else {
        setRemainingTime(null);
        endElection();
      }
    };

    // Calculate the remaining time periodically (every second in this example)
    const intervalId = setInterval(calculateRemainingTime, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [endDate]);

  const endElection = () => {
    axios
      .post("/polls/end")
      .then((_) => {
        // Remove the endDate from local storage after ending the election
        localStorage.removeItem("endDate");
        window.location.reload();
      })
      .catch((err) => console.log({ err }));
  };

  const formatRemainingTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes} min ${remainingSeconds} sec`;
  };

  if (loading) return <div></div>;

  return (
    <Panel name={data.name} description={data.description}>
      <>
        <Chart votes={data.votes} />

        {remainingTime !== null && (
          <div className="remaining-time">
            Election ends in: {formatRemainingTime(remainingTime)}
          </div>
        )}

        <button
          onClick={endElection}
          className="end-election-button button-primary"
        >
          End Election
        </button>
      </>
    </Panel>
  );
};

export default Polls;
