import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';

const AuthWrapper = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Set the current page based on the route
    if (location.pathname === '/signup') {
      setCurrentPage('signup');
    } else {
      setCurrentPage('login');
    }
  }, [location.pathname]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Navigate to the appropriate route
    if (page === 'signup') {
      navigate('/signup');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {currentPage === 'login' ? (
          <Login setCurrentPage={handlePageChange} />
        ) : (
          <SignUp setCurrentPage={handlePageChange} />
        )}
      </div>
    </div>
  );
};

export default AuthWrapper;
