import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditFormPage.css'; 

function CreateFormPage() {
  const [title, setTitle] = useState('Untitled Form');
  const [editingTitle, setEditingTitle] = useState(false);
  const [inputs, setInputs] = useState([]);
  const [currentInputIndex, setCurrentInputIndex] = useState(null);
  const [showInputButtons, setShowInputButtons] = useState(false);
  const navigate = useNavigate();

  const handleAddInput = (type) => {
    const newInput = { type, title: '', placeholder: '' };
    setInputs([...inputs, newInput]);
    setCurrentInputIndex(inputs.length);
    setShowInputButtons(false);
  };

  const handleInputChange = (field, value) => {
    const newInputs = [...inputs];
    newInputs[currentInputIndex][field] = value;
    setInputs(newInputs);
  };

  const handleDeleteInput = (index) => {
    setInputs(inputs.filter((_, i) => i !== index));
    if (currentInputIndex === index) setCurrentInputIndex(null);
  };

  const handleSubmit = () => {
    axios.post('http://localhost:5000/api/forms', { title, inputs })
      .then(response => {
        console.log(response.data); 
        navigate('/');
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="create-form-page">
      <h1>Create New Form</h1>
      <div className="form-container">
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
              <button onClick={() => handleAddInput('number')} className="input-type-button">Number</button>
              <button onClick={() => handleAddInput('email')} className="input-type-button">Email</button>
              <button onClick={() => handleAddInput('password')} className="input-type-button">Password</button>
              <button onClick={() => handleAddInput('date')} className="input-type-button">Date</button>
            </div>
          )}
          <div className="inputs-grid">
            {inputs.map((input, index) => (
              <div key={index} className="input-box">
                <span>{input.title || 'Untitled'}</span>
                <button onClick={() => setCurrentInputIndex(index)} className="edit-button">✎</button>
                <button onClick={() => handleDeleteInput(index)} className="delete-button">🗑</button>
              </div>
            ))}
          </div>
          <button onClick={handleSubmit} className="save-button">Create Form</button>
        </div>
        <div className="right-segment">
          <h2>Form Editor</h2>
          {editingTitle && (
            <div className="form-editor">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Form Title"
                className="title-input"
              />
            </div>
          )}
          {currentInputIndex !== null && (
            <div className="input-editor">
              <input
                type="text"
                value={inputs[currentInputIndex].title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Input Title"
                className="title-input"
              />
              <input
                type="text"
                value={inputs[currentInputIndex].placeholder}
                onChange={(e) => handleInputChange('placeholder', e.target.value)}
                placeholder="Placeholder"
                className="title-input"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateFormPage;
