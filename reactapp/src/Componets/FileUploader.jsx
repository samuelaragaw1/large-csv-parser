import {useRef, useState} from 'react';
import Button from './Button';
import './FileUploader.css';
import ProgressBar from './ProgressBar';
import axios from 'axios';
import { buttonStateHandler } from './buttonStateHandler';
import { buttonTextHandler } from './buttonTextHandler';

//uploadState states
//1, choosing
//2, ready_to_upload
//3, uploading
//4, uploaded
//5, error_u
//6, processing
//7, error_p
//8, processed

function FileUploader() {
    const [processFile, setprocessFile] = useState('');
    const inputRef = useRef(null);
    const [fileName, setFileName] = useState(null);
    const [upLoadState, setUploadState] = useState('choosing');
    const [progress, setProgress] = useState(0);


    function progressHandler() {
        if (upLoadState === "choosing" || upLoadState === "ready_to_upload") {
            return null;
        }
        else if (upLoadState === 'uploading') {
            return <ProgressBar percent={progress} error={false}/>;
        }
        else if (upLoadState === 'error') {
            return <ProgressBar percent={progress} error={true}/>;
        }
    }

    function handleFileName(event) {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(() => file);
        }
        console.log(file);
    }

    async function upload() {
        if (upLoadState === 'choosing') {
            inputRef.current.click();
            setUploadState(() => 'ready_to_upload');
        }
        else if (upLoadState === 'ready_to_upload'){
            //getting the upload ready
            const file = fileName;
            const formData = new FormData();
            formData.append('file', file);

            try {
                setUploadState(() => 'uploading');
                const response = await axios.post('/upload', formData, {
                    headers: {
                        'File-Name': fileName.name
                    },
                    onUploadProgress: (event) => {
                        if (event.total) {
                            const precentCompleted = 
                            Math.round((event.loaded/event.total)*100);
                            setProgress(precentCompleted);
                        }
                    }
                })

                const responseFileName = await response.data.fileName;

                setprocessFile(responseFileName);
                console.log(responseFileName);

                setUploadState('uploaded')
            }
            catch (err) {
                setUploadState('error_u');
            }
        }
        else if (upLoadState === 'uploaded') {
            //
        }
    }
    
    return <div className='file_uploader'>
        <input 
            className={'file_input'} 
            accept='.' 
            type="file" 
            ref={inputRef}
            onChange={handleFileName}
        />
        <Button type={buttonStateHandler(upLoadState)} 
            onClick={upload}
        >
            {buttonTextHandler(upLoadState, fileName)}
        </Button>
        <div>{fileName ? fileName.name : null}</div>
        {progressHandler()}
    </div>
}

export default FileUploader;