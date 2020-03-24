import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import Axios from 'axios';
import { API_URL } from './../supports/ApiUrl'
import { Table } from 'reactstrap'
import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
import { Redirect } from 'react-router-dom';
import { changetoRupiah } from './../supports/changeToRp'
import { TotalQty } from './../redux/actions'

class Cart extends Component {
    state = {
        isicart: [],
        totalqty: 0,
        totalharga: 0,
        statuscart: [],
        isbayar:false
    }

    componentDidMount() {
        this.getdata()
    }

    getdata = () => {
        Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${this.props.User.id}&status=oncart`)
            .then((res) => {
                console.log(res.data)
                this.setState({ statuscart: res.data })
                console.log(this.state.statuscart)
                var newarrforprod = []
                res.data[0].transactiondetails.forEach(element => {
                    newarrforprod.push(Axios.get(`${API_URL}/products/${element.productId}`))
                })
                console.log(newarrforprod)
                Axios.all(newarrforprod)
                    .then((res2) => {
                        // console.log(res2)
                        res2.forEach((val, index) => {
                            res.data[0].transactiondetails[index].dataprod = val.data
                        })
                        // console.log(res.data[0].transactiondetails[0].dataprod.harga)
                        this.setState({ isicart: res.data[0].transactiondetails })
                        console.log(this.state.isicart)
                    })
                    var isicart = res.data[0].transactiondetails
                    var totalqty = 0
                    for (var i = 0; i < isicart.length; i++) {
                        totalqty += isicart[i].qty
                    }
                    this.setState({ totalqty: totalqty })
                    var totalharga = 0
                    for (var i = 0; i < isicart.length; i++) {
                        totalharga += isicart[i].totalharga
                    }
                    this.setState({ totalharga: totalharga })
                    var totalcart=isicart.length
                    console.log(totalcart)
                    this.props.TotalQty(totalcart)
                // var tanggalbayar=new Date()
                // console.log(tanggalbayar)
                console.log(this.state.statuscart.length)
            }).catch((err) => {
                console.log(err)
            })
    }

    renderisidata = () => {
        if (this.state.isicart.length === 0) {
            return (
                <tr>
                    <td></td>
                    <td></td>
                    <td style={{ fontSize: 25, color: 'darkblue' }}>Maaf keranjang anda kosong</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            )
        }

        return this.state.isicart.map((val, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{val.dataprod.name}</td>
                    <td><img src={val.dataprod.image} height='150' alt='' /></td>
                    <td>{val.qty}</td>
                    <td>{changetoRupiah(val.dataprod.harga * val.qty)}</td>
                    <td><button className='btn btn-danger' onClick={() => this.deleteconfirm(index, val.id)}>Delete</button></td>
                </tr>
            )
        })
    }

    rendertotalqtyharga = () => {
        if (this.state.isicart.length)
            return (
                <Fragment>
                <tr>
                    <td></td>
                    <td></td>
                    <td style={{fontSize:15, fontWeight:"bold", color:"darkblue"}}>Masukkan no. Credit Card Anda</td>
                    <td></td>
                    <td></td>
                    <td><input size="35" style={{fontSize:15, fontWeight:"bold"}} maxLength="16" type="text" placeholder="16 nomor Credit Card Anda"></input></td>
                </tr>
                <tr style={{backgroundColor: 'darkblue', color: 'orange' }}>
                    <td></td>
                    <td></td>
                    <td style={{fontSize:20, fontWeight:"bold"}}>TOTAL BELANJA ANDA</td>
                    <td style={{fontSize:20, fontWeight:"bold"}}>{this.state.totalqty + ' item(s)'}</td>
                    <td style={{fontSize:20, fontWeight:"bold"}}>{changetoRupiah(this.state.totalharga)}</td>
                    {/* {console.log(this.state.isicart.length)} */}
                    <div style={{textAlign:"center"}}><button className='btn btn-success' onClick={this.bayarconfirm} >Bayar</button></div>           
                </tr>
                </Fragment>
            )
    }

    deleteconfirm = (index, id) => {
        Swal.fire({
            title: `Are you sure wanna delete ${this.state.isicart[index].dataprod.name}?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                Axios.delete(`${API_URL}/transactiondetails/${id}`)
                    .then((res) => {
                        Swal.fire(
                            'Deleted!',
                            'Your item has been deleted.',
                            'success'
                        ).then((result) => {
                            if (result.value) {
                                this.getdata()
                            }
                        })

                    }).catch((err) => {
                        console.log(err)
                    })
            }
        })
    }

    bayarconfirm = () => {
        Swal.fire({
            title: `Are you sure wanna checkout?`,
            text: "Ga ada refund loh!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No, lagi bokek',
        }).then((result) => {
            if (result.value) {
                var statuscart = this.state.statuscart
                var tanggalbayar = new Date()
                var objupdate = {
                    status: 'onprocess',
                    id: statuscart[0].id,
                    tanggal: tanggalbayar,
                    metode: 'cc'
                }
                Axios.patch(`${API_URL}/transactions/${objupdate.id}`, objupdate)
                    .then((res) => {
                        Swal.fire(
                            'Checkout!',
                            'Your item(s) has been paid.',
                            'success'
                        ).then((result) => {
                            if (result.value) {
                                this.getdata()
                                this.props.TotalQty(0)
                                this.setState({isicart:[]})//buat tampilan cart kosong setelah checkout
                            }
                        })
                    }).catch((err) => {
                        console.log(err)
                    })
            }
        })
    }

    render() {
        if (this.props.User.role === 'user') {
            return (
                <div className='paddingatas'>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Nama</th>
                                <th>Foto</th>
                                <th>Qty</th>
                                <th>Total Harga</th>
                                <th>Hapus</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderisidata()}
                            {this.rendertotalqtyharga()}
                        </tbody>
                    </Table>
                </div>
            );
        }else {
            return <Redirect to='/notfound' />
        }
    }
}


const MapstatetoProps = (state) => {
    return {
        User: state.Auth
    }
}

export default connect(MapstatetoProps, {TotalQty})(Cart);