import React from 'react'
import Component from './components'
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { 
  ProductPage ,
  HomePage,
  LoginPage,
  CartPage ,
  SuccessPage
} from "./pages"

function App() {
  return (
    <div className='container'>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/product" component={ProductPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/success"  component={SuccessPage} />
        </Switch>
      </BrowserRouter>



      <ProductPage />
      {/* <Component /> */}
    </div>

    
  )
}

export default App
