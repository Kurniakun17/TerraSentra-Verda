import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-tertiary-light">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-tertiary mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page not found</p>
                <Link
                    to="/"
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-tertiary transition"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
