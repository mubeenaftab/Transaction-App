import { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import api from '../api';
import Swal from 'sweetalert2';

function CreateTransaction() {
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        is_income: false,
        date: ''
    });

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            await api.post('/transactions', formData);
            Swal.fire({
                title: 'Transaction Created!',
                text: 'Transaction created successfully!',
                icon: 'success',
                timer: 3000,
                timerProgressBar: true,
                position: 'top-end',
                toast: true,
                showConfirmButton: false
            });
            setFormData({
                amount: '',
                category: '',
                description: '',
                is_income: false,
                date: ''
            });
            navigate('/read-transaction'); 
        } catch (error) {
            console.error('Error creating transaction:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to create transaction.',
                icon: 'error',
                timer: 3000,
                timerProgressBar: true,
                position: 'top-end',
                toast: true,
                showConfirmButton: false
            });
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-4 my-4">
                <div className="col-lg-10 mb-3">
                    <div className="card shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Enter Transaction</h2>
                            <form onSubmit={handleFormSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="amount" className="form-label">Amount</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="amount"
                                        name="amount"
                                        onChange={handleInputChange}
                                        value={formData.amount}
                                        placeholder="Enter the amount" 
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="category" className="form-label">Category</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="category"
                                        name="category"
                                        onChange={handleInputChange}
                                        value={formData.category}
                                        placeholder="Enter the category" 
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        onChange={handleInputChange}
                                        value={formData.description}
                                        placeholder="Enter a description" 
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="is_income" className="form-label">Income</label><br />
                                    <input
                                        type="checkbox"
                                        id="is_income"
                                        name="is_income"
                                        onChange={handleInputChange}
                                        checked={formData.is_income}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="date" className="form-label">Date</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="date"
                                        name="date"
                                        onChange={handleInputChange}
                                        value={formData.date}
                                        placeholder="Enter the date (YYYY-MM-DD)" 
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default CreateTransaction;