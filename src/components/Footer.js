import { Component } from "react";
import "./Footer.css";


class footer extends Component{
    state={clicked: false};
    handleclick =() =>{
        this.setState({clicked: !this.state.clicked
        })
    }
    render(){

    return(
        <>
            <div>
            <ul id="footer">
                <li>
                    <a href="index.html">Quick Links</a>
                </li>
                <ul>
                    <li>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    </li>
                    <li>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    </li>
                    <li>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                    </li>
                </ul>
                <li>
                    <a href="support.html">Support</a>
                </li>
                <li>
                    <a href="about.html">About</a>
                </li>
                <li>
                    <a href="contact.html">Contact</a>
                </li>
                <li>
                    <a href="currency-converter.html">Currency Converter</a>
                </li>
            </ul>
                        </div>    
            </>
    )
}
}

export default footer;