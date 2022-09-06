import { Component } from "react";
import "./availableShiftsBtn.css";
interface AdminProps {
    className: string;
    btnText: string;
    btnIcon: string;
    onClickHandler: any;
}

export class AvailableShiftsBtn extends Component<AdminProps> {
    render() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { className, btnText, btnIcon, onClickHandler } = this.props;
        return (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            <button className={className} onClick={onClickHandler}>
                <img src={btnIcon} />
                {btnText}
            </button>
        );
    }
}
