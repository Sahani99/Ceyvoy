import { Component } from "react";
import "./Home.css";


class home extends Component{
    state={clicked: false};
    handleclick =() =>{
        this.setState({clicked: !this.state.clicked
        })
    }
    render(){

    return(
        <>
        <div id="home">
        </div>
        </>
        
    )
}
}

export default home;