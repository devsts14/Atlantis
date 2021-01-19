import React from 'react'
import {Select} from 'antd'
const {Option}=Select

const ProductCreateForm = ({handleSubmit,handleChange,values,handleCategoryChange,subOptions,showSub,setValues}) => {
  const {title,description,price,category,subs,shipping,images,quantity,categories}=values;

  return (
    <form className="product-create-form" onSubmit={handleSubmit}>
    <input type="text" name="title" placeholder="title" value={title} onChange={handleChange}/>
    <input type="text" name="description" placeholder="description" value={description} onChange={handleChange}/>
    
    <input min='0' type="number" name="price" placeholder="price" value={price} onChange={handleChange}/>
    <label>
    Shipping
    <select name="shipping" onChange={handleChange}>
    <option className="green" value="Yes">Yes</option>
    <option className="red" value="No">No</option>
    </select>
    </label>

<label>
Category
    <select name="category" onChange={handleCategoryChange}>
    <option>Select one</option>
    {categories.map((c)=>(
      <option value={c._id} key={c._id}>{c.name}</option>
    ))}
    </select>
    </label>
{showSub &&<div className="subcat-list">
<label>Sub Categories
<Select style={{width:'100%'}}  onChange={value=> setValues({...values,subs: value})} value={subs} mode="multiple" placeholder="Please select subcategories..">
{subOptions.length && subOptions.map((s)=>(
  <Option key={s._id} value={s._id}>{s.name}</Option>

))}
</Select>
</label>
</div>    }
    <input min='0' type="number" name="quantity" onChange={handleChange} placeholder="quantity" value={quantity}/>
     <button className="submit-btn" type="submit">Save</button>
        </form>
  )
}

export default ProductCreateForm
