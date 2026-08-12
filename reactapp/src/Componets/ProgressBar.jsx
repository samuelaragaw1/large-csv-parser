import './ProgressBar.css';

function ProgressBar({percent, error}) {
    const colorProgress = error === true ? 'red' : 'green'
    return <div style={{
            width: '40%',
            display: 'flex',
            flexDirection: 'row',
            columnGap: '1rem',
            alignItems: 'center'
        }}>
            <div className='bar'>
                <div style={{
                    width: `${percent}%`,
                    backgroundImage: `linear-gradient( ${colorProgress}, white, ${colorProgress})`
                    }} 
                    className='precentage'>
                </div>
            </div>
            <div 
                style={{
                    fontSize: '1.5rem'
                }}
            >
                {`${percent}%`}
            </div>
    </div>
}

export default ProgressBar;