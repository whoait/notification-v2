'use strict';

const models = require('../models');
const util = require('../util/util');
const appConst = require('../util/const');
const _ = require('underscore');

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
            const adObject = {
                title: item.title,
                content: item.content
            };
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
}

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