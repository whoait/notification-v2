import React, { Component } from 'react';

import {simpleRestClient, fetchUtils, jsonServerRestClient, Admin, Resource} from 'admin-on-rest';
import {PostList, PostCreate } from './posts/posts';

import myApiRestClient  from './restClient';


class IndexNotification extends Component {

    render() {
        return (
            <Admin title="通知エリア管理システム" restClient={myApiRestClient('http://localhost:3000')}>
                <Resource name="posts" options={{ label: 'トップページ' }} list={PostList} create={PostCreate}/>
            </Admin>
        )
    }
}

export default IndexNotification;