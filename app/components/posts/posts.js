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
    SimpleShowLayout,
    TextField,
    TextInput,
    DeleteButton,
    Create,
    Show,
    CheckboxGroupInput,
    ImageInput,
    ImageField,
    required,
    BooleanInput
} from 'admin-on-rest';

import DeleteCustomButton from './DeleteCustomButton';
import rowStyle from './rowStyle';
import StatusButton from './StatusButton';

const detailStyle = {display: 'inline-block', verticalAlign: 'top', marginRight: '2em', minWidth: '8em'};



const DisplayAreaField = ({record = {}}) => {
    if (record.display_area === 0) {
        return (<span>サイド </span>);
    }
    if (record.display_area === 1) {
        return (<span>モーダル </span>);
    }
    if (record.display_area === 2) {
        return (<span>ポップアップ </span>);
    }
    return (<span></span>);

}
DisplayAreaField.defaultProps = {label: 'ステータス'};


export const PostList = (props) => (
    <List {...props} perPage={20} title="トップページ">
        <Datagrid rowStyle={rowStyle}>
            <TextField source="sub_title" label="タイトル"
                       style={{maxWidth: '18em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}/>
            <StatusButton source="status" style={{padding: 0}} label="ステータス"/>
            <BooleanField source="is_cld" label="Cld"/>
            <BooleanField source="is_clt" label="Clt"/>
            <BooleanField source="is_bind11" label="11"/>
            <BooleanField source="is_bind11T" label="11t"/>
            <BooleanField source="is_bind10" label="10"/>
            <BooleanField source="is_bind10T" label="10t"/>
            <BooleanField source="is_bind9" label="9"/>
            <BooleanField source="is_bind9T" label="9t"/>
            <DisplayAreaField source="display_area" label="通知エリア"/>
            <DateField source="updated_at"  showTime  label="編集日時を"/>
            <DateField source="start_date" showTime  label="公開日時"/>
            <DateField source="end_date"  showTime label="終了日時"/>
            <EditButton style={{padding: 0}} label="編集"/>
            <DeleteCustomButton style={{padding: 0}} label="削除"/>

        </Datagrid>
    </List>
);

export const PostCreate = (props) => (
    <Create {...props}>
        <SimpleForm redirect="show">
            <TextInput source="sub_title" label="管理タイトル"/>
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
                {id: '1', name: '1 回'},
                {id: '2', name: '2 回'},
                {id: '3', name: '3 回'},
                {id: '4', name: '4 回'},
                {id: '5', name: '5 回'},

            ]}/>
        </SimpleForm>
    </Create>
);

export const PostEdit = (props) => (
    <Edit {...props}>
        <SimpleForm redirect="show">
            <TextInput source="sub_title" label="管理タイトル" validate={required}/>
            <BooleanInput source="is_cld" label="Cld"/>
            <BooleanInput source="is_dlt" label="Clt"/>
            <BooleanInput source="is_bind11" label="11"/>
            <BooleanInput source="is_bind11T" label="11t"/>
            <BooleanInput source="is_bind10" label="10"/>
            <BooleanInput source="is_bind10T" label="10t"/>
            <BooleanInput source="is_bind9" label="9"/>
            <BooleanInput source="is_bind9T" label="9t"/>

            <SelectInput source="modal_link" label="通知エリア" choices={[
                {id: '0', name: 'サイド'},
                {id: '1', name: 'モーダル'},
                {id: '2', name: 'ポップアップ'},
            ]}
                         validate={required}
            />
            <TextField source="xxxxxx" label="掲載情報" style={{font: 'italic bold 12px/30px Georgia, serif'}}/>

            <SelectInput source="xxxxx" label="カテゴリ" choices={[
                {id: '1x', name: '重要なお知らせ1'},
                {id: '2x', name: '重要なお知らせ2'},
                {id: '3x', name: '重要なお知らせ3'},
            ]}/>
            <TextInput source="ub_title" label="タイトル"/>
            <ImageInput source="pictures" label="画像" accept="image/*" placeholder={<p>Drop your file here</p>}>
                <ImageField source="src" title="title"/>
            </ImageInput>
            <LongTextInput source="content" label="本文"/>
            <TextInput source="content" label="ボタンテキスト"/>
            <TextInput source="modal_link" label="リンク URL"/>

            <SelectInput source="limit" label="表示回数" choices={[
                {id: '1', name: '1 回'},
                {id: '2', name: '2 回'},
                {id: '3', name: '3 回'},
                {id: '4', name: '4 回'},
                {id: '5', name: '5 回'},

            ]}/>
        </SimpleForm>
    </Edit>
);

export const PostShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="sub_title" label="管理タイトル" validate={required}/>
            {/*<BooleanInput source="is_cld"  label="Cld"/>*/}
            {/*<BooleanInput source="is_dlt"  label="Clt"/>*/}
            {/*<BooleanInput source="is_bind11" label="11"/>*/}
            {/*<BooleanInput source="is_bind11T" label="11t"/>*/}
            {/*<BooleanInput source="is_bind10" label="10"/>*/}
            {/*<BooleanInput source="is_bind10T" label="10t"/>*/}
            {/*<BooleanInput source="is_bind9" label="9"/>*/}
            {/*<BooleanInput source="is_bind9T" label="9t"/>*/}

            {/*<SelectInput source="modal_link" label="通知エリア" choices={[*/}
            {/*{id: '0', name: 'サイド'},*/}
            {/*{id: '1', name: 'モーダル'},*/}
            {/*{id: '2', name: 'ポップアップ'},*/}
            {/*]}*/}
            {/*validate={required}*/}
            {/*/>*/}
            {/*<TextField source="xxxxxx" label="掲載情報" style={{font: 'italic bold 12px/30px Georgia, serif'}}/>*/}

            {/*<SelectInput source="xxxxx" label="カテゴリ" choices={[*/}
            {/*{id: '1x', name: '重要なお知らせ1'},*/}
            {/*{id: '2x', name: '重要なお知らせ2'},*/}
            {/*{id: '3x', name: '重要なお知らせ3'},*/}
            {/*]}/>*/}
            <TextField source="ub_title" label="タイトル"/>
            {/*<ImageInput source="pictures" label="画像" accept="image/*" placeholder={<p>Drop your file here</p>}>*/}
            {/*<ImageField source="src" title="title"/>*/}
            {/*</ImageInput>*/}
            {/*<LongTextInput source="content" label="本文"/>*/}
            <TextField source="content" label="ボタンテキスト"/>
            <TextField source="modal_link" label="リンク URL"/>

            {/*<SelectInput source="limit" label="表示回数" choices={[*/}
            {/*{id: '1', name: '3 回'},*/}
            {/*{id: '2', name: '2 回'},*/}
            {/*{id: '3', name: '1 回'},*/}
            {/*]}/>*/}
        </SimpleShowLayout>
    </Show>
);