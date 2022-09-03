interface Props {
    children: JSX.Element | JSX.Element[];
}
export const WEITBackground = ({ children }: Props): JSX.Element => {
    return (
        <>
            <div className="background-image weit-logo" />
            {children}
        </>
    );
};
