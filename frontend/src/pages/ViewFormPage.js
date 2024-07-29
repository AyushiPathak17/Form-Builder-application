import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewFormPage.css';

function ViewFormPage() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/forms/${id}`)
      .then(response => {
        setForm(response.data);
        const initialData = response.data.inputs.reduce((acc, input) => {
          acc[input.title] = '';
          return acc;
        }, {});
        setFormData(initialData);
      })
      .catch(error => console.error(error));
  }, [id]);

  const handleInputChange = (title, value) => {
    setFormData({ ...formData, [title]: value });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className="view-form-page">
      <h1>{form.title}</h1>
      <div className="form-container">
        <form>
          {form.inputs.map((input, index) => (
            <div key={index} className="form-input">
              <label>{input.title}</label>
              <input
                type={input.type}
                placeholder={input.placeholder}
                value={formData[input.title]}
                onChange={(e) => handleInputChange(input.title, e.target.value)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleSubmit} className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default ViewFormPage;
