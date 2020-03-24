import React, { Component } from 'react';
import {
    Card, CardBody,
    CardTitle, CardSubtitle
} from 'reactstrap';
import Numeral from 'numeral'
import { Link } from 'react-router-dom'
import { FiThumbsUp } from 'react-icons/fi'
import { FaCartPlus } from 'react-icons/fa'
import { connect } from 'react-redux'
import { searchitem } from './../redux/actions'


class Search extends Component {
    state = {   }

    renderhasilcari = () => {
        console.log(this.props.User.hasilcari)
        // var hasilcari=this.props.Auth.hasilcari
        if (this.props.User.hasilcari.length === 0){
            return (   
                <div style={{ fontSize: 25, color: 'darkblue' }}>
                    Game yang anda cari tidak ditemukan
                </div>
            )
        }
        return this.props.User.hasilcari.map((val, index) => {
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
                        <CardBody style={{ height: 180 }}>
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
                <div style={{ margin: '7% 5% 0% 5%', textAlign: 'center', alignItems: 'center', fontSize: 30, color: 'orange', backgroundColor: 'darkblue', borderRadius: 30 }}>Search Result <FiThumbsUp />
                </div>
                <div className='flex-wrap d-flex p-5 justify-content-center'>
                    {this.renderhasilcari()}
                </div>
            </div>
        );
    }
}

const MapstatetoProps = (state) => {
    return {
        User: state.Auth
    }
}

export default connect(MapstatetoProps, { searchitem })(Search);