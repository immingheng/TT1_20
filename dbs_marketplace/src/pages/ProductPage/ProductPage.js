import React, {useEffect, useState} from 'react'
import axios from 'axios'
import "./ProductPage.css"
import {mockProductData} from "../../data"

export default function ProductPage() {

    const [data, setData] = useState(mockProductData)

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

    return (
        <div>
            <div>
                <table>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Qty Available</th>
                        <th>Add to cart</th>
                    </tr>
                    {data && data
                    .map( item => {
                        return (
                            <tr>
                                <td><img height={'100px'} alt='item-img' src={item.image}/></td>
                                <td>{item.title}</td>
                                <td>{item.price}</td>
                                <td>{item.qty}</td>
                                <td><button onClick={(e) => {console.log(e)}}>Add</button></td>
                            </tr>
                        )
                    })}
                </table>    
            </div>
        </div>
    )
}
