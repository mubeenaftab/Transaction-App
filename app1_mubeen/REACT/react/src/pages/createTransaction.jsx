import { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import api from '../api';
import Swal from 'sweetalert2';

//creating react application for our fastapi
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

    const fetchTransactions = async () => {
        const response = await api.get("/transactions");
        setTransactions(response.data);
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

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
            navigate('/read-transaction'); // Redirect to the read-transactions page
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
                <div className="col-lg-6 border">
                    <div className='mb-2 my-2 py-2'>
                        <h2>Enter Transaction</h2>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-3">
                            <label htmlFor="amount" className="form-label">Amount</label>
                            <input type="text" className="form-control" id="amount" name="amount" onChange={handleInputChange} value={formData.amount} required />
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
                            <input type="checkbox" id="is_income" name="is_income" onChange={handleInputChange} checked={formData.is_income} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="date" className="form-label">Date</label>
                            <input type="text" className="form-control" id="date" name="date" onChange={handleInputChange} value={formData.date} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateTransaction;

