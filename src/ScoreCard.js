import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Scorecard.css'; // Custom styles

const Scorecard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for search inputs
  const [emailSearch, setEmailSearch] = useState('');
  const [moduleSearch, setModuleSearch] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set the number of items per page

  useEffect(() => {
    // Fetch data on component mount
    const fetchData = async () => {
      try {
        const response = await axios.post('https://coca-cola-backend.onrender.com/api/getUserScore');
        setData(response.data.user);
        setFilteredData(response.data.user); // Initialize filtered data
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    // Filter data based on emailSearch and moduleSearch
    const filtered = data.filter(item => {
      const matchesEmail = item.email.toLowerCase().includes(emailSearch.toLowerCase());
      const matchesModule = item.module.toLowerCase().includes(moduleSearch.toLowerCase());
      return matchesEmail && matchesModule;
    });
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page when search is applied
  };

  const handleClear = () => {
    // Clear search fields and show all data again
    setEmailSearch('');
    setModuleSearch('');
    setFilteredData(data);
    setCurrentPage(1); // Reset to the first page when cleared
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="scorecard-container">
      <h1 className="scorecard-title">Coca-Cola Scorecard</h1>

      {/* Search Fields */}
      <div className="search-container">
        <div className="search-field">
          <input
            type="text"
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
            placeholder="Search by email..."
            className="search-input"
          />
        </div>
        <div className="search-field">
          <input
            type="text"
            value={moduleSearch}
            onChange={(e) => setModuleSearch(e.target.value)}
            placeholder="Search by module..."
            className="search-input"
          />
        </div>
        <div className="button-container">
          <button onClick={handleSearch} className="search-button">Search</button>
          <button onClick={handleClear} className="clear-button">Clear</button>
        </div>
      </div>

      {/* Table */}
      <table className="scorecard-table">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Email</th>
            <th>Module</th>
            <th>Score</th>
            <th>Percentage</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={index} className="table-row">
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{item.email}</td>
              <td>{item.module}</td>
              <td>{item.score}</td>
              <td>{item.percentage}%</td>
              <td>{new Date(item.createdAt).toUTCString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination-container">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Prev
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Scorecard;