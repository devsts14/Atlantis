import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const Search = () => {
  let dispatch = useDispatch();
  let history = useHistory();
  const { search } = useSelector((state) => ({ ...state }));
  const { text } = search;
  const redirectFocus = () => {
    history.push('/search');
  };

  const handleChange = (e) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: e.target.value },
    });
  };
  // const handleSubmit=(e)=>{

  // }
  return (
    <div className='nav-center'>
      <div style={{ position: 'relative' }}>
        <i className='fas fa-search search-icon'></i>
        <input
          onChange={handleChange}
          value={text}
          onFocus={redirectFocus}
          type='search'
          placeholder='Search'
        />
      </div>
    </div>
  );
};

export default Search;
