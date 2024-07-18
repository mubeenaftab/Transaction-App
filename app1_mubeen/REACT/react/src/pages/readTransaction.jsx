import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api'; // Import your API module
import Swal from 'sweetalert2';

function ReadTransaction() {
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Function to fetch transactions based on page number
        const fetchTransactions = async (page = 1, size = 10) => {
            try {
                const response = await api.get(`/transactions`, { params: { page, size } });
                setTransactions(response.data.items); // Assuming your API response has an 'items' field for transactions
                setTotalPages(Math.ceil(response.data.total / size)); // Adjust according to your API response structure
            } catch (error) {
                console.error('Error fetching transactions:', error);
                // Handle error state if needed
            }
        };

    // Fetch transactions on component mount or when currentPage changes
    useEffect(() => {
        fetchTransactions(currentPage);
    }, [currentPage]);

    // Handle deletion of a transaction
    const handleDelete = async (transactionId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `Do you want to delete transaction ?`,
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
        }``
    };

    // Function to handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center ">
                <div className="col-lg-10">
                    <div className="card shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Transactions List</h2>
                            <div className="table-responsive">
                                <table className="table table-hover ">
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
                            <div className="d-flex justify-content-center mt-3">
                                <nav aria-label="Page navigation">
                                    <ul className="pagination">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                                        </li>
                                        {[...Array(totalPages).keys()].map(page => (
                                            <li key={page + 1} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageChange(page + 1)}>{page + 1}</button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div className="text-center mt-3">
                                <Link to="/" className="btn btn-secondary">Back to Home</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReadTransaction;




