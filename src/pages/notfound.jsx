import React, { Component } from 'react';
import '../colorlib-error-404-16/css/style.css'
import { FaFacebook, FaTwitter, FaGooglePlus, FaInstagram } from 'react-icons/fa';

class Notfound extends Component {
    state = {}
    render() {
        return (
            <div id="notfound">
                <div className="notfound-bg" />
                <div className="notfound">
                    <div className="notfound-404">
                        <h1>404</h1>
                    </div>
                    <h2>we are sorry, but the page you requested was not found</h2>
                    <a href="./" className="home-btn">
                        Go Home
    </a>
                    <a href="./" className="contact-btn">
                        Contact us
    </a>
                    <div className="notfound-social">
                        <a href="#">
                            <FaFacebook size='30'/>
                        </a>
                        <a href="#">
                            <FaTwitter size='30'/>
                        </a>
                        <a href="#">
                            <FaInstagram size='30'/>
                        </a>
                        <a href="#">
                            <FaGooglePlus size='30'/>
                        </a>
                    </div>
                </div>
            </div>

        )
    }
}

export default Notfound;