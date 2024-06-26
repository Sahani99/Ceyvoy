import { Component } from "react";
import "./Navbar.css";
// import logo from '../assets/logo.png'; update after logo added

class NavbarElements extends Component{
    state={clicked: false};
    handleclick =() =>{
        this.setState({clicked: !this.state.clicked
        })
    }
    render(){

    return(
        <>
        <nav>
            <a href="index.html">
                {/* <img src={logo} alt="Logo" />; */} update after logo designed
            </a>
            <div>
                <ul id="NavbarElements" className={this.state.clicked ? "active" : ""}>
                    <li>
                        <a
                        href="Home.js">Home</a>
                    </li>
                    <li>
                        <a
                        href="gallery.html">Gallery</a>
                    </li>
                    <li>
                        <a
                        href="./Event.js">Events</a>
                    </li>
                    <li>
                        <a
                        href="about.html">About</a>
                    </li>
                    <li>
                        <a
                        href="contact.html">Contact</a>
                    </li>
                    <li>
                        <a
                        href="profile.html">Profile</a>
                    </li>
                </ul>
            </div>
            <div id="mobile" onClick={this.handleclick}>
                <i id="bar"
                className={this.state.clicked ?
                    "fas fa-times" : 
                    "fas fa-bars"
                }>

                </i>
            </div>
        </nav>
        </>
    )
}
}

export default NavbarElements;