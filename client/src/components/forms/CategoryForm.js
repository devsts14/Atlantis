import React from 'react';

const CategoryForm = ({ handleSubmit, name, setName,placeholder }) => (
  <form className="category-form" onSubmit={handleSubmit}>
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      autoFocus
      required
      type='text'
      placeholder={placeholder}
    />
    <button className="submit-btn" type='submit'>Save</button>
  </form>
);

export default CategoryForm;
