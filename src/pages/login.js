import React, { useState } from "react";
import { MDBAlert, MDBInput, MDBBtn } from 'mdbreact';
import { connect } from 'react-redux'
import { LoginUser, errormessageclear } from './../redux/actions'
import { Redirect, Link } from 'react-router-dom'

const Login = (props) => {
    const [data, setdata] = useState({
        username: '',
        password: ''
    })

    const dataOnChange = (e) => {
        console.log(e.target)
        setdata({ ...data, [e.target.name]: e.target.value })
    }

    const onFormSubmit = (e) => {
        e.preventDefault()
        props.LoginUser(data)
        setTimeout(function() {window.location.reload()},100)
    }
    if (props.islogin) {
        return <Redirect to='/' />
    }

    return (
        <div>
            <div className='d-flex justify-content-center align-items-center' style={{ height: '90vh' }}>
                <form className='mt-5' style={{ width: '30%' }} onSubmit={onFormSubmit}>
                    <p className="h3 text-center mt-3">Sign in</p>
                    <div className="purple-text">
                        <MDBInput
                            label="Type your username"
                            name='username'
                            onChange={dataOnChange}
                            icon="user"
                            group type="text"
                            validate
                            error='dsada'
                            value={data.username}
                        />
                        <MDBInput label="Type your password" name='password' onChange={dataOnChange} icon="lock" group type="password" validate value={data.password} />
                    </div>
                    {
                        props.errormes?
                            <MDBAlert color='danger'>
                                {props.errormes}
                                <span className='float-right hovererr font-weight-bold' onClick={() => props.errormessageclear()}>x</span>
                            </MDBAlert>
                            :
                            null
                    }
                    <div className="text-center">
                        <MDBBtn type='submit' disabled={props.loading}>Login</MDBBtn>
                        <hr/>
                        <p>Belum ada akun?<br/><Link className='register' to='/register'>REGISTER</Link> dulu donk</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

const MapstatetoProps = (state) => {
    return state.Auth
}

export default connect(MapstatetoProps, { LoginUser, errormessageclear })(Login);