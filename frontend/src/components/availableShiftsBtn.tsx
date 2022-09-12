import { Component } from "react";
import "./availableShiftsBtn.css";
interface AdminProps {
    className: string;
    btnText: string;
    btnIcon: string;
    onClickHandler: React.MouseEventHandler<HTMLButtonElement>;
    isLoading: boolean;
}

export class AvailableShiftsBtn extends Component<AdminProps> {
    render() {
        const { className, btnText, btnIcon, onClickHandler, isLoading } = this.props;
        return (
            <button id="whiteButton" className={className} onClick={onClickHandler} disabled={isLoading}>
                <img className="btn-icon" src={btnIcon} />
                {btnText}
            </button>
        );
    }
}
