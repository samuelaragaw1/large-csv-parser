import './ProgressBar.css';

function ProgressBar({percent, error}) {
    const colorProgress = error === true ? 'red' : 'green'
    return <div style={{

        }}>
            <div className='bar'>
                <div style={{
                    width: `${percent}%`,
                    backgroundImage: `linear-gradient( ${colorProgress}, white, ${colorProgress})`
                    }} 
                    className='precentage'>
                </div>
            </div>
    </div>
}

export default ProgressBar;