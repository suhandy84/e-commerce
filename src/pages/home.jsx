import React, { Component } from 'react';
import { MDBCarousel, MDBCarouselCaption, MDBCarouselInner, MDBCarouselItem, MDBView, MDBMask } from
    "mdbreact";
import { connect } from 'react-redux'
import {
    Card, CardBody,
    CardTitle, CardSubtitle
} from 'reactstrap';
import Numeral from 'numeral'
import Axios from 'axios'
import { API_URL } from './../supports/ApiUrl'
import { FaCartPlus } from 'react-icons/fa'
import { FiThumbsUp } from 'react-icons/fi'
import { BukanHome, IniHome } from './../redux/actions'
import { Link } from 'react-router-dom'
import Filter from './filter'
import Footer from './footer'


class Home extends Component {
    state = {
        photos: [
            './image/onepunchman.jpg',
            './image/ghostoftsushima.jpg',
            './image/ffviiremake.png',
            './image/rdr2.jpg'
        ],
        products: []
    }

    componentDidMount() {
        this.props.IniHome()
        Axios.get(`${API_URL}/products?_expand=kategori&_limit=5`)
            .then((res) => {
                this.setState({ products: res.data })
            }).catch((err) => {
                console.log(err)
            })
    }

    componentWillUnmount = () => {
        console.log('jalan unmount')
        this.props.bukan()
        console.log(this.props.bukan)

    }

    renderphoto = () => {
        return this.state.photos.map((val, index) => {
            return (
                <MDBCarouselItem className='paddingatas' key={index} itemId={index + 1}>
                    <MDBView>
                        <div style={{ width: '100%', display: 'flex' }}>
                            <img
                                // className="d-block w-100"
                                src={val}
                                alt="First slide"
                                // height='700'
                                width='100%'
                            />
                        </div>
                        <MDBMask overlay="black-slight" />
                    </MDBView>
                    <MDBCarouselCaption>
                        {/* <h3 className="h3-responsive">Light mask</h3>
                        <p>First text</p> */}
                    </MDBCarouselCaption>
                </MDBCarouselItem>
            )
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
                <MDBCarousel
                    activeItem={1}
                    length={this.state.photos.length}
                    interval={1800}
                    showControls={true}
                    showIndicators={true}
                    className="z-depth-1"
                >
                    <MDBCarouselInner>
                        {this.renderphoto()}
                    </MDBCarouselInner>
                </MDBCarousel>
                <br/>
                <div className="px-5 mx-5 justify-content-center">
                    <div className="embed-responsive embed-responsive-21by9">
                        <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/1ENHA4Ue9Nw"  allowFullScreen></iframe>
                    </div>
                </div>
                <div className='px-5 pt-3'>
                    <div style={{ margin: '2% 5% 2% 5%', textAlign: 'center', alignItems: 'center', fontSize: 30, color: 'orange', backgroundColor: 'darkblue', borderRadius: 30 }}>Best Seller <FiThumbsUp /></div>
                    <div className='d-flex'>
                        {this.renderProducts()}
                    </div>
                    <div>
                        <Filter />
                    </div>
                </div>
                <div><Footer/></div>
            </div>
        );

    }
}

const MapstatetoProps = ({ Auth }) => {
    return {
        islogin: Auth.islogin
    }
}

export default connect(MapstatetoProps, { bukan: BukanHome, IniHome })(Home);