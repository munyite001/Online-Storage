const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; // Check if token exists
};

export default isAuthenticated;