import button from './button.module.css'

function Button({onClick, children, type}) {
    const buttonType = type === 'click' ? button.click : button.nonclick;
    return <button  className={buttonType} onClick={onClick}>{children}</button>;
}

export default  Button;