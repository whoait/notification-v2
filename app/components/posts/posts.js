import React from 'react';
import {
    AutocompleteInput,
    Datagrid,
    DateField,
    DateInput,
    Edit,
    EditButton,
    Filter,
    List,
    LongTextInput,
    NullableBooleanInput,
    ReferenceField,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
    DeleteButton,
} from 'admin-on-rest';

import Status from './Status';

const detailStyle = { display: 'inline-block', verticalAlign: 'top', marginRight: '2em', minWidth: '8em' };
export const PostList = (props) => (
    <List {...props} perPage={25} title="トップページ">
        <Datagrid>
            <TextField source="id" title="ID"/>
            <TextField source="title" label = "タイトル"/>
            {/*<Status/>*/}
            <EditButton style={{ padding: 0 }}  label="ステータス" />
            {/* <NullableBooleanInput source="id"   label="Cld" />
            <NullableBooleanInput source="id"   label="Clt" />
            <NullableBooleanInput source="id"   label="11"/>
            <NullableBooleanInput source="id"   label="11t" />
            <NullableBooleanInput source="id"   label="10"/>
            <NullableBooleanInput source="id"   label="10t"/>
            <NullableBooleanInput source="id"   label="9"/>
            <NullableBooleanInput source="id"   label="9t"/> */}
            <TextField source="id" label="通知エリア"/>
            <DateField source="date" label="編集日時を"/>
            <DateField source="date" label="公開日時"/>
            <DateField source="date" label="終了日時"/>
            <EditButton style={{ padding: 0 }}  label="編集" />
            <DeleteButton style={{ padding: 0 }}  label="削除" />


        </Datagrid>
    </List>
);