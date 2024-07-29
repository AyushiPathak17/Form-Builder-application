import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditFormPage.css'; 

function EditFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [inputs, setInputs] = useState([]);
  const [showInputButtons, setShowInputButtons] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingInputIndex, setEditingInputIndex] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/forms/${id}`)
      .then(response => {
        setTitle(response.data.title);
        setInputs(response.data.inputs);
      })
      .catch(error => console.error(error));
  }, [id]);

  const handleAddInput = (type) => {
    setInputs([...inputs, { type, title: '', placeholder: '' }]);
    setShowInputButtons(false);
  };

  const handleInputChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const handleDeleteInput = (index) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    axios.patch(`http://localhost:5000/api/forms/${id}`, { title, inputs })
      .then(response => navigate('/'))
      .catch(error => console.error(error));
  };

  return (
    <div className="create-form-page">
      <h1>Edit Form</h1>
      <div className="form-container">
        {/* Left Segment */}
        <div className="left-segment">
          <div className="form-title">
            {editingTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                className="title-input"
              />
            ) : (
              <span>{title}</span>
            )}
            <button onClick={() => setEditingTitle(!editingTitle)} className="edit-button">
              ✎
            </button>
          </div>
          <button onClick={() => setShowInputButtons(!showInputButtons)} className="add-input-button">
            {showInputButtons ? 'Close Input Buttons' : 'Add Input'}
          </button>
          {showInputButtons && (
            <div className="input-buttons">
              <button onClick={() => handleAddInput('text')} className="input-type-button">Text</button>
              <button onClick={() => handleAddInput('email')} className="input-type-button">Email</button>
              <button onClick={() => handleAddInput('password')} className="input-type-button">Password</button>
              <button onClick={() => handleAddInput('number')} className="input-type-button">Number</button>
              <button onClick={() => handleAddInput('date')} className="input-type-button">Date</button>
            </div>
          )}
          <div className="inputs-grid">
            {inputs.map((input, index) => (
              <div key={index} className="input-box">
                <span>{input.title || 'Untitled Input'}</span>
                <div>
                  <button onClick={() => setEditingInputIndex(index)} className="edit-button">✎</button>
                  <button onClick={() => handleDeleteInput(index)} className="delete-button">🗑</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Right Segment */}
        <div className="right-segment">
          <h2>Form Editor</h2>
          {editingInputIndex !== null && (
            <div className="input-editor">
              <input
                type="text"
                value={inputs[editingInputIndex].title}
                onChange={(e) => handleInputChange(editingInputIndex, 'title', e.target.value)}
                placeholder="Input Title"
                className="title-input"
              />
              <input
                type="text"
                value={inputs[editingInputIndex].placeholder}
                onChange={(e) => handleInputChange(editingInputIndex, 'placeholder', e.target.value)}
                placeholder="Placeholder"
                className="title-input"
              />
              <button onClick={() => setEditingInputIndex(null)} className="save-button">Save</button>
            </div>
          )}
        </div>
      </div>
      <button onClick={handleSubmit} className="save-button">Save Form</button>
    </div>
  );
}

export default EditFormPage;
