import React, {useEffect, useState} from 'react'
import axios from 'axios'
import "./CartPage.css";
import { Link } from 'react-router-dom';

export default function CartPage(props) {

    
    const [cartItems, setCartData] = useState();
    const [totalCartPrice, setTotalCartPrice] = useState();

    const getGrandTotal = () => {
        axios.get(`http://localhost:4000/getgrandtotal/${1}`, {
            withCredentials: true
        }).then(res => {
            const { sum } = res.data;

            setTotalCartPrice(sum)
        }).catch(err => {
            console.log(err)
        })
    }
    useEffect(() => {
        axios.get(`http://localhost:4000/orderitem`, {
            withCredentials: true
        }).then(res => {
            getGrandTotal();
            setCartData(res.data);
            
        }).catch(err => {
            console.log(err)
        })
    },[])


    

    return (
        <>
        <div style={{display:"flex", justifyContent:"space-between"}}>
            <Link to="/product">
                <button style={{width:"100px"}}>Back</button>
            </Link>
            <Link to="/success">
                <button style={{width:"100px"}}>Checkout</button>
            </Link>
        </div>
        <h2>Your Cart</h2>
        <div style={{display:"grid", placeItems:"center", margin:"44px"}}>
            <table>
                <tr>
                    <th>
                        Order ID
                    </th>
                    <th>
                        Product Qty
                    </th>
                    <th>
                        Subtotal
                    </th>
                </tr>   
            {cartItems && cartItems
            .map( (item, idx) => {
                return (
                    <tr key={idx}>
                        <td>{item.product_id}</td>
                        <td>{item.product_qty}</td>
                        <td>{item.total_price}</td>
                    </tr>
                )
            })}
            </table>

                    


        </div>
        <h3>Grand total: {totalCartPrice}</h3>

        </>
    );
}
