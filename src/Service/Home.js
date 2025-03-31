import React, { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useBucket } from '../Repository/BucketContext';
import { useBucketItemFilters } from './Filters';
import './Repo.css';

export default function Home() {
  const bucketRepo = useBucket();
  const {
    items: filteredItems,
    categoryFilter,
    setCategoryFilter,
    visitedFilter,
    setVisitedFilter,
    sortConfig,
    requestSort,
    setItems
  } = useBucketItemFilters([]);

  useEffect(() => {
    setItems(bucketRepo.getItems());
  }, [bucketRepo, setItems]);

  const handleVisitedChange = (itemId) => {
    const updatedItem = bucketRepo.updateVisited(itemId);
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? updatedItem : item
      )
    );
  };

  const getStatistics = () => {
    if (filteredItems.length === 0) return {};
    
    const visitedCount = filteredItems.filter(item => item.visited).length;
    const notVisitedCount = filteredItems.length - visitedCount;
    
    const categoryCounts = {};
    filteredItems.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });
    const mostCommonCategory = Object.keys(categoryCounts).reduce((a, b) => 
      categoryCounts[a] > categoryCounts[b] ? a : b, 'None');

    return {
      totalItems: filteredItems.length,
      visitedCount,
      notVisitedCount,
      mostCommonCategory,
    };
  };

  const stats = getStatistics();

  const getHighlightClass = (item) => {
    if (item.category === stats.mostCommonCategory) {
      return 'highlight-common';
    }
    return '';
  };

  let navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="home">
      <div className="page-container">
        <header className="header">
          <h1>DreamStack</h1>
          <nav className='nav'>
            <button 
              className={`b1 ${location.pathname === '/' ? 'active-nav' : ''}`}
              onClick={() => navigate('/')}
            >
              <i className="bi bi-house-door"></i>
            </button>
            <button 
              className={`b2 ${location.pathname === '/add' ? 'active-nav' : ''}`}
              onClick={() => navigate('/add')}
            >
              <i className="bi bi-plus-lg"></i>
            </button>
            <button 
              className={`b3 ${location.pathname === '/edit' ? 'active-nav' : ''}`}
              onClick={() => navigate('/edit')}
            >
              <i className="bi bi-pencil-square"></i>
            </button>
          </nav>
        </header>
        <h5 className="tagline">Save it. Plan it. Live it.</h5>

        <div className="stats-summary">
          <div className="stat-card">
            <h3>Total Items</h3>
            <p>{stats.totalItems}</p>
          </div>
          <div className="stat-card">
            <h3>Visited</h3>
            <p>{stats.visitedCount}</p>
          </div>
          <div className="stat-card">
            <h3>Not Visited</h3>
            <p>{stats.notVisitedCount}</p>
          </div>
          <div className="stat-card">
            <h3>Top Category</h3>
            <p>{stats.mostCommonCategory}</p>
          </div>
        </div>

        <div className="filter-dropdowns">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="Historical">Historical</option>
            <option value="Natural">Natural</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Religious">Religious</option>
            <option value="Educational">Educational</option>
            <option value="Other">Other</option>
          </select>

          <select 
            value={visitedFilter ?? ''} 
            onChange={(e) => setVisitedFilter(e.target.value === '' ? null : e.target.value === 'true')}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="true">Visited</option>
            <option value="false">Not Visited</option>
          </select>
        </div>

        <div className="body">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('name')}>
                  Place {sortConfig.key === 'name' && (sortConfig.ascending ? '▵' : '▿')}
                </th>
                <th onClick={() => requestSort('country')}>
                  Country {sortConfig.key === 'country' && (sortConfig.ascending ? '▵' : '▿')}
                </th>
                <th onClick={() => requestSort('city')}>
                  City {sortConfig.key === 'city' && (sortConfig.ascending ? '▵' : '▿')}
                </th>
                <th onClick={() => requestSort('category')}>
                  Category {sortConfig.key === 'category' && (sortConfig.ascending ? '▵' : '▿')}
                </th>
                <th>Description</th>
                <th onClick={() => requestSort('visited')}>
                  Visited {sortConfig.key === 'visited' && (sortConfig.ascending ? '▵' : '▿')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.country}</td>
                  <td>{item.city}</td>
                  <td className={getHighlightClass(item)}>
                    {item.category}
                    {item.category === stats.mostCommonCategory && (
                      <span className="common-tag">Most Common</span>
                    )}
                  </td>
                  <td>{item.description}</td>
                  <td>
                    <input
                      type="checkbox"
                      className="check-mark"
                      checked={item.visited}
                      onChange={() => handleVisitedChange(item.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}