import React from 'react'
import {Routes, Route} from 'react-router-dom'
import CreatePoll from './pages/CreatePoll.jsx'
import PollPage from './pages/PollPage.jsx'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className='px-2 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] lg:m-18 lg:mt-5'>
      <div className=' text-4xl sm:text-6xl font-semibold my-7 mb-9 md:mx-2 text-center'>Real-Time Poll Rooms</div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path='/' element={<CreatePoll />} />
        <Route path='/poll/:id' element={<PollPage />} />
      </Routes>

    </div>
  )
}

export default App;