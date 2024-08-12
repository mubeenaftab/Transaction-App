import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api'; // Import your API module
import Swal from 'sweetalert2';

function ReadTransaction() {
    const [transactions, setTransactions] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTransactions = async (page = 1, size = 9, search) => {
        try {
            const response = await api.get(`/transactions`, {
                params: {
                    page,
                    size,
                    search
                }
            });
            setTransactions(response.data.transactions);
            setTotalAmount(response.data.total_amount); //total amount of filtered transactions
            setTotalPages(response.data.pages);
            setCurrentPage(response.data.page);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    useEffect(() => {
        fetchTransactions(currentPage, 9, searchTerm);
    }, [currentPage, searchTerm]);

    const handleDelete = async (transactionId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `Do you want to delete this transaction?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!'
            });

            if (result.isConfirmed) {
                await api.delete(`/transactions/${transactionId}`);
                fetchTransactions(currentPage); // Reload transactions after deletion
                Swal.fire({
                    title: 'Deleted!',
                    text: `Transaction deleted successfully!`,
                    icon: 'success',
                    timer: 3000,
                    timerProgressBar: true,
                    position: 'top-end',
                    toast: true,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete transaction.',
                icon: 'error',
                timer: 3000,
                timerProgressBar: true,
                position: 'top-end',
                toast: true,
                showConfirmButton: false
            });
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="container">
            <div className="container-fluid d-flex justify-content-center align-items-center vh-10 ">
  <div className="container p-5 rounded">
    <div className="text-center">
      <h2>Transaction Management</h2>
    </div>
    <div className="text-center p-2">
      <ul className="list-unstyled">
        <li className="mb-2">
          <Link className="btn btn-primary" to="/create-transaction">Create Transaction</Link>
        </li>
        <li>
          <Link className="btn btn-danger" to="/read-transaction">Read Transaction</Link>
        </li>
      </ul>
    </div>
  </div>
</div>
            <div className="row justify-content-center">
                <div className="col-lg-10 mb-3">
                    <div className="card shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Transactions List</h2>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    placeholder="Search by category, description, date"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="form-control mb-2"
                                />
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Category</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Income</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Actions</th>
                                         
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map(transaction => (
                                            <tr key={transaction.table_name_id}>
                                                <td>{transaction.amount}</td>
                                                <td>{transaction.category}</td>
                                                <td>{transaction.description}</td>
                                                <td>{transaction.is_income ? 'Yes' : 'No'}</td>
                                                <td>{transaction.date}</td>
                                                <td>
                                                    <Link to={`/update-transaction/${transaction.table_name_id}`} className="btn btn-sm btn-primary me-2">Update</Link>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(transaction.table_name_id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                   
                                <div className="alert alert-primary pb-0" role="alert">
                                    <h5 className="alert-heading">Total Amount</h5>
                                    <p className="fs-5 pb-0">${totalAmount}</p>
                                </div>
                        
                            <div className="d-flex justify-content-center mt-1">
                                <nav aria-label="Page navigation">
                                    <ul className="pagination">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                                        </li>
                                        {Array.from({ length: totalPages }, (_, index) => (
                                            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReadTransaction;