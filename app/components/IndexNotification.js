import React, { Component } from 'react';

import {simpleRestClient, fetchUtils, jsonServerRestClient, Admin, Resource, Delete} from 'admin-on-rest';
import {PostList, PostCreate } from './posts/posts';
import japaneseMessages from 'aor-language-japanese';
import myApiRestClient  from './restClient';
import addUploadFeature from './addUploadFeature';

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
            <Admin locale="ja" messages={messages} title="通知エリア管理システム" restClient={delayedRestClient}>
                <Resource name="posts" options={{ label: 'トップページ' }} list={PostList} create={PostCreate} remove={Delete}/>
            </Admin>
        )
    }
}

export default IndexNotification;