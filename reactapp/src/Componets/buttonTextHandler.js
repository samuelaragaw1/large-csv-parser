export const buttonTextHandler = (upLoadState, fileName) => {
    if (upLoadState === 'choosing'
        || (upLoadState === 'ready_to_upload' && fileName === null)
    ) {
        return 'Choose File';
    }
    else if ((upLoadState === 'ready_to_upload' && fileName !== null)
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