import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import Axios from 'axios';
import { API_URL } from './../supports/ApiUrl'
import { Table } from 'reactstrap'
import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
import { Redirect } from 'react-router-dom';
import { changetoRupiah } from './../supports/changeToRp'

class StatusOrder extends Component {
    state = {
        isicart: [],
        totalqty: 0,
        totalharga: 0,
        statuscart: [],
        detail: false
    }

    componentDidMount() {
        Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${this.props.User.id}&status_ne=oncart`)
            .then((res) => {
                console.log(res.data)
                this.setState({ statuscart: res.data })
                console.log(this.state.statuscart)
            }).catch((err) => {
                console.log(err)
            })
    }


    detailcart = (index) => {
        Axios.get(`${API_URL}/transactions?_embed=transactiondetails&id=${this.state.statuscart[index].id}`)
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

    renderorder = () => {
        if (this.state.statuscart.length === 0) {
            return (
                <tr>
                    <td></td>
                    <td></td>
                    <td style={{ fontSize: 25, color: 'darkblue' }}>Anda belum melakukan pesanan</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            )
        }
        return this.state.statuscart.map((val, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{val.id}</td>
                    <td>{val.status}</td>
                    <td>{val.tanggal}</td>
                    <td><button className='btn btn-primary' onClick={()=>this.detailcart(index)}>Detail Order</button></td>
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
        if (this.state.statuscart[0].status === "ondelivery"){
            return (
                <Fragment>
                    <tr style={{ backgroundColor: 'darkblue', color: 'orange' }}>
                        <td></td>
                        <td></td>
                        <td style={{ fontSize: 20, fontWeight: "bold" }}>TOTAL BELANJA ANDA</td>
                        <td style={{ fontSize: 20, fontWeight: "bold" }}>{this.state.totalqty + ` item(s)`}</td>
                        <td style={{ fontSize: 20, fontWeight: "bold" }}>{changetoRupiah(this.state.totalharga)}</td>
                        {console.log(this.state.isicart.length)}
                    </tr>
                    <tr style={{}}>
                        <td></td>
                        <td></td>
                        <td style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", lineHeight: 3 }}>STATUS PESANAN ANDA</td>
                        {console.log(this.state.statuscart[0].status)}
                        <td><button className='btn btn-warning' disabled >{this.state.statuscart[0].status}</button></td>
                        <td><button className='btn btn-success' onClick={()=>this.acceptconfirm()}>TERIMA BARANG</button></td>
                    </tr>
                </Fragment>
            )
        }
            return (
                <Fragment>
                    <tr style={{ backgroundColor: 'darkblue', color: 'orange' }}>
                        <td></td>
                        <td></td>
                        <td style={{ fontSize: 20, fontWeight: "bold" }}>TOTAL BELANJA ANDA</td>
                        <td style={{ fontSize: 20, fontWeight: "bold" }}>{this.state.totalqty + ` item(s)`}</td>
                        <td style={{ fontSize: 20, fontWeight: "bold" }}>{changetoRupiah(this.state.totalharga)}</td>
                        {console.log(this.state.isicart.length)}
                    </tr>
                    <tr style={{}}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", lineHeight: 3 }}>STATUS PESANAN ANDA</td>
                        {console.log(this.state.statuscart[0].status)}
                        <td><button className='btn btn-warning' disabled >{this.state.statuscart[0].status}</button></td>
                    </tr>
                </Fragment>
            )
    }


    acceptconfirm = () =>{
        Swal.fire({
            title: `Are you sure wanna confirm received this order?`,
            text: "Pastikan barang yang diterima sudah sesuai pesanan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No, mau cek dulu',
        }).then((result) => {
            if (result.value) {
                var statuscart = this.state.statuscart
                var tanggalterima = new Date()
                var objupdate = {
                    status: 'delivered',
                    id: statuscart[0].id,
                    tanggal: tanggalterima
                }
                Axios.patch(`${API_URL}/transactions/${objupdate.id}`, objupdate)
                    .then((res) => {
                        Swal.fire(
                            'Process!',
                            'Order has been received.',
                            'success'
                        ).then((result) => {
                            if (result.value) {
                                this.backOnClick()
                            }
                        })
                    }).catch((err) => {
                        console.log(err)
                    })
            }
        })
    }


    backOnClick=()=>{
        this.setState({ detail: false})
        this.componentDidMount()
    }

    render(index) {
        if (this.props.User.role === 'user') {
            return (
                <div className='paddingatas'>
                    {
                        this.state.detail ?
                            <div>
                                <button className='btn btn-primary btn-sm' onClick={this.backOnClick}>Back</button>
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
                                        <th>ID Order</th>
                                        <th>Status Order</th>
                                        <th>Tanggal Order</th>
                                        <th>Detail Order</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderorder()}
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

export default connect(MapstatetoProps)(StatusOrder);