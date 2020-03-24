import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import Login from './pages/login'
import Register from './pages/register'
import Header from './components/header'
import Home from './pages/home'
import { Switch, Route } from 'react-router-dom'
import Axios from 'axios'
import { API_URL } from './supports/ApiUrl';
import { KeepLogin,TotalQty } from './redux/actions';
import { connect } from 'react-redux'
import ManageAdmin from './pages/manageadmin'
import ManageOrder from './pages/manageorder'
import NotFound from './pages/notfound'
import ProductDetail from './pages/productdetail'
import Cart from './pages/Cart'
import Search from './pages/search'
import filter from './pages/filter'
import UserSetting from './pages/usersetting'
import StatusOrder from './pages/statusorder'

function App({ KeepLogin,TotalQty }) {

  const [Loading, setLoading] = useState(true)
  // const [totalcart, settotalcart] = useState([])

  useEffect(() => {
    var id = localStorage.getItem('iduser')
    if (id) {
      Axios.get(`${API_URL}/users/${id}`)
        .then(res => {
          KeepLogin(res.data)
          // Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${id}&status=oncart`)
          //   .then((res1) => {
          //     // console.log(res.data[0].transactiondetails.length)
          //     var cart=res1.data[0].transactiondetails.length
          //     settotalcart(cart)
          //     console.log(cart)
          //     // var totalcarttotalcart
          //     TotalQty(cart)
              
          //   })
        }).catch((err) => {
          console.log(err)
        }).finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  if (Loading) {
    return <div>loading...</div>
  }
  return (
    <div>
      <Header />
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/login' exact component={Login} />
        <Route path='/register' exact component={Register} />
        <Route path='/manageadmin' exact component={ManageAdmin} />
        <Route path='/manageorder' exact component={ManageOrder} />
        <Route path='/productdetail/:idprod' exact component={ProductDetail} />
        <Route path='/cart' exact component={Cart} />
        <Route path='/search' exact component={Search} />
        <Route path='/filter' exact component={filter} />
        <Route path='/usersetting' exact component={UserSetting} />
        <Route path='/statusorder' exact component={StatusOrder} />
        <Route path='/*' component={NotFound} />
      </Switch>
    </div>
  );
}

const MapstatetoProps = (state) => {
  return {
    User: state.Auth,
    Header: state.Header.ishome,
    Cart:state.Cart.totalqty
  }
}

export default connect(MapstatetoProps, { KeepLogin,TotalQty })(App);

//json-server -p 2000 db.json
