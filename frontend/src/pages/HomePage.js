import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';  

function HomePage() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/forms')
      .then(response => setForms(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/forms/${id}`)
      .then(() => {
        setForms(forms.filter(form => form._id !== id));
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="home-page">
      <h1>Welcome to Form.com</h1>
      <p>This is a simple form builder.</p>
      <Link to="/form/create" className="create-form-button">
        Create New Form
      </Link>
      <hr className="horizontal-line" />
      <h2>Forms</h2>
      <div className="forms-container">
        {forms.map(form => (
          <div key={form._id} className="form-card">
            <h3>{form.title}</h3>
            <div className="form-actions">
              <Link to={`/form/${form._id}`} className="view-link">View</Link>
              <Link to={`/form/${form._id}/edit`} className="edit-link">Edit</Link>
              <button onClick={() => handleDelete(form._id)} className="delete-button">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
