const convertFileToBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.rawFile);

        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

const addUploadCapabilities = requestHandler => (type, resource, params) => {

    if ((type === 'UPDATE' || type === 'CREATE') && resource === 'posts') {
        if ((params.data.pictures && params.data.pictures.length)) {
            //only freshly dropped pictures are instance of File
            const formerPictures = params.data.pictures.filter(p => !(p.rawFile instanceof File));
            const newPictures = params.data.pictures.filter(p => p.rawFile instanceof File);


            return Promise.all(newPictures.map(convertFileToBase64))
                .then(base64Pictures =>
                    base64Pictures.map(picture64 => ({
                        src: picture64,
                    }))
                )
                .then(transformedNewPictures =>
                    requestHandler(type, resource, {
                        ...params,
                        data: {
                            ...params.data,
                            pictures: [
                                ...transformedNewPictures,
                                ...formerPictures,
                            ],
                        },
                    })
                );
        }
    }

    if (type === 'CREATE' && resource === 'uploadNotificationFile') {
        if ((params.data.files && params.data.files.length)) {
            //only freshly dropped pictures are instance of File
            const formerFiles = params.data.files.filter(p => !(p.rawFile instanceof File));
            const newFiles = params.data.files.filter(p => p.rawFile instanceof File);


            return Promise.all(newFiles.map(convertFileToBase64))
                .then(base64Files =>
                    base64Files.map(file64 => ({
                        src: file64,
                    }))
                )
                .then(transformedNewFiles =>
                    requestHandler(type, resource, {
                        ...params,
                        data: {
                            ...params.data,
                            files: [
                                ...transformedNewFiles,
                                ...formerFiles,
                            ],
                        },
                    })
                );
        }
    }

    return requestHandler(type, resource, params);
};

export default addUploadCapabilities;
