import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import Axios from 'axios';
import { API_URL } from './../supports/ApiUrl'
import { Table } from 'reactstrap'
import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
import { Redirect } from 'react-router-dom';
import { changetoRupiah } from './../supports/changeToRp'

class ManageOrder extends Component {
    state = {
        userorder: [],
        isicart: [],
        totalqty: 0,
        totalharga: 0,
        statuscart: [],
        detail: false
    }

    componentDidMount() {
        Axios.get(`${API_URL}/transactions?status_ne=oncart&_expand=user`)
            .then(res1 => {
                console.log(res1.data)
                this.setState({ userorder: res1.data })
                console.log(this.state.userorder)
                console.log(this.state.userorder.id)
            }).catch(err1 => {
                console.log(err1)
            })
    }

    getdata = (index) => {
        var id = this.state.userorder[index].id
        Axios.get(`${API_URL}/transactions?_embed=transactiondetails&id=${id}`)
            .then((res) => {
                console.log(res.data)
                this.setState({ statuscart: res.data })
                console.log(this.state.statuscart)
                console.log(this.state.statuscart[0].status)
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
                console.log(totalharga)
                this.setState({ detail: true })
            }).catch((err) => {
                console.log(err)
            })
    }

    renderuserorder = () => {
        if (this.state.userorder.length === 0) {
            return (
                <tr>
                    <td></td>
                    <td></td>
                    <td style={{ fontSize: 25, color: 'darkblue' }}>Maaf belum ada transaksi user</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            )
        }
        return this.state.userorder.map((val, index, id) => {
            if (val.status !== "onprocess") {
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{val.user.username}</td>
                        <td>{val.id}</td>
                        <td>{val.metode}</td>
                        <td>{val.status}</td>
                        <td>{val.tanggal}</td>
                        <td><button className='btn btn-primary' onClick={() => this.getdata(index, id)}>Detail Order</button></td>
                    </tr>
                )
            }
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{val.user.username}</td>
                    <td>{val.id}</td>
                    <td>{val.metode}</td>
                    <td>{val.status}</td>
                    <td>{val.tanggal}</td>
                    <td><button className='btn btn-success' onClick={() => this.getdata(index, id)}>Proses Order</button></td>
                </tr>
            )
        })
    }


    renderisidata = () => {
        return this.state.isicart.map((val, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{val.dataprod.name}</td>
                    <td><img src={val.dataprod.image} height='150' alt='' /></td>
                    <td>{val.qty}</td>
                    <td>{changetoRupiah(val.dataprod.harga * val.qty)}</td>
                </tr>
            )
        })
    }

    rendertotalqtyharga = () => {
        if (this.state.statuscart[0].status !== "onprocess") {
            return (
                <Fragment>
                    <tr style={{ backgroundColor: 'darkblue', color: 'orange' }}>
                        <td></td>
                        <td></td>
                        <td style={{ fontSize: 20, fontWeight: "bold" }}>TOTAL BELANJA USER</td>
                        <td style={{ fontSize: 20, fontWeight: "bold" }}>{this.state.totalqty + ` item(s)`}</td>
                        <td style={{ fontSize: 20, fontWeight: "bold" }}>{changetoRupiah(this.state.totalharga)}</td>
                    </tr>
                    <tr style={{}}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", lineHeight: 3 }}>STATUS PESANAN USER</td>
                        {console.log(this.state.statuscart[0].status)}
                        <td><button className='btn btn-warning' disabled >{this.state.statuscart[0].status}</button></td>
                    </tr>
                </Fragment>
            )
        }
        return (
            <Fragment>
                <tr style={{ backgroundColor: 'darkblue', color: 'orange' }}>
                    <td></td>
                    <td></td>
                    <td style={{ fontSize: 20, fontWeight: "bold" }}>TOTAL BELANJA USER</td>
                    <td style={{ fontSize: 20, fontWeight: "bold" }}>{this.state.totalqty + ` item(s)`}</td>
                    <td style={{ fontSize: 20, fontWeight: "bold" }}>{changetoRupiah(this.state.totalharga)}</td>
                </tr>
                <tr style={{}}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td><button className='btn btn-danger btn-lg' onClick={() => this.cancelorder()}>Cancel Order</button></td>
                    <td><button className='btn btn-success btn-lg' onClick={() => this.prosesorder()} >Proses Pesanan</button></td>
                </tr>
            </Fragment>
        )
    }

    cancelorder = () => {
        Swal.fire({
            title: `Are you sure wanna cancel this order?`,
            // text: "Pastikan pembayaran sudah sesuai!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.value) {
                var statuscart = this.state.statuscart
                var tanggalcancel = new Date()
                var objupdate = {
                    status: 'cancelled',
                    id: statuscart[0].id,
                    tanggal: tanggalcancel
                }
                Axios.patch(`${API_URL}/transactions/${objupdate.id}`, objupdate)
                    .then((res) => {
                        Swal.fire(
                            'Process!',
                            'Order has been cancelled.',
                            'success'
                        ).then((result) => {
                            if (result.value) {
                                this.setState({ detail: false })
                                this.componentDidMount()
                            }
                        })
                    }).catch((err) => {
                        console.log(err)
                    })
            }
        })
    }

    prosesorder = () => {
        Swal.fire({
            title: `Are you sure wanna process this order?`,
            text: "Pastikan pembayaran sudah sesuai!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No, kurang bayar',
        }).then((result) => {
            if (result.value) {
                var statuscart = this.state.statuscart
                var tanggalproses = new Date()
                var objupdate = {
                    status: 'ondelivery',
                    id: statuscart[0].id,
                    tanggal: tanggalproses
                }
                Axios.patch(`${API_URL}/transactions/${objupdate.id}`, objupdate)
                    .then((res) => {
                        Swal.fire(
                            'Process!',
                            'Order has been processed.',
                            'success'
                        ).then((result) => {
                            if (result.value) {
                                this.setState({ detail: false })
                                this.componentDidMount()
                            }
                        })
                    }).catch((err) => {
                        console.log(err)
                    })
            }
        })
    }

    render() {
        if (this.props.User.role === 'admin') {
            return (
                <div className='paddingatas'>
                    {
                        this.state.detail ?
                            <div>
                                <button className='btn btn-primary btn-sm' onClick={() => this.setState({ detail: false })}>Back</button>
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Nama</th>
                                            <th>Foto</th>
                                            <th>Qty</th>
                                            <th>Total Harga</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderisidata()}
                                        {this.rendertotalqtyharga()}
                                    </tbody>
                                </Table>
                            </div>
                            :
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Nama</th>
                                        <th>ID Order</th>
                                        <th>Metode Pembayaran</th>
                                        <th>Status Order</th>
                                        <th>Tanggal Order</th>
                                        <th>Proses Order</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderuserorder()}
                                </tbody>
                            </Table>
                    }
                </div>
            );
        } else {
            return <Redirect to='/notfound' />
        }
    }
}

const MapstatetoProps = (state) => {
    return {
        User: state.Auth
    }
}

export default connect(MapstatetoProps)(ManageOrder);