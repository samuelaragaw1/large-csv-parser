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
    const [downloadFile, setDownloadFile] = useState('')
    const [processFile, setprocessFile] = useState('');
    const inputRef = useRef(null);
    const [fileName, setFileName] = useState(null);
    const [upLoadState, setUploadState] = useState('choosing');
    const [progress, setProgress] = useState(0);
    const eventSourceRef = useRef(null);


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
        else if (upLoadState === 'processing') {
            return <ProgressBar percent={progress} error={false}/>;
        }
    }

    function handleFileName(event) {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(() => file);
        }
        // console.log(file);
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
                    // headers: {
                    //     'File-Name': fileName.name
                    // },
                    onUploadProgress: (event) => {
                        if (event.total) {
                            const precentCompleted = 
                            Math.round((event.loaded/event.total)*100);
                            setProgress(precentCompleted);
                        }
                    }
                })

                const responseData = await response.data;

                setprocessFile(responseData.fileName);

                setUploadState('uploaded')
            }
            catch  {
                setUploadState('error_u');
            }
        }
        else if (upLoadState === 'uploaded') {
            try {
                setUploadState('processing');
                setProgress(0);
                const response =  await axios.post(`/process`,  {
                    fileName: processFile
                });
                const {jobId, total} = await response.data;
                
                const evtSource = new EventSource(
                    `http://localhost:5000/process/${jobId}/progress`
                )
                
                eventSourceRef.current = evtSource;

                evtSource.onmessage = (event) => {
                    const msg = JSON.parse(event.data);
                    if (msg.status === 'processing') {
                        setProgress(Math.round(msg.progress));
                    }
                    if (msg.status === 'finished') {
                        setDownloadFile(msg.result);
                        setUploadState('processed');
                        setProgress(100);
                        evtSource.close();
                    }
                    if (msg.status === 'error') {
                        setUploadState('error_p')
                        evtSource.close();
                    }
                }

                evtSource.onerror = () => {
                    setUploadState('error_p');
                    evtSource.close();
                };

                evtSource.onopen = () => {
                    fetch(`http://localhost:5000/process/${jobId}`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({total, processFile})
                    })
                }
            }
            catch {
                setUploadState('error_p');
            }
        }
        else if (upLoadState === "processed") {
            console.log(downloadFile);
            await fetch(`/download/${downloadFile}`, 
                {
                    method: "GET"
                }
            )
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