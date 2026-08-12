export const buttonStateHandler = (upLoadState) => {
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
        return 'nonclick';
    }
}