import React, { Component, Fragment } from "react";
import {
  MDBNavbar, MDBNavbarNav, MDBNavItem, MDBNavbarToggler, MDBCollapse,
  MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBNavLink, MDBFormInline, MDBBtn
} from "mdbreact";
import { connect } from 'react-redux'
import { FaPlaystation } from 'react-icons/fa'
import { FiShoppingCart } from 'react-icons/fi'
import Axios from 'axios'
import { API_URL } from './../supports/ApiUrl'
import { BukanHome, IniHome, searchitem, TotalQty } from './../redux/actions'

class NavbarPage extends Component {
  state = {
    isOpen: false,
    search: ''
  };

  componentDidMount() {
    Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${this.props.User.id}&status=oncart`)
      .then((res) => {
        // console.log(res.data[0].transactiondetails.length)
        var totalcart = res.data[0].transactiondetails.length
        // this.setState({totalcart:res.data[0].transactiondetails.length})
        this.props.TotalQty(totalcart)
      }).catch((err) => {
        console.log(err)
      })
  }

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  searchOnChange = (e) => {
    console.log(e.target)
    this.setState({ [e.target.name]: e.target.value })
  }

  onFormSubmit = (e) => {
    // e.preventDefault()
    this.props.searchitem(this.state.search)
    this.setState({ search: '' })
  }

  logout = () => {
    localStorage.clear()
  }

  render() {
    console.log(this.props.Header)
    return (
      <MDBNavbar color='heavy-rain-gradient' transparent={this.props.Header} scrolling fixed='top' expand="md">
        <MDBNavLink to='/'>
          <img src="./image/ps-store-bag.svg" alt='logops' width='26' height='32'></img>&nbsp;&nbsp;
          <img src="./image/ps-store-text.svg" alt='logops' width='130' height='19' className='justify-content-center'></img>
        </MDBNavLink>
        <MDBNavbarToggler onClick={this.toggleCollapse} />
        <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
          <MDBNavbarNav right className='mr-5'>
            <MDBNavItem>
              <MDBFormInline className="md-form mr-auto m-0" onClick={this.onFormSubmit}>
                <input className="form-control mr-sm-2" type="text" onChange={this.searchOnChange} value={this.state.search} name='search' placeholder="Search" aria-label="Search" />
                <MDBNavLink to='/search'>
                  <MDBBtn outline color="orange" size="sm" type="submit" className="mr-5" >
                    Search
                  </MDBBtn>
                </MDBNavLink>
              </MDBFormInline>
            </MDBNavItem>
            <MDBNavItem className='mt-2'>
              {
                this.props.User.role === 'admin' ?
                  <MDBNavLink to='/manageadmin'>
                    <strong className="deep-orange-text">Manage Admin</strong>
                  </MDBNavLink>
                  :
                  null
              }
            </MDBNavItem>
            <MDBNavItem className='mt-1'>
              {
                this.props.User.role === 'user' ?
                  <MDBNavLink to='/cart'>
                    {
                      this.props.Cart.totalqty === 0 ?
                        null
                        :
                        <button className=' circle'>{this.props.Cart.totalqty}</button>
                    }
                    <FiShoppingCart size='34' color='darkblue' className='mr-2 justify-content-center' />
                    <strong className='deep-orange-text '>Cart</strong>
                  </MDBNavLink>
                  :
                  null
              }
            </MDBNavItem>
            <MDBNavItem className='mt-2'>
              {
                this.props.User.islogin ?
                  null
                  :
                  <MDBNavLink to='/login'>
                    <strong className="deep-orange-text">Login</strong>
                  </MDBNavLink>
              }
            </MDBNavItem>
            <MDBNavItem>

            </MDBNavItem>
            <MDBNavItem>
              {
                this.props.User.username ?
                  <MDBDropdown className='mt-1'>
                    <MDBDropdownToggle nav caret className='warnanav'>
                      <FaPlaystation size='32' color='darkblue' className=' mr-2 justify-content-center' />
                      <strong className='deep-orange-text'>Hallo, {this.props.User.username}</strong>
                    </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      {
                        this.props.User.role === 'admin' ?
                          <MDBDropdownItem>
                            <div style={{ margin: '-5px 0px -5px -22px' }}>
                              <MDBNavLink className='deep-orange-text' to="/manageorder"><strong>Manage Order</strong></MDBNavLink>
                            </div>
                          </MDBDropdownItem>
                          :
                          null
                      }
                      {
                        this.props.User.role === 'user' ?
                          <Fragment>
                            <MDBDropdownItem>
                              <div style={{ margin: '-5px 0px -5px -22px' }}>
                                <MDBNavLink className='deep-orange-text' to="/statusorder"><strong>Order Status</strong></MDBNavLink>
                              </div>
                            </MDBDropdownItem>
                            <MDBDropdownItem>
                              <div style={{ margin: '-5px 0px -5px -22px' }} >
                                <MDBNavLink className='deep-orange-text' to="/usersetting"><strong>User Setting</strong></MDBNavLink>
                              </div>
                            </MDBDropdownItem>
                          </Fragment>
                          :
                          null
                      }
                      <MDBDropdownItem className='deep-orange-text' href="/" onClick={this.logout}><strong>Logout</strong></MDBDropdownItem>
                    </MDBDropdownMenu>
                  </MDBDropdown>
                  :
                  null
              }
            </MDBNavItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBNavbar>
    );
  }
}

const MapstatetoProps = (state) => {
  return {
    User: state.Auth,
    Header: state.Header.ishome,
    Cart: state.Cart
  }
}

export default connect(MapstatetoProps, { IniHome, BukanHome, searchitem, TotalQty })(NavbarPage);