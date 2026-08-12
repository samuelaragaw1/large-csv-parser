import { useEffect, useRef, useState} from 'react';
import Button from './Button';
import './FileUploader.css';
import ProgressBar from './ProgressBar';
import axios from 'axios';



function FileUploader(props) {
    const {ref} = props;
    const inputRef = useRef(null);
    const [fileName, setFileName] = useState(null);
    const [upLoadState, setUploadState] = useState('choosing');
    //uploadState states
    //1, choosing
    //2, ready_to_upload
    //3, uploading
    //4, uploaded
    //5, error_u
    //6, processing
    //7, error_p
    //8, processed
    const [progress, setProgress] = useState(0);


    ref.current.status = upLoadState; 



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
                await axios.post('/upload', formData, {
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

                setUploadState('uploaded')
            }
            catch (err) {
                setUploadState('error_u');
            }
        }
        else {
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
        <Button type={
            // upLoadState === 'uploading' ? 'nonclick' : 'click'
            () => {
                if (upLoadState === 'choosing'
                    || upLoadState === 'ready_to_upload'
                    || upLoadState === 'uploaded'
                    || upLoadState === 'error_u'
                    || upLoadState === 'error_p'
                    || upLoadState === 'processed'
                ) {
                    return 'click';
                }
                else if (upLoadState === 'uploading'
                    || upLoadState === 'processing'
                ) {
                    return 'nonclick'
                }
            }
            } 
            onClick={upload}
        >
            {
                () => {
                    if (upLoadState === 'choosing') {
                        return 'Choose File';
                    }
                    else if (upLoadState === 'ready_to_upload'
                        || upLoadState === 'uploading'
                    ) {
                        return 'Upload File';
                    }
                    else if (upLoadState === 'uploaded') {
                        return 'Process'
                    }
                    else if (upLoadState === 'error_u') {
                        return 'Upload File'
                    }
                    else if (upLoadState === 'processing') {
                        return 'Process'
                    }
                    else if (upLoadState === 'error_p') {
                        return 'Process'
                    }
                    else if (upLoadState === 'processed') {
                        return 'Download'
                    }
                }
            }
        </Button>
        <div>{fileName ? fileName.name : null}</div>
        {progressHandler()}
    </div>
}

export default FileUploader;