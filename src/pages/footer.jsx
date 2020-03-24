import React, { Component } from 'react';
import { FaPlaystation, FaFacebook, FaTwitter, FaPinterest, FaInstagram, FaYoutube } from 'react-icons/fa';

class Footer extends Component {
    state = {}
    render() {
        return (
            <div className="footer-1">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <ul><h6>THE COMPANY</h6>
                                <li>About Us</li>
                                <li>The Team</li>
                                <li>The Content Team</li>
                                <li>In The News</li>
                                <li>Our App</li>
                                <li>Newsletter</li>
                                <li>Sitemap</li>
                            </ul>
                        </div>
                        <div className="col-md-3">
                            <ul><h6>LEGAL</h6>
                                <li>Privacy Policy</li>
                                <li>Terms of Use</li>
                                <li>Cookie Policy</li>
                                <li>Booking Terms and Conditions</li>
                            </ul>
                        </div>
                        <div className="col-md-3">
                            <ul><h6>CONTACT US</h6>
                                <li>Get In touch</li>
                                <li>Advertise & Partner</li>
                                <li>Carees</li>
                                <li>Freelance Jobs</li>
                            </ul>
                        </div>
                        <div className="col-md-3">
                            <ul><h6>FOLLOW US</h6>
                                <li><FaFacebook size="20"/> Facebook</li>
                                <li><FaTwitter size="20"/>  Twitter</li>
                                <li><FaPinterest size="20"/> Pinterest</li>
                                <li><FaInstagram size="20"/> Instagram</li>
                                <li><FaYoutube size="20"/> Youtube</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <img className="icon" src="./image/apple-badge.png" alt="" />
                        </div>
                        <div className="col-md-4">
                            <img className="icon1" src="./image/en_badge_web_generic-1.png" alt="" />
                        </div>
                        <div className="col-md-4">
                            <div className="copyright">
                                <FaPlaystation size="30"/>© 2020 PlayStation™Store. All Rights Reserved.
                    </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Footer;