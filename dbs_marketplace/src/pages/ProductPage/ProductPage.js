import React, {useEffect, useState} from 'react'
import axios from 'axios'
import "./ProductPage.css"
import {mockProductData} from "../../data"
import { Link } from 'react-router-dom'

export default function ProductPage() {

    const [data, setData] = useState(mockProductData)
    const [orderQty, setOrderQty] = useState({})

    // get prouct data from api
    useEffect(() => {
        axios.get(`http://localhost:4000/product`, {
            withCredentials: true
        }).then(res => {
            console.log(res.data)
            setData(res.data)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const handleAddToCart = () => {

        const {customer_id=1, item_id, item_qty} = orderQty;

        axios.post(`http://localhost:4000/add`, {
            customerid: customer_id,
            productid: item_id,
            qty: parseInt(item_qty),
        },
        {
            withCredentials: true
        }).then( res => {
            console.log(res.data);
        }).catch( err => {
            console.log(err)
        });
    }

    console.log(orderQty)

    

    return (
        <div>
            <div style={{display:"grid", placeItems:"end"}}>
                <Link to="/cart">
                    <button style={{width:"100px"}}>Continue to cart</button>
                </Link>
            </div>
            <div>
                <table>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Qty Available</th>
                        <th>Order Qty</th>
                        <th>Add to cart</th>
                    </tr>
                    {data && data
                    .map( (item, idx) => {
                        return (
                            <tr key={item.id}>
                                <td><img height={'100px'} alt='item-img' src={item.image}/></td>
                                <td>{item.title}</td>
                                <td>{item.price}</td>
                                <td>{item.qty}</td>
                                <td><input style={{width: '50%'}} onChange={(e) => setOrderQty({...orderQty, "item_id":item.id, "item_qty":e.target.value})}/></td>
                                <td><button onClick={() => handleAddToCart(orderQty)}>Add</button></td>
                            </tr>
                        )
                    })}
                </table>    
            </div>
        </div>
    )
}
