import React from 'react'

const LocalSearch = ({keyword,setKeyword}) => {
  return (
    <div className="search-inp-div">
  <input autoFocus className="localSearchInput" type="search"  placeholder="Search.." value={keyword} onChange={(e)=>setKeyword(e.target.value.toLowerCase())}/>
  <hr style={{marginBottom:'1rem'}}/>
  </div>
  )
  
}

export default LocalSearch
