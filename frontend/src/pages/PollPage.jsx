import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";

const socket = io("https://real-time-poll-rooms-rw4a.onrender.com");

function PollPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [error, setError] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const savedIndex = localStorage.getItem(`voted_${id}`);
    return savedIndex !== null ? Number(savedIndex) : null;
  });
  const shareUrl = window.location.href;


  useEffect(() => {
    socket.emit("joinPoll", id);

    axios.get(`https://real-time-poll-rooms-rw4a.onrender.com/api/poll/${id}`)
      .then(res => {
        setPoll(res.data);

        const stored = JSON.parse(localStorage.getItem("recentPolls")) || [];

        const updated = [
          { id: id, question: res.data.question },
          ...stored.filter(p => p.id !== id)
        ].slice(0, 5);

        localStorage.setItem(
          "recentPolls",
          JSON.stringify(updated)
        );
      })
      .catch(err=>{
        setError(true);
      })

    socket.on("voteUpdate", (updatedPoll) => {
      setPoll(updatedPoll);
    });

    return () => {
      socket.off("voteUpdate");
    };

  }, [id]);


  const handleVote = async (index) => {
    try{

      await axios.post(
        `https://real-time-poll-rooms-rw4a.onrender.com/api/poll/${id}/vote`,
        { optionIndex: index }
      )
      
        localStorage.setItem(`voted_${id}`, index);
        setSelectedIndex(index);
        alert("Your vote has been recorded");
      
    }
    catch(err){
      alert(err.response?.data?.message || "Something went wrong!");
    }
    
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied!");
  };

  if(error){
    return (
      <div>
        <h2 className="font-semibold text-2xl text-red-600">Poll not found!</h2>
        <div className="mt-16">
        <Link
          to="/"
          className="boder-2 boder-black bg-black text-white px-7 py-3 rounded-lg mt-4 text-lg">
          Go back
        </Link>
      </div>
      </div>
    )
  }

  if (!poll) return <div>Loading...</div>;

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="border-2 border-black p-3 sm:p-7 mx-3 sm:mx-20 my-10">
      {/* question */}
      <div>
        <h2 className="font-semibold text-2xl sm:text-3xl mb-7">Q) {poll.question}</h2>
      </div>
      
      
      {/* options */}
      <div>

        {poll.options.map((opt, index) => {
          const percentage = totalVotes === 0 ? 0 : (opt.votes / totalVotes * 100).toFixed(1);

          return (
            <div className={`my-3 px-2 w-full md:w-[70%] ${(selectedIndex !== null && selectedIndex !== index) ? "opacity-70" : "opacity-100"}`} key={index}>
              <button
                className={`text-white mx-2 px-5 py-1 rounded-lg mb-1   ${(selectedIndex !== null && selectedIndex === index) ? "bg-green-500" : "bg-black"} `}
                // disabled={selectedIndex !== null}
                onClick={() => handleVote(index)}
              >
                {opt.text}
              </button>
              <span> {opt.votes} votes ({percentage}%)</span>

              <div className="bg-gray-200 w-full h-2 rounded">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <hr />

            </div>

          )
        })}
      </div>

      {/* share link */}
      <div className="my-5">
        <p className="text-sm">Share this link:</p>
        <div className="flex gap-2">
          <input
            value={shareUrl}
            readOnly
            className="border px-2 py-1 w-75"
          />
          <button
            onClick={handleCopy}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Copy
          </button>
        </div>
      </div>


      {/* Navigate to createPoll */}
      <div className="mt-16 mb-4">
        <Link
          to="/"
          className="boder-2 boder-black bg-black text-white px-7 py-3 rounded-lg mt-4 text-lg">
          Create New Poll
        </Link>
      </div>
    </div>
  );
}

export default PollPage;
