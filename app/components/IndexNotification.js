import React, { Component } from 'react';

import {simpleRestClient, jsonServerRestClient, Admin, Resource} from 'admin-on-rest';
import {PostList} from './posts/posts';
import myApiRestClient  from './restClient';

class IndexNotification extends Component {

    render() {
        return (
            <Admin title="通知エリア管理システム" restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
                <Resource name="posts" list={PostList}/>
            </Admin>
        )
    }
}

export default IndexNotification;