import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Swal from 'sweetalert2';

const UpdateTransactionForm = ({ transactionId }) => {
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        is_income: false,
        date: ''
    });

    const navigate = useNavigate();

    const fetchTransaction = async () => {
        try {
            const response = await api.get(`/transactions/${transactionId}`);
            const {
                amount,
                category,
                description,
                is_income,
                date
            } = response.data;
            setFormData({
                amount,
                category,
                description,
                is_income,
                date
            });
        } catch (error) {
            console.error('Error fetching transaction:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to fetch transaction.',
                icon: 'error',
                timer: 3000,
                timerProgressBar: true,
                position: 'top-end',
                toast: true,
                showConfirmButton: false
            });
        }
    };

    useEffect(() => {
        fetchTransaction();
    }, [transactionId]);

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await api.put(`/transactions/${transactionId}`, formData);
            Swal.fire({
                title: 'Updated!',
                text: 'Transaction updated successfully!',
                icon: 'success',
                timer: 3000,
                timerProgressBar: true,
                position: 'top-end',
                toast: true,
                showConfirmButton: false
            });
            navigate('/read-transaction');
        } catch (error) {
            console.error('Error updating transaction:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update transaction.',
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
                        <h2 className="card-title mb-4">Update Transaction</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="amount" className="form-label">Amount</label>
                                <input type="number" className="form-control" id="amount" name="amount" onChange={handleInputChange} value={formData.amount} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="category" className="form-label">Category</label>
                                <input type="text" className="form-control" id="category" name="category" onChange={handleInputChange} value={formData.category} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <input type="text" className="form-control" id="description" name="description" onChange={handleInputChange} value={formData.description} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="is_income" className="form-label">Income</label><br />
                                <input type="checkbox" className="form-check-input" id="is_income" name="is_income" onChange={handleInputChange} checked={formData.is_income} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="date" className="form-label">Date</label>
                                <input type="text" className="form-control" id="date" name="date" onChange={handleInputChange} value={formData.date} required />
                            </div>
                            <button type="submit" className="btn btn-primary">Update Transaction</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

const UpdateTransaction = () => {
    const { id } = useParams();

    return (
        <div>
            <UpdateTransactionForm transactionId={id} />
        </div>
    );
};

export default UpdateTransaction;