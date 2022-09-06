import { Component } from "react";
import "./availableShiftsBtn.css";
interface AdminProps {
    className: string;
    btnText: string;
    btnIcon: string;
    onClickHandler: React.MouseEventHandler<HTMLButtonElement>;
}

export class AvailableShiftsBtn extends Component<AdminProps> {
    render() {
        const { className, btnText, btnIcon, onClickHandler } = this.props;
        return (
            <button id="whiteButton" className={className} onClick={onClickHandler}>
                <img className="btn-icon" src={btnIcon} />
                {btnText}
            </button>
        );
    }
}
