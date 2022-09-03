import React from "react";
import "./myShift.css";
import "bootstrap/dist/css/bootstrap.min.css";

export class Modal extends React.Component {
    render() {
        return (
            <>
                <div className="row1">
                    <div className="centermodalcolumn">
                        <div className="modalcenter">
                            <h1>Shift Information</h1>
                        </div>
                    </div>
                    <div className="dropdown">
                        <button className="dropbtn2">
                            <a href="./myShift">Return</a>
                        </button>
                    </div>
                    <div className="centermodalcolumn">
                        <div className="rightCard1">
                            <h2 className="myshiftcenter">UTS Beach Clean Up</h2>
                            <h4>Who:</h4>
                            <p>campus tour from March 11, 2022</p>
                            <h4>When:</h4>
                            <p>society club</p>
                            <h4>Time:</h4>
                            <p>society club</p>
                            <h4>Where:</h4>
                            <p>society club</p>
                            <h4>Task:</h4>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Integer quis auctor elit sed vulputate mi
                                sit amet. Leo duis ut diam quam nulla porttitor massa id neque. Sem integer vitae justo
                                eget magna fermentum iaculis eu. Accumsan tortor posuere ac ut consequat semper. Sed
                            </p>
                            <h3>Contact:</h3>
                            <p>society club</p>
                            <div className="modalcenter">
                                <button className="modalbutton"> Mark As Done </button>
                            </div>
                            <div className="modalcenter">
                                <button className="modalbutton"> Cancel Shift </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
