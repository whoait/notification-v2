import React, {Component} from 'react';

import {simpleRestClient, fetchUtils, jsonServerRestClient, Admin, Resource, Delete} from 'admin-on-rest';
import {PostList, PostCreate, PostEdit, PostShow} from './posts/posts';
import {UploadCreate, UploadList} from './uploadNotificationFile/uploadNotificationFile';
import japaneseMessages from 'aor-language-japanese';
import myApiRestClient from './restClient';
import addUploadFeature from './addUploadFeature';
import Menu from './menu/Menu'
// import sagas from './sagas';

const restClient = myApiRestClient('');
const uploadCapableClient = addUploadFeature(restClient);
const delayedRestClient = (type, resource, params) =>
    new Promise(resolve =>
        setTimeout(
            () => resolve(uploadCapableClient(type, resource, params)),
            1000
        )
    );

const messages = {
    'ja': japaneseMessages,
};


class IndexNotification extends Component {

    render() {
        return (
            <Admin menu = {Menu} locale="ja" messages={messages} title="通知エリア管理システム"  restClient={delayedRestClient}>
                <Resource name="posts" options={{label: 'トップページ'}} list={PostList} create={PostCreate} edit={PostEdit}
                          remove={Delete} show = {PostShow} />
                <Resource name="uploadNotificationFile" options={{label: 'アップロードファイルjson'}} list={UploadList}
                          create={UploadCreate}/>
                <Resource name="categories" />
            </Admin>
        )
    }
}

export default IndexNotification;