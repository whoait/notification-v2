'use strict';

const models = require('../models');
const util = require('../util/util');
const appConst = require('../util/const');
const _ = require('underscore');
const path = require('path');
const sftp = require('./sftp');
const ftp = require('./ftp');
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/bind_version_config.json`)[env];

const tmpFolderPath = path.join(__dirname, '../tmp/');

exports.createNotificationFile = (bindVersion) => {
    return new Promise((resolve, reject) => {
        let output = {};
        buildAdJSONObject(bindVersion).then((data) => {
            output['ad'] = data;
            return output;
        }).then((output) => {
            buildNewsJSONObject(bindVersion).then((data) => {
                output['news'] = data;
                output['schedule'] = [];
                return output;
            }).then((output) => {
                buildPopupJSONObject(bindVersion).then((data) => {
                    output['popup'] = data;
                    resolve(JSON.stringify(output));
                });
            });
        });
    });
};

function buildAdJSONObject(bindVersion) {
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const item = models.bind_notification.find({
                where: {
                    message_type: 'ad',
                },
                include: [
                    {
                        model: models.bind_notification_detail,
                        where: {
                            [bindVersion]: true,
                            delete_flag: false,
                            status: appConst.STATUS_PUBLISHING
                        }
                    }
                ]
            });
            cResolve(item);
        }).then((item) => {
            let adObject = {};
            if (util.isEmpty(item)) {
                adObject = {
                    title: '',
                    content: ''
                };
            }
            else {
                adObject = {
                    title: item.title,
                    content: item.content
                };
            }
            resolve(adObject);
        });
    });
}

function buildNewsJSONObject(bindVersion) {
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const newsList = models.bind_notification.findAll({
                where: {
                    message_type: 'news',
                },
                include: [
                    {
                        model: models.bind_notification_detail,
                        where: {
                            [bindVersion]: true,
                            status: appConst.STATUS_PUBLISHING,
                            delete_flag: false,
                        }
                    }
                ]
            });
            cResolve(newsList);
        }).then((newsList) => {
            let newsObject = [];
            const promises = _.map(newsList, (element) => {
                return new Promise((cResolve, cReject) => {
                    getElementInNewsList(element.id, bindVersion).then((data) => {
                        const newsElement = {
                            title: element.title,
                            list: data
                        };
                        cResolve(newsElement);
                    });
                });
            });
            Promise.all(promises).then((data) => {
                newsObject.push(data);
                resolve(data);

            })
        })
    })
}

function getElementInNewsList(parentId, bindVersion) {
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const newsList = models.bind_notification_detail.findAll({
                where: {
                    parent_id: parentId,
                    [bindVersion]: true,
                    status: appConst.STATUS_PUBLISHING,
                    delete_flag: false,
                    limit: null,
                    $or: [
                        {
                            ext_link: {
                                $ne: null
                            }
                        },
                        {
                            modal_link: {
                                $ne: null
                            }
                        },
                    ]
                }
            });
            cResolve(newsList);
        }).then((newsList) => {
            let newsListObject = [];
            const promises = _.map(newsList, (element) => {
                return new Promise((cResolve, cReject) => {
                    let cElement = {
                        id: parseInt(element.id),
                        date: element.date,
                        title: element.sub_title,
                        content: element.content
                    };
                    if (!util.isEmpty(element.ext_link) && util.isEmpty(element.limit)) {
                        cElement.ext_link = element.ext_link;
                        cResolve(cElement);
                    }
                    else if (!util.isEmpty(element.modal_link) && util.isEmpty(element.limit)) {
                        cElement.modal_link = element.modal_link;
                        cResolve(cElement);
                    }
                    else {
                        cResolve();
                    }
                });
            });
            Promise.all(promises).then((data) => {
                newsListObject.push(data);
                resolve(newsListObject);
            })
        });
    });
}

function buildPopupJSONObject(bindVersion) {
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const popupList = models.bind_notification.findAll({
                where: {
                    message_type: 'popup',
                },
                include: [
                    {
                        model: models.bind_notification_detail,
                        where: {
                            [bindVersion]: true,
                            status: appConst.STATUS_PUBLISHING,
                            delete_flag: false,
                        }
                    }
                ]
            });
            cResolve(popupList);
        }).then((popupList) => {
            let popupObject = [];
            const promises = _.map(popupList, (element) => {
                return new Promise((cResolve, cReject) => {
                    getElementInPopupList(element.id, bindVersion).then((data) => {
                        const newsElement = {
                            list: data
                        };
                        cResolve(newsElement);
                    });
                });
            });
            Promise.all(promises).then((data) => {
                popupObject.push(data);
                resolve(data);

            })
        })
    });
}

function getElementInPopupList(parentId, bindVersion) {
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const popupList = models.bind_notification_detail.findAll({
                where: {
                    parent_id: parentId,
                    [bindVersion]: true,
                    status: appConst.STATUS_PUBLISHING,
                    delete_flag: false,
                    limit: {
                        $ne: null
                    },
                    ext_link: {
                        $ne: null
                    }
                }
            });
            cResolve(popupList);
        }).then((popupList) => {
            let popupListObject = [];
            const promises = _.map(popupList, (element) => {
                return new Promise((cResolve, cReject) => {
                    let cElement = {
                        id: parseInt(element.id),
                        date: element.date,
                        title: element.sub_title,
                        content: element.content,
                        ext_link: element.ext_link,
                        limit: element.limit
                    };
                    cResolve(cElement);
                });
            });
            Promise.all(promises).then((data) => {
                popupListObject.push(data);
                resolve(popupListObject);
            })
        });
    });
}

exports.checkPopupListElement = (notificationData, bindVersion) => {
    return new Promise((resolve, reject) => {
        if (notificationData.hasOwnProperty('popup')) {
            const popupList = notificationData.popup;
            if (util.isEmpty(popupList)) {
                resolve();
            }
            else {
                const promises = _.map(popupList, (popup) => {
                    return checkEachPopupElement(popup, bindVersion);
                });
                Promise.all(promises).then(() => {
                    console.log('all promise done');
                    resolve();
                });
            }
        }
        else {
            resolve();
        }
    });
};

function checkEachPopupElement(newsElement, bindVersion) {
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const item = models.bind_notification.find({
                where: {
                    message_type: 'popup',
                },
                include: [
                    {
                        model: models.bind_notification_detail,
                        where: {
                            delete_flag: false,
                            status: appConst.STATUS_PUBLISHING,
                        }
                    }
                ]
            });
            cResolve(item);
        }).then((item) => {
            if (util.isEmpty(item)) {
                // If popup not existed, add new popup element
                return addPopupElement(bindVersion);
            }
            else {
                // If popup existed, update bind version.
                return updatePopupElementWithBindVersion(item, bindVersion);
            }
        }).then((parentId) => {
            console.log(`process check list item in popup element with parent id = ${parentId}`);
            const promises = _.map(newsElement.list, (element) => {
                return new Promise((cResolve, cReject) => {
                    const bind_notification_detail = models.bind_notification_detail.find({
                        where: {
                            parent_id: parentId,
                            id: element.id,
                            delete_flag: false,
                            status: appConst.STATUS_PUBLISHING

                        }
                    });
                    cResolve(bind_notification_detail);
                }).then((bind_notification_detail) => {
                    if (util.isEmpty(bind_notification_detail)) {
                        addElementInPopupList(element, parentId, bindVersion);
                    }
                    else {
                        updateElementInPopupListWithBindVersion(bind_notification_detail, bindVersion);
                    }
                });
            });
            Promise.all(promises).then(() => {
                resolve();
            });
        });
    });
}

function addElementInPopupList(element, parentId, bindVersion) {
    console.log(`add popup element in popup list with  parent_id = ${parentId}`);
    return new Promise((resolve, reject) => {
        models.bind_notification_detail.create(
            {
                parent_id: parentId,
                id: element.id,
                date: element.date,
                display_title: element.title,
                sub_title: element.title,
                content: element.content,
                ext_link: element.ext_link,
                limit: element.limit,
                [bindVersion]: true,
                status: appConst.STATUS_PUBLISHING,
                display_area: appConst.DA_POPUP
            }
        );
        resolve();
    });
}

function updateElementInPopupListWithBindVersion(element, bindVersion) {
    console.log(`update element in popup list with bind version ${bindVersion} and parent_id = ${element.parent_id}`);
    return new Promise((resolve, reject) => {
        models.bind_notification_detail.update(
            {
                [bindVersion]: true
            },
            {
                where: {
                    id: element.id,
                    parent_id: element.parent_id,
                    delete_flag: false,
                    status: appConst.STATUS_PUBLISHING
                },
            }
        );
        resolve();
    });
}

function addPopupElement(bindVersion) {
    console.log(`add popup element`);
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const bind_notification = models.bind_notification.create(
                {
                    message_type: 'popup',
                }
            );
            cResolve(bind_notification);
        }).then((bind_notification) => {
            const parentId = bind_notification.id;
            models.bind_notification_detail.create(
                {
                    parent_id: parentId,
                    [bindVersion]: true,
                    status: appConst.STATUS_PUBLISHING,
                    display_area: appConst.DA_PARENT
                }
            );
            return parentId;
        }).then((parentId) => {
            resolve(parentId);
        });
    });
}

function updatePopupElementWithBindVersion(item, bindVersion) {
    console.log(`update popup element with bind version ${bindVersion} and parent_id = ${item.id}`);
    return new Promise((resolve, reject) => {
        models.bind_notification_detail.update(
            {
                [bindVersion]: true
            },
            {
                where: {
                    parent_id: item.id,
                    delete_flag: false,
                    status: appConst.STATUS_PUBLISHING,
                    display_area: appConst.DA_PARENT
                },
            }
        );
        resolve(item.id);
    });
}

exports.checkNewsListElement = (notificationData, bindVersion) => {
    return new Promise((resolve, reject) => {
        if (notificationData.hasOwnProperty('news')) {
            const newsList = notificationData.news;
            if (util.isEmpty(newsList)) {
                resolve();
            }
            else {
                const promises = _.map(newsList, (news) => {
                    return checkEachNewsElement(news, bindVersion);
                });
                Promise.all(promises).then(() => {
                    console.log('all promise done');
                    resolve();
                });
            }
        }
        else {
            reject();
        }
    });
};

function checkEachNewsElement(newsElement, bindVersion) {
    return new Promise((resolve, reject) => {
        const newsTitle = newsElement.title;
        new Promise((cResolve, cReject) => {
            const item = models.bind_notification.find({
                where: {
                    message_type: 'news',
                    title: newsTitle,
                },
                include: [
                    {
                        model: models.bind_notification_detail,
                        where: {
                            delete_flag: false,
                            status: appConst.STATUS_PUBLISHING,
                        }
                    }
                ]
            });
            cResolve(item);
        }).then((item) => {
            if (util.isEmpty(item)) {
                // If news not existed, add new news element
                return addNewsElement(newsTitle, bindVersion);
            }
            else {
                // If news existed, update bind version.
                return updateNewsElementWithBindVersion(item, bindVersion);
            }
        }).then((parentId) => {
            console.log(`process check list item in news element with parent id = ${parentId}`);
            const promises = _.map(newsElement.list, (element) => {
                return new Promise((cResolve, cReject) => {
                    const bind_notification_detail = models.bind_notification_detail.find({
                        where: {
                            parent_id: parentId,
                            id: element.id,
                            delete_flag: false,
                            status: appConst.STATUS_PUBLISHING

                        }
                    });
                    cResolve(bind_notification_detail);
                }).then((bind_notification_detail) => {
                    if (util.isEmpty(bind_notification_detail)) {
                        addElementInNewsList(element, parentId, bindVersion);
                    }
                    else {
                        updateElementInNewsListWithBindVersion(bind_notification_detail, bindVersion);
                    }
                });
            });
            Promise.all(promises).then(() => {
                resolve();
            });
        });
    });
}

function addElementInNewsList(element, parentId, bindVersion) {
    console.log(`add new element in news list with  parent_id = ${parentId} & id = ${element.id}`);
    return new Promise((resolve, reject) => {
        // check display area of element
        let displayArea = '';
        if (!util.isEmpty(element.ext_link)) {
            displayArea = appConst.DA_SIDE;
        }
        else if (!util.isEmpty(element.modal_link)) {
            displayArea = appConst.DA_MODAL;
        }
        models.bind_notification_detail.create(
            {
                parent_id: parentId,
                id: element.id,
                date: element.date,
                display_title: element.title,
                sub_title: element.title,
                content: element.content,
                modal_link: element.modal_link,
                ext_link: element.ext_link,
                limit: element.limit,
                [bindVersion]: true,
                status: appConst.STATUS_PUBLISHING,
                display_area: displayArea
            }
        );
        resolve();
    });
}

function updateElementInNewsListWithBindVersion(element, bindVersion) {
    console.log(`update element in news list with bind version ${bindVersion} & parent_id = ${element.parent_id} & id = ${element.id}`);
    return new Promise((resolve, reject) => {
        models.bind_notification_detail.update(
            {
                [bindVersion]: true
            },
            {
                where: {
                    id: element.id,
                    parent_id: element.parent_id,
                    delete_flag: false,
                    status: appConst.STATUS_PUBLISHING
                },
            }
        );
        resolve();
    });
}

function addNewsElement(newsTitle, bindVersion) {
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const bind_notification = models.bind_notification.create(
                {
                    message_type: 'news',
                    title: newsTitle
                }
            );
            cResolve(bind_notification);
        }).then((bind_notification) => {
            const parentId = bind_notification.id;
            models.bind_notification_detail.create(
                {
                    parent_id: parentId,
                    [bindVersion]: true,
                    status: appConst.STATUS_PUBLISHING,
                    display_area: appConst.DA_PARENT
                }
            );
            return parentId;
        }).then((parentId) => {
            resolve(parentId);
        });
    });
}

function updateNewsElementWithBindVersion(item, bindVersion) {
    console.log(`update new element with bind version ${bindVersion} and parent_id = ${item.id}`);
    return new Promise((resolve, reject) => {
        models.bind_notification_detail.update(
            {
                [bindVersion]: true
            },
            {
                where: {
                    parent_id: item.id,
                    delete_flag: false,
                    status: appConst.STATUS_PUBLISHING,
                    display_area: appConst.DA_PARENT
                },
            }
        );
        resolve(item.id);
    });
}

exports.checkAdElement = (notificationData, bindVersion) => {
    return new Promise((resolve, reject) => {
        if (notificationData.hasOwnProperty('ad')) {
            const adElement = notificationData.ad;
            const adTitle = adElement.title;
            const adContent = adElement.content;
            new Promise((cResolve, cReject) => {
                const item = models.bind_notification.find({
                    where: {
                        message_type: 'ad',
                        title: adTitle,
                        content: adContent
                    },
                    include: [
                        {
                            model: models.bind_notification_detail,
                            where: {
                                delete_flag: false,
                                status: appConst.STATUS_PUBLISHING
                            }
                        }
                    ]
                });
                cResolve(item);
            }).then((item) => {
                if (util.isEmpty(item)) {
                    // If ad not existed, add new Ad
                    addNewAd(adTitle, adContent, bindVersion);
                }
                else {
                    // If ad existed, update bind version.
                    updateAdWithBindVersion(item, bindVersion);
                }
                resolve();
            });
        }
        else {
            reject();
        }
    });
};

function updateAdWithBindVersion(item, bindVersion) {
    console.log(`update ad element with bind version ${bindVersion} and parent_id = ${item.id}`);
    return new Promise((resolve, reject) => {
        models.bind_notification_detail.update(
            {
                [bindVersion]: true
            },
            {
                where: {
                    parent_id: item.id,
                    delete_flag: false,
                    status: appConst.STATUS_PUBLISHING
                },
            }
        );
        resolve();
    });
}

function addNewAd(adTitle, adContent, bindVersion) {
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const bind_notification = models.bind_notification.create(
                {
                    message_type: 'ad',
                    title: adTitle,
                    content: adContent,
                }
            );
            cResolve(bind_notification);
        }).then((bind_notification) => {
            const parentId = bind_notification.id;
            models.bind_notification_detail.create(
                {
                    parent_id: parentId,
                    [bindVersion]: true,
                    status: appConst.STATUS_PUBLISHING,
                    display_area: appConst.DA_PARENT,
                }
            );
        }).then(() => {
            resolve();
        });
    });
}

exports.getAllNotifications = () => {
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const items = models.bind_notification_detail.findAll({
                where: {
                    delete_flag: false,
                    display_area: {
                        $ne: appConst.DA_PARENT
                    }
                }
            });
            cResolve(items);
        }).then((items) => {
            const promises = _.map(items, (item) => {
                return buildNotificationItem(item);
            });
            Promise.all(promises).then((output) => {
                resolve(output);
            });
        });
    });
};

exports.findNotificationById = (notificationId) => {
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const bind_notification_detail = models.bind_notification_detail.find({
                where: {
                    id: notificationId,
                    delete_flag: false,
                    display_area: {
                        $ne: appConst.DA_PARENT
                    }
                }
            });
            cResolve(bind_notification_detail);
        }).then((bind_notification_detail) => {
            let output = {};
            const item = buildNotificationItem(bind_notification_detail);
            output['item'] = item;
            return output;
        }).then((output) => {
            getNotificationCategory().then((data) => {
                output['category'] = data;
                resolve(output);
            });
        });
    });
};

function buildNotificationItem(bind_notification_detail) {
    let item = {
        id: bind_notification_detail.id,
        parent_id: bind_notification_detail.parent_id,
        display_title: bind_notification_detail.display_title,
        display_area: bind_notification_detail.display_area,
        date: bind_notification_detail.date,
        sub_title: bind_notification_detail.sub_title,
        is_cld: bind_notification_detail.is_cld,
        is_clt: bind_notification_detail.is_clt,
        is_bind11: bind_notification_detail.is_bind11,
        is_bind11T: bind_notification_detail.is_bind11T,
        is_bind10: bind_notification_detail.is_bind10,
        is_bind10T: bind_notification_detail.is_bind10T,
        is_bind9: bind_notification_detail.is_bind9,
        is_bind9T: bind_notification_detail.is_bind9T,
        status: bind_notification_detail.status,
        start_date: bind_notification_detail.start_date,
        end_date: bind_notification_detail.end_date,
        updated_at: bind_notification_detail.updated_at
    };
    if (bind_notification_detail.display_area === appConst.DA_POPUP) {
        item.url = bind_notification_detail.ext_link;
        item.limit = bind_notification_detail.limit;
    }
    else if (bind_notification_detail.display_area === appConst.DA_MODAL) {
        item.url = bind_notification_detail.modal_link;
    }
    else if (bind_notification_detail.display_area === appConst.DA_SIDE) {
        item.url = bind_notification_detail.ext_link;
    }
    if (util.isEmpty(bind_notification_detail.content.match(/(<img src='[\S]*'>){1}/g))) {
        item.content = bind_notification_detail.content;
    }
    else {
        const imageWithHTMLTag = bind_notification_detail.content.split(/(<img src='[\S]*'>){1}/g)[1];
        item.image_url = imageWithHTMLTag.split(/<img[^>]+src='?([^\s]+)?\s*'>/g)[1];
        item.content = bind_notification_detail.content;
    }
    return item;
}

function getNotificationCategory() {
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const items = models.bind_notification.findAll({
                where: {
                    message_type: 'news',
                },
                include: [
                    {
                        model: models.bind_notification_detail,
                        where: {
                            delete_flag: false,
                            display_area: appConst.DA_PARENT
                        }
                    }
                ]
            });
            cResolve(items);
        }).then((items) => {
            const promises = _.map(items, (item) => {
                return new Promise((cResolve, rReject) => {
                    const category = {
                        id: item.id,
                        title: item.title
                    }
                    cResolve(category);
                });
            });
            Promise.all(promises).then((data) => {
                resolve(data)
            });
        });
    });
}

exports.uploadImage = (notificationId, imageURL) => {
    // Test with development environment
    if (env === 'development') {
        return uploadImageWithSFTP(notificationId, imageURL);
    }
    else {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
};

function uploadImageWithSFTP(notificationId, imageURL) {
    return new Promise((resolve, reject) => {
        console.log(`upload image using sftp`);
        const imageFileName = getImageFileNameFromURL(imageURL);
        const imagePath = tmpFolderPath + /images/ + notificationId + '/' + imageFileName;
        console.log(imagePath);
        const destPath = config.imagePath + imageFileName;
        console.log(destPath);
        sftp.sendImage(imagePath, destPath).then(() => {
            resolve();
        }).catch((err) => {
            console.log('error when send image');
            reject();
        });
    });
}

function getImageFileNameFromURL(imageURL) {
    const arrayList = imageURL.split('/');
    return arrayList[arrayList.length - 1]
}

exports.updateStatus = (notificationId, newStatus) => {
    // Change status from draft to publishing.
    if (newStatus === appConst.STATUS_PUBLISHING) {
        return updateStatusToPublishing(notificationId, newStatus);
    }
    // Change status from publishing to published.
    else {
        return updateStatusToPublished(notificationId, newStatus);
    }
};

function updateStatusToPublishing(notificationId, newStatus) {
    return new Promise((resolve, reject) => {
        const item = models.bind_notification_detail.update(
            {
                status: newStatus,
                start_date: new Date()
            },
            {
                where: {
                    id: notificationId,
                    delete_flag: false
                }
            });
        resolve(item);
    });
}

function updateStatusToPublished(notificationId, newStatus) {
    return new Promise((resolve, reject) => {
        const item = models.bind_notification_detail.update(
            {
                status: newStatus,
                end_date: new Date()
            },
            {
                where: {
                    id: notificationId,
                    delete_flag: false
                }
            });
        resolve(item);
    });
}

exports.buildJsonFile = (notificationId) => {
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const item = models.bind_notification_detail.find({
                where: {
                    id: notificationId,
                    delete_flag: false
                }
            });
            cResolve(item);
        }).then((item) => {
            const promises = _.map(config.version, (version) => {
                if (item[version.code] === true) {
                    return buildNotificationJsonFileByVersion(version.code);
                }
            });
            Promise.all(promises).then((data) => {
                _.map(data, (element) => {
                    if (!util.isEmpty(element)) {
                        uploadJSonFile(element).then(() => {
                            resolve();
                        }).catch((err) => {
                            reject();
                        });
                    }
                });
            });
        });
    });
};

function buildNotificationJsonFileByVersion(bindVersion) {
    return new Promise((resolve, reject) => {
        util.makeDirIfNotExisted(tmpFolderPath);
        util.makeDirIfNotExisted(tmpFolderPath + bindVersion);
        createNotificationOutputData(bindVersion).then((output) => {
            util.writeJson(tmpFolderPath + bindVersion + '/notification.json', output).then(() => {
                resolve(bindVersion);
            })
        });
    })
}

function createNotificationOutputData(bindVersion) {
    return new Promise((resolve, reject) => {
        let output = {};
        buildAdJSONObject(bindVersion).then((data) => {
            output['ad'] = data;
            return output;
        }).then((output) => {
            buildNewsJSONObject(bindVersion).then((data) => {
                output['news'] = data;
                output['schedule'] = [];
                return output;
            }).then((output) => {
                buildPopupJSONObject(bindVersion).then((data) => {
                    output['popup'] = data;
                    resolve(JSON.stringify(output));
                });
            });
        });
    });
};

function uploadJSonFile(bindVersion) {
    // Test with development or test environment
    if (env === 'development' || env === 'test') {
        return uploadJsonFileWithSFTP(bindVersion);
    }
    // Production environment
    else {
        return uploadJsonFileWithFTP(bindVersion);
    }
};

function uploadJsonFileWithFTP(bindVersion) {
    return new Promise((resolve, reject) => {
        console.log(`upload ftp with bind version is ${bindVersion}`);
        const srcPath = tmpFolderPath + bindVersion + '/notification.json';
        console.log(srcPath);
        const promises = _.map(config.version, (version) => {
            return new Promise((cResolve, cReject) => {
                if (version.code === bindVersion) {
                    const destPath = version.notificationPath + `notification_${bindVersion}.json`;
                    console.log(destPath);
                    ftp.sendNotificationFile(srcPath, destPath).then(() => {
                        cResolve();
                    }).catch(() => {
                        console.log('error when send file');
                        reject();
                    });
                }
                else {
                    cResolve();
                }
            });
        });
        Promise.all(promises).then(() => {
            resolve();
        });
    });
}

function uploadJsonFileWithSFTP(bindVersion) {
    return new Promise((resolve, reject) => {
        console.log(`upload sftp with bind version is ${bindVersion}`);
        const srcPath = tmpFolderPath + bindVersion + '/notification.json';
        console.log(srcPath);
        const promises = _.map(config.version, (version) => {
            return new Promise((cResolve, cReject) => {
                if (version.code === bindVersion) {
                    const destPath = version.notificationPath + `notification_${bindVersion}.json`;
                    console.log(destPath);
                    sftp.sendNotificationFile(srcPath, destPath).then(() => {
                        cResolve();
                    }).catch(() => {
                        console.log('error when send file');
                        reject();
                    });
                }
                else {
                    cResolve();
                }
            });
        });
        Promise.all(promises).then(() => {
            resolve();
        });
    });
}

exports.deleteNotification = (notificationId) => {
    return new Promise((resolve, reject) => {
        const item = models.bind_notification_detail.update(
            {
                delete_flag: true,
            },
            {
                where: {
                    id: notificationId,
                    status: appConst.STATUS_PUBLISHED,
                    delete_flag: false
                }
            });
        resolve(item);
    });
};

exports.updateNotification = (notificationId, item) => {
    if (!util.isEmpty(item.pictures) && (!util.isEmpty(item.content.match(/(<img src='[\S]*'>){1}/g)))) {
        saveUpdateImage(item.pictures, item.content, notificationId)
    }
    if (item.display_area === appConst.DA_POPUP) {
        return updateNotificationWithTypePopup(notificationId, item);
    }
    else if (item.display_area === appConst.DA_MODAL) {
        return updateNotificationWithTypeModal(notificationId, item);
    }
    else if (item.display_area === appConst.DA_SIDE) {
        return updateNotificationWithTypeSide(notificationId, item);
    }
    else {
        return new Promise((resolve, reject) => {
           resolve();
        });
    }
};

function updateNotificationWithTypePopup(notificationId, item) {
    return new Promise((resolve, reject) => {
        models.bind_notification_detail.update(
            {
                // parent_id: item.parent_id,
                display_title: item.display_title,
                display_area: item.display_area,
                date: item.date,
                sub_title: item.sub_title,
                is_cld: item.is_cld,
                is_clt: item.is_clt,
                is_bind11: item.is_bind11,
                is_bind11T: item.is_bind11T,
                is_bind10: item.is_bind10,
                is_bind10T: item.is_bind10T,
                is_bind9: item.is_bind9,
                is_bind9T: item.is_bind9T,
                content: item.content.replace(/(")/g, "'"),
                ext_link: item.url,
                limit: item.limit,
                modal_link: null
            },
            {
                where: {
                    id: notificationId,
                    delete_flag: false
                }
            }
        );
        resolve();
    });
}

function updateNotificationWithTypeModal(notificationId, item) {
    return new Promise((resolve, reject) => {
        models.bind_notification_detail.update(
            {
                // parent_id: item.parent_id,
                display_title: item.display_title,
                display_area: item.display_area,
                date: item.date,
                sub_title: item.sub_title,
                is_cld: item.is_cld,
                is_clt: item.is_clt,
                is_bind11: item.is_bind11,
                is_bind11T: item.is_bind11T,
                is_bind10: item.is_bind10,
                is_bind10T: item.is_bind10T,
                is_bind9: item.is_bind9,
                is_bind9T: item.is_bind9T,
                content: item.content.replace(/(")/g, "'"),
                ext_link: null,
                limit: null,
                modal_link: item.url
            },
            {
                where: {
                    id: notificationId,
                    delete_flag: false
                }
            }
        );
        resolve();
    });
}

function updateNotificationWithTypeSide(notificationId, item) {
    return new Promise((resolve, reject) => {
        models.bind_notification_detail.update(
            {
                // parent_id: item.parent_id,
                display_title: item.display_title,
                display_area: item.display_area,
                date: item.date,
                sub_title: item.sub_title,
                is_cld: item.is_cld,
                is_clt: item.is_clt,
                is_bind11: item.is_bind11,
                is_bind11T: item.is_bind11T,
                is_bind10: item.is_bind10,
                is_bind10T: item.is_bind10T,
                is_bind9: item.is_bind9,
                is_bind9T: item.is_bind9T,
                content: item.content.replace(/(")/g, "'"),
                ext_link: item.url,
                limit: null,
                modal_link: null
            },
            {
                where: {
                    id: notificationId,
                    delete_flag: false
                }
            }
        );
        resolve();
    });
}

function saveUpdateImage(pictures, content, notificationId) {
    const imageWithHTMLTag = content.split(/(<img src='[\S]*'>){1}/g)[1];
    const imageURL = imageWithHTMLTag.split(/<img[^>]+src='?([^\s]+)?\s*'>/g)[1];
    const imageFileName = getImageFileNameFromURL(imageURL);
    const encodedString = pictures[0].src.split(',')[1];
    util.makeDirIfNotExisted(tmpFolderPath);
    util.makeDirIfNotExisted(tmpFolderPath + /images/);
    util.makeDirIfNotExisted(tmpFolderPath + /images/ + notificationId);
    const imagePath = tmpFolderPath + /images/ + notificationId + '/' + imageFileName;
    util.writeImage(imagePath, new Buffer(encodedString, 'base64'));
}

exports.getAllCategories = () => {
    return new Promise((resolve, reject) => {
        new Promise((cResolve, cReject) => {
            const items = models.bind_notification.findAll({
                where: {
                    message_type: 'news'
                },
                include: [
                    {
                        model: models.bind_notification_detail,
                        where: {
                            delete_flag: false,
                        }
                    }
                ]
            });
            cResolve(items);
        }).then((items) => {
            const promises = _.map(items, (item) => {
                return buildCategoryItem(item);
            });
            Promise.all(promises).then((output) => {
                resolve(output);
            });
        });
    });
};

function buildCategoryItem(item) {
    const category = {
        category_id: item.id,
        name: item.title
    };
    return category;
}