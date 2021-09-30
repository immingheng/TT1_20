import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { 
  ProductPage ,
  LoginPage,
  CartPage ,
  SuccessPage
} from "./pages"

function App() {
  return (
    <div className='container'>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={LoginPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/product" component={ProductPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/success"  component={SuccessPage} />
        </Switch>
      </BrowserRouter>
      {/* <Component /> */}
    </div>

    
  )
}

export default App
