import React, { Component } from 'react';
import {
    Card, CardBody,
    CardTitle, CardSubtitle
} from 'reactstrap';
import { MDBPagination, MDBPageItem, MDBPageNav, MDBCol, MDBRow } from "mdbreact"
import Numeral from 'numeral'
import Axios from 'axios'
import { API_URL } from './../supports/ApiUrl'
import { FaCartPlus, FaFilter } from 'react-icons/fa'
import { Link } from 'react-router-dom'

class Filter extends Component {
    state = {
        products: [],
        isFilter: false//supaya halaman tidak muncul pada saat fungsi filter dijalankan
    }

    componentDidMount(page) {
        Axios.get(`${API_URL}/products?_expand=kategori&_page=${page}`)
            .then((res) => {
                this.setState({ products: res.data, isFilter: false })
                console.log(this.state.products)
            }).catch((err) => {
                console.log(err)
            })
    }

    filterOnClick = (filter) => {
        Axios.get(`${API_URL}/products?_expand=kategori&kategoriId_like=${filter}`)
            .then((res) => {
                this.setState({ products: res.data, isFilter: true })
                console.log(this.state.products)
                console.log(this.state.isFilter)
            }).catch((err) => {
                console.log(err)
            })
    }

    renderProducts = () => {
        return this.state.products.map((val, index) => {
            return (
                <div key={index} className='p-3' style={{ width: '20%' }}>
                    <Card>
                        <div style={{ height: '', width: '100%' }}>
                            <img src={val.image} height='100%' width='100%' alt='' />
                            <div className='kotakhitam'>
                                <Link to={`/productdetail/${val.id}`} className='tombolbuynow'>
                                    <button className='tomboldalam'><FaCartPlus /></button>
                                </Link>
                            </div>
                        </div>
                        <CardBody style={{ height: 160 }}>
                            <CardTitle style={{ fontWeight: 'bold' }} className='mb-2'>{val.name}</CardTitle>
                            <CardSubtitle className='mb-2'>{'Rp.' + Numeral(val.harga).format(0.0)}</CardSubtitle>
                            <button disabled className='rounded-pill px-2 btn-primary'>{val.kategori.nama}</button>
                        </CardBody>
                    </Card>
                </div>
            )
        })
    }

    render() {
        return (
            <div>
                <div style={{ margin: '2% 5% 2% 5%', textAlign: 'center', alignItems: 'center', fontSize: 30, color: 'orange', backgroundColor: 'darkblue', borderRadius: 30 }}>ALL PRODUCTS
                </div>
                <div className='d-flex justify-content-center'>
                    <div style={{ fontWeight: "bold", fontSize: 17, lineHeight: 3, color: 'darkblue' }}><FaFilter />Filter By Category:</div>
                    <button className='btn btn-teal btn-sm' onClick={() => this.componentDidMount()}>ALL</button>
                    <button className='btn btn-teal btn-sm' onClick={() => this.filterOnClick('1')}>Action</button>
                    <button className='btn btn-primary btn-sm' onClick={() => this.filterOnClick('2')}>Adventure</button>
                    <button className='btn btn-danger btn-sm' onClick={() => this.filterOnClick('3')}>Arcade</button>
                    <button className='btn btn-secondary btn-sm' onClick={() => this.filterOnClick('4')}>Fighting</button>
                    <button className='btn btn-orange btn-sm' onClick={() => this.filterOnClick('5')}>Horror</button>
                    <button className='btn btn-pink btn-sm' onClick={() => this.filterOnClick('6')}>Racing</button>
                    <button className='btn btn-primary btn-sm' onClick={() => this.filterOnClick('7')}>RPG</button>
                    <button className='btn btn-primary btn-sm' onClick={() => this.filterOnClick('8')}>Shooter</button>
                    <button className='btn btn-primary btn-sm' onClick={() => this.filterOnClick('9')}>Sports</button>
                </div>
                <div className='flex-wrap d-flex  justify-content-center'>
                    {this.renderProducts()}
                </div>
                {
                    this.state.isFilter ?
                        null
                        :
                        <MDBRow>
                            <MDBCol>
                                <MDBPagination color="red" className="justify-content-center mb-5 font-weight-bold">
                                    <MDBPageItem className='mt-1 mr-2'>Halaman :</MDBPageItem>
                                    <MDBPageItem>
                                        <MDBPageNav onClick={() => this.componentDidMount(1)}>
                                            1
                                    </MDBPageNav>
                                    </MDBPageItem>
                                    <MDBPageItem>
                                        <MDBPageNav onClick={() => this.componentDidMount(2)}>2</MDBPageNav>
                                    </MDBPageItem>
                                </MDBPagination>
                            </MDBCol>
                        </MDBRow>
                }
            </div>
        );
    }
}

export default Filter;