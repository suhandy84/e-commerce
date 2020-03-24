import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdbreact';
import { connect } from 'react-redux'
import { errormessageclear } from './../redux/actions'
import { Redirect } from 'react-router-dom'
import Swal from 'sweetalert2';
import Axios from 'axios';
import { API_URL } from './../supports/ApiUrl'


class UserSetting extends Component {
    state = {
        ischange: false
    }

    passwordChangeOnCLick = (e) => {
        e.preventDefault()
        var passwordlama = this.refs.passwordlama.value
        var passwordbaru = this.refs.passwordbaru.value
        var passwordconfirm = this.refs.passwordconfirm.value

        if (passwordlama === '' || passwordbaru === '' || passwordconfirm === '') {
            // alert("Mohon mengisi semua data terlebih dahulu")
            Swal.fire(
                "Error",
                "Mohon mengisi semua data terlebih dahulu",
                "error",
            )
        } else if (passwordlama !== this.props.password) {
            Swal.fire(
                "Error",
                "Password lama anda tidak sesuai",
                "error",
            )
        } else if (passwordbaru !== passwordconfirm) {
            Swal.fire(
                "Error",
                "Konfirmasi password baru tidak sama",
                "error",
            )
        } else if (passwordlama === passwordbaru) {
            Swal.fire(
                "Error",
                "Password sudah pernah digunakan",
                "error",
            )
        } else {
            var objpass = {
                password: passwordbaru
            }
            Swal.fire({
                title: `Are you sure wanna change password?`,
                text: "Catat password baru anda",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.value) {
                    Axios.patch(`${API_URL}/users/${this.props.id}`, objpass)
                        .then((res) => {
                            Swal.fire(
                                'Berhasil!',
                                'Password berhasil diubah, silahkan login kembali dengan password baru anda.',
                                'success',
                            )
                            this.setState({ ischange: true })
                            // this.setState({ islogin: false })
                            localStorage.clear()
                            setTimeout(function() {window.location.reload()},3000)
                            console.log(this.state.ischange)
                        }).catch((err) => {
                            console.log(err)
                        })

                }
            })
        }
    }

    render() {
        if (this.state.ischange || !this.props.islogin) {
            return <Redirect to='/login' />
        }
        return (
            <MDBContainer>
                <MDBRow className='d-flex justify-content-center align-items-center' style={{ height: '105vh' }}>
                    <MDBCol md="3">
                        <form onSubmit={this.passwordChangeOnCLick} >
                            <p className="h4 text-center mb-4">User Setting</p>
                            <label htmlFor="defaultFormLoginEmailEx" className="darkblue-text">
                                Username
                            </label>
                            <input type="text" id="defaultFormLoginEmailEx" disabled defaultValue={'Bos ' + this.props.username} ref="username" className="form-control" />
                            <br />
                            <label htmlFor="defaultFormLoginPasswordEx" className="darkblue-text">
                                Your password
                            </label>
                            <input type="password" id="defaultFormLoginPasswordEx" ref="passwordlama" className="form-control" />
                            <br />
                            <label htmlFor="defaultFormLoginPasswordEx" className="darkblue-text">
                                Your new password
                            </label>
                            <input type="password" id="defaultFormLoginPasswordEx" ref="passwordbaru" className="form-control" />
                            <br />
                            <label htmlFor="defaultFormLoginPasswordEx" className="darkblue-text">
                                Confirm your new password
                            </label>
                            <input type="password" id="defaultFormLoginPasswordEx" ref="passwordconfirm" className="form-control" />
                            <div className="text-center mt-4">
                                <MDBBtn color="indigo" type="submit"  >Submit</MDBBtn>
                            </div>
                        </form>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }
}

const MapstatetoProps = (state) => {
    return state.Auth
}

export default connect(MapstatetoProps, { errormessageclear })(UserSetting);