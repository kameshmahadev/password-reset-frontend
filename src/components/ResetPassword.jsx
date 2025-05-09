import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const token = "9b6a9e8824ed33fa6a7e7a7320018428559a8fcb93dd46b9eddc8d7bd7641a8d";

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic client-side validation
        if (!newPassword || !confirmPassword) {
            setError('Please enter both new password and confirm password.');
            setMessage('');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            setMessage('');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long.');
            setMessage('');
            return;
        }

        try {
            // Backend API call to reset password
            const response = await axios.post(
                `http://localhost:5000/api/auth/reset-password/${token}`, // Ensure this matches your backend route
                { password: newPassword }, //  Send the new password in the request body
                {
                    headers: {
                        'Content-Type': 'application/json', // Explicitly set content type
                    },
                }
            );

            // Handle successful password reset
            if (response.status === 200) {
                setMessage(response.data.message);
                setError('');
                //  Consider redirecting to login page after successful reset
                setTimeout(() => {
                   // window.location.href = '/login';  //removed window.location
                }, 2000);
            } else {
                // Handle unexpected success responses (if any)
                setError('Password reset was not successful.');
                setMessage('');
            }

        } catch (error) {
            // Handle errors from the backend
            if (error.response) {
                // The server responded with an error status code
                setError(error.response.data.message || 'Password reset failed.');
                setMessage('');
            } else if (error.request) {
                // The request was made but no response was received
                setError('No response from the server. Please check your network connection.');
                setMessage('');
            } else {
                // Something happened in setting up the request that triggered an Error
                setError('An error occurred while processing your request.');
                setMessage('');
            }
            console.error("Error resetting password:", error); // Log the error for debugging
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <h2 className="mb-4">Reset Password</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="newPassword" className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8} // Add client-side validation
                    />
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8} // Add client-side validation
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Reset Password
                </Button>
            </Form>
        </div>
    );
};

export default ResetPassword;
