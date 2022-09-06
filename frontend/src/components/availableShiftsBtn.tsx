import { Component } from "react";

interface AdminProps {
    className: string;
    btnText: string;
    btnIcon: string;
}

export class AvailableShiftsBtn extends Component<AdminProps> {
    render() {
        const { className, btnText, btnIcon } = this.props;
        return (
            <button className={className}>
                <img src={btnIcon} />
                {btnText}
            </button>
        );
    }
}
