import './ProgressBar.css';

function ProgressBar({percent}) {

    return <div className='bar'>
        <div style={{
            width: `${percent}%`
        }} 
        className='precentage'></div>
    </div>
}

export default ProgressBar;