import { useRef, useState} from 'react';
import Button from './Button';
import './FileUploader.css'

function FileUploader() {
    const inputRef = useRef(null);
    const [fileName, setFileName] = useState(null);
    const [upLoadState, setUploadState] = useState('choosing');
    const [progress, setProgress] = useState(0);


    // useEffect(()=>{
    //     ref.current.progress = progress;
    //     ref.current.uploadState = upLoadState;
    // }, [progress, upLoadState ,ref]);

    function handleFileName(event) {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(() => file);
        }
        console.log(file);
    }

    function upload() {
        if (upLoadState === 'choosing') {
            inputRef.current.click();
            setUploadState(() => 'ready_to_upload');
        }
        else if (upLoadState === 'ready_to_upload'){
            setUploadState(() => 'uploading');
            console.log("Uploading");
            //getting the upload ready
            const file = fileName;
            const formData = new FormData();
            formData.append('file', file);

            //getting the axios ready
            const xhp = new XMLHttpRequest();
            xhp.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const precetage = Math.round((event.loaded/event.total)*100);
                    setProgress(precetage);
                }
            }
            xhp.onload = () => {
                if(xhp.status === 200) {
                    setUploadState('upload_finised');
                }
                else {
                    setUploadState('error');
                }
            }
            xhp.open('POST', '/upload');
            xhp.send(formData);
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
            upLoadState === 'uploading' ? 'nonclick' : 'click'
            } 
            onClick={upload}
        >
            {fileName ? 'Upload File' : 'Choose File'}
        </Button>
        <div>{fileName ? fileName.name : null}</div>
    </div>
}

export default FileUploader;