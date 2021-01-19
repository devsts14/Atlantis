import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const CategoryDropdown = ({ c, subs, handleRemove }) => {
  const [collapse, setCollapse] = useState(false);

  const toggleCollapse = () => {
    setCollapse(!collapse);
  };
  return (
    <div className='grid-1'>
      <div className="element-1">
        <h3 style={{cursor:"pointer"}} onClick={toggleCollapse}>
          {c.name}{' '}
          {subs.filter((s) => s.parent === c._id).length > 0 && (
            <i
              style={{ transition: 'all 0.5s' }}
              class={
                collapse ? 'fas fa-chevron-down rotate' : 'fas fa-chevron-down '
              }
            ></i>
          )}
        </h3>
        {console.log(subs.filter((s) => s.parent === c._id).length > 0)}
        {subs
          .filter((s) => s.parent === c._id)
          .map((p) => (
            <div
              className={
                collapse && subs.filter((s) => s.parent === c._id).length > 0
                  ? 'collapse show'
                  : 'collapse'
              }
            >
              <div className="collapse-element">
                <span>{p.name}</span>
                <span style={{cursor:"pointer"}} onClick={() => handleRemove(p.slug)}><i class="far fa-trash-alt"></i></span>
                <Link to={`/admin/sub/${p.slug}`}><i class="far fa-edit"></i></Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;
