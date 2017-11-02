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
    Create,
    CheckboxGroupInput,
    ImageInput,
    ImageField,
} from 'admin-on-rest';

import Status from './Status';
import rowStyle from './rowStyle';

const detailStyle = {display: 'inline-block', verticalAlign: 'top', marginRight: '2em', minWidth: '8em'};
export const PostList = (props) => (
    <List {...props} perPage={25} title="トップページ">
        <Datagrid rowStyle={rowStyle}>
            <TextField source="title" label="タイトル"
                       style={{maxWidth: '18em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}/>
            {/*<Status/>*/}
            <EditButton style={{padding: 0}} label="ステータス"/>
            <BooleanField source="is_cld" defaultValue={false} label="Cld"/>
            <BooleanField source="is_dlt" defaultValue={true} label="Clt"/>
            <BooleanField source="is_bind11" label="11"/>
            <BooleanField source="is_bind11T" label="11t"/>
            <BooleanField source="is_bind10" label="10"/>
            <BooleanField source="is_bind10T" label="10t"/>
            <BooleanField source="is_bind9" label="9"/>
            <BooleanField source="is_bind9T" label="9t"/>
            <TextField source="modal_link" label="通知エリア"/>
            <DateField source="edit_date" label="編集日時を"/>
            <DateField source="start_date" label="公開日時"/>
            <DateField source="end_date" label="終了日時"/>
            <EditButton style={{padding: 0}} label="編集"/>
            <DeleteButton style={{padding: 0}} label="削除"/>

        </Datagrid>
    </List>
);

export const PostCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" label="管理タイトル"/>
            <CheckboxGroupInput source="bindversion" label="通知対象" choices={[
                {id: 'programming', name: 'クラウド'},
                {id: 'lifestyle', name: 'クライアント'},
                {id: 'photography', name: 'BiND10'},
                {id: '1', name: 'BiND10 体験版'},
                {id: 'photog2raphy', name: 'BiND9'},
                {id: 'phot3ography', name: 'BiND9 体験版'},
            ]}/>
            <SelectInput source="modal_link" label="通知エリア" choices={[
                {id: '1x', name: 'サイド'},
                {id: '2x', name: 'モーダル'},
                {id: '3x', name: 'ポップアップ'},
            ]}/>
            <TextField source="xxxxxx" label="掲載情報" style={{font: 'italic bold 12px/30px Georgia, serif'}}/>

            <SelectInput source="xxxxx" label="カテゴリ" choices={[
                {id: '1x', name: '重要なお知らせ1'},
                {id: '2x', name: '重要なお知らせ2'},
                {id: '3x', name: '重要なお知らせ3'},
            ]}/>
            <TextInput source="ticxcvcxxvtle" label="タイトル"/>
            <ImageInput source="pictures" label="画像" accept="image/*" placeholder={<p>Drop your file here</p>}>
                <ImageField source="src" title="title"/>
            </ImageInput>
            <LongTextInput source="body" label="本文"/>
            <TextInput source="titlze" label="ボタンテキスト"/>
            <TextInput source="titxle" label="リンク URL"/>

            <SelectInput source="xxxxxx" label="表示回数" choices={[
                {id: '1', name: '3 回'},
                {id: '2', name: '2 回'},
                {id: '3', name: '1 回'},
            ]}/>
        </SimpleForm>
    </Create>
);