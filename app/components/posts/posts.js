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
    BooleanField,
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
            {/*<TextField source="id" title="ID"/>*/}
            <TextField source="title" label = "タイトル"/>
            {/*<Status/>*/}
            <EditButton style={{ padding: 0 }}  label="ステータス" />
            <BooleanField  source="is_cld"  defaultValue={false}  label="Cld" />
            <BooleanField source="is_dlt"   defaultValue={true}  label="Clt" />
            <BooleanField source="is_bind11"   label="11"/>
            <BooleanField source="is_bind11T"   label="11t" />
            <BooleanField source="is_bind10"   label="10"/>
            <BooleanField source="is_bind10T"   label="10t"/>
            <BooleanField source="is_bind9"   label="9"/>
            <BooleanField source="is_bind9T"   label="9t"/>
            <TextField source="modal_link" label="通知エリア"/>
            <DateField source="edit_date" label="編集日時を"/>
            <DateField source="start_date" label="公開日時"/>
            <DateField source="end_date" label="終了日時"/>
            <EditButton style={{ padding: 0 }}  label="編集" />
            <DeleteButton style={{ padding: 0 }}  label="削除" />


        </Datagrid>
    </List>
);