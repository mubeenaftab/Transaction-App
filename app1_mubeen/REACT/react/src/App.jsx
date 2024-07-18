import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateTransaction from './pages/createTransaction'
import ReadTransaction from './pages/readTransaction'
import UpdateTransaction from './pages/updateTransaction'
import api from './api';

const App = () => {
  return (
    <Router>
      <div className="container m-5">
        <div className='text-sm-center mx-auto p-2'>
          <h2>Transaction Management</h2>
        </div>
        <div className='text-sm-center mx-auto p-2' >
          <ul className="list-unstyled">
            <li className='mb-2' ><Link className='btn btn-primary text-white' to="/create-transaction">Create Transaction</Link></li>
            <li > <Link className='btn btn-danger text-white' to="/read-transaction">Read Transaction</Link></li>
          </ul>
        </div>

      </div>
      <Routes>
        <Route path="/create-transaction" element={<CreateTransaction />} />
        <Route path="/read-transaction" element={<ReadTransaction />} />
        <Route path="/update-transaction/:id" element={<UpdateTransaction />} />
      </Routes>
    </Router>
  );
}


export default App;
