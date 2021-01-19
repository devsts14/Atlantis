import React from 'react'
import {Select} from 'antd'
const {Option}=Select

const ProductUpdateForm = ({handleSubmit,handleChange,values,setValues,handleCategoryChange,categories,subOptions,arrayOfSubIds,setArrayOfSubIds,selectedCategory}) => {
  const {title,description,price,category,subs,shipping,images,quantity}=values;

  return (
    <form className="product-create-form" onSubmit={handleSubmit}>
    <input type="text" name="title" placeholder="title" value={title} onChange={handleChange}/>
    <input type="text" name="description" placeholder="description" value={description} onChange={handleChange}/>
    <input type="number" name="price" placeholder="price" value={price} onChange={handleChange}/>
    <label>Shipping
    <select value={shipping ==='Yes'?'Yes':"No"} name="shipping" onChange={handleChange}>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
    </select>
    </label>
<label>Category
    <select value={selectedCategory?selectedCategory:category._id} name="category" onChange={handleCategoryChange}>
    {categories.map((c)=>(
      <option value={c._id} key={c._id}>{c.name}</option>
    ))}
    </select>
    </label>
    <div className="subcat-list">
<label>Sub Categories
<Select style={{width:'100%'}} value={arrayOfSubIds}  onChange={value=> setArrayOfSubIds(value)}  mode="multiple" placeholder="Please select">
{subOptions.length && subOptions.map((s)=>(
  <Option key={s._id} value={s._id}>{s.name}</Option>

))}
</Select>
</label>
</div> 

    <input type="number" name="quantity" onChange={handleChange} placeholder="quantity" value={quantity}/>
     <button className="submit-btn" type="submit">Save</button>
        </form>
  )
}

export default ProductUpdateForm
