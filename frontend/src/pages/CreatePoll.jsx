import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import del from '../assets/del.svg';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";


function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const navigate = useNavigate();

  const [recentPolls, setRecentPolls] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentPolls")) || [];
    setRecentPolls(stored);
  }, []);



  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const reduceOption = (index) => {
    setOptions((prev) => {
      return prev.filter((ele, i) => i !== index);
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      "https://real-time-poll-rooms-rw4a.onrender.com/api/poll",
      { question, options }
    );
    toast.success("Poll created")
    navigate(`/poll/${res.data.pollId}`);
  };




  return (
    <div className="border-2 border-black p-2 sm:p-4 mx-3 sm:mx-4 md:mx-20 my-10">
      <h2 className="font-semibold text-3xl md:text-5xl text-center mb-3">Create Poll</h2>
      <form onSubmit={handleSubmit}>
        <div className="m-2 sm:m-5">
          Question: &nbsp;
          <input
            type="text"
            placeholder="Enter your question here"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="outline-none border border-gray-700 rounded-sm px-1 md:px-3 py-1 w-full md:w-[60%] text-sm"
            required
          />
        </div>
        <div className="m-2 sm:m-5 ">
          <div>
            Add Options
          </div>

          <div className="sm:ml-3 mt-2">

            {options.map((opt, index) => (
              <div key={index} className="flex items-center">
                <span className="hidden sm:inline">{`Option ${index + 1}`}:</span>
                <input
                  type="text"
                  placeholder={`Enter Option ${index + 1}`}
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(index, e.target.value)
                  }
                  className="outline-none border rounded-sm border-gray-600 text-sm my-1 ml-2 px-3"
                  required
                />
                {index > 1 &&
                  <div className="ml-2">
                    <button onClick={() => reduceOption(index)}>
                      <img className="" src={del} alt="del" />
                    </button>
                  </div>
                }
              </div>
            ))}
          </div>

          <button type="button" onClick={addOption}
            className="border-2 border-gray-500 rounded-lg bg-black text-white m-2 py-1 px-4 ">
            Add Option
          </button>
        </div>

        <button className="boder-2 boder-black bg-black text-white px-7 py-3 rounded-lg mt-4 text-lg" type="submit">Create</button>
      </form>

      <div>
        {recentPolls.length > 0 && (
          <div className="mt-10 sm:w-[90%] md:w-[60%] ">
            <h3 className="font-bold text-lg mb-4">
              Recently Visited Polls
            </h3>

            {recentPolls.map((poll) => (
              <Link
                key={poll.id}
                to={`/poll/${poll.id}`}
                className="block border p-3 rounded mb-2 hover:bg-gray-100"
              >
                {poll.question}
              </Link>
            ))}
          </div>
        )}



      </div>


    </div>
  );
}

export default CreatePoll;
