import React from 'react'
import {Routes, Route} from 'react-router-dom'
import CreatePoll from './pages/CreatePoll.jsx'
import PollPage from './pages/PollPage.jsx'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <div className='text-6xl font-bold my-7 mb-9 mx-2 text-center'>Real-Time Poll Rooms</div>
      <Routes>
        <Route path='/' element={<CreatePoll />} />
        <Route path='/poll/:id' element={<PollPage />} />
      </Routes>

    </div>
  )
}

export default App;