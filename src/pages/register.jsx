import React, { useState } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBAlert } from 'mdbreact';
import { connect } from 'react-redux'
import { RegisterUser, errormessageclear } from './../redux/actions'
import { Redirect,Link } from 'react-router-dom'

const Register = (props) => {
    const [data, setdata] = useState({
        username: '',
        email: '',
        password: '',
        confirmpassword: ''
    })

    const dataOnChange = (e) => {
        console.log(e.target)
        setdata({ ...data, [e.target.name]: e.target.value })
    }

    const onFormSubmit = (e) => {
        e.preventDefault()
        props.RegisterUser(data)
    }

    if (props.islogin) {//supaya tidak bisa ke halaman register sesudah login
        return <Redirect to='/' />
    }

    return (
        <MDBContainer>
            <MDBRow className='d-flex justify-content-center align-items-center' style={{ height: '105vh' }}>
                <MDBCol md="5">
                    <form className='mt-5' onSubmit={onFormSubmit}>
                        <p className="h3 text-center mb-4">Sign up</p>
                        <div className="purple-text">
                            <MDBInput
                                label="Your username"
                                name="username"
                                value={data.username}
                                onChange={dataOnChange}
                                icon="user"
                                group type="text"
                                validate error="wrong"
                                success="right" />
                            <MDBInput
                                label="Your email"
                                name="email"
                                value={data.email}
                                onChange={dataOnChange}
                                icon="envelope"
                                group type="email"
                                validate error="wrong"
                                success="right" />
                            <MDBInput
                                label="Your password"
                                name="password"
                                value={data.password}
                                onChange={dataOnChange}
                                icon="lock"
                                group type="password"
                                validate />
                            <MDBInput
                                label="Confirm your password"
                                name="confirmpassword"
                                value={data.confirmpassword}
                                onChange={dataOnChange}
                                icon="exclamation-triangle"
                                group type="password"
                                validate error="wrong"
                                success="right" />
                        </div>
                        {
                            props.errormes ?
                                <MDBAlert color='danger'>
                                    {props.errormes}
                                    <span className='float-right hovererr font-weight-bold' onClick={() => props.errormessageclear()}>x</span>
                                </MDBAlert>
                                :
                                null
                        }
                        {
                            props.successmes ?
                                <MDBAlert color='success'>
                                    {props.successmes}                                        
                                        <span className='float-right hovererr font-weight-bold'><Link to='/login'>x</Link></span>
                                </MDBAlert>
                                :
                                null
                        }
                        <div className="text-center">
                            <MDBBtn type='submit' color="primary">Register</MDBBtn>
                        </div>
                    </form>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    )
}

const MapstatetoProps = (state) => {
    return state.Auth
}

export default connect(MapstatetoProps, { RegisterUser, errormessageclear })(Register);