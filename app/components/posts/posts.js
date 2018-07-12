import React from 'react';
import {
    translate,
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
    BooleanInput,
    ShowButton,
    ListButton,
    SaveButton,
    Toolbar,
    FunctionField,
    regex
} from 'admin-on-rest';

import {CardActions} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DeleteCustomButton from './DeleteCustomButton';
import EditCustomButton from './EditCustomButton';
import rowStyle from './rowStyle';
import StatusButton from './StatusButton';
import ConfirmComponent from './ConfirmComponent';
import ToolBarCreateEditComponent from './ToolBarCreateEditComponent';
import CardActionCreateEditComponent from './CardActionCreateEditComponent';
import {DependentInput} from 'aor-dependent-input';
// area css--start
const detailStyle = {display: 'inline-block', verticalAlign: 'top', marginRight: '2em', minWidth: '8em'};
const style = {margin: 12,};
const confirmStyle = {fontSize: 22, textAlign: 'center', fontWeight: 'bold'};

// area css--end
const DisplayAreaField = ({record = {}}) => {
    if (record.display_area === 1) {
        return (<span>サイド </span>);
    }
    if (record.display_area === 2) {
        return (<span>モーダル </span>);
    }
    if (record.display_area === 3) {
        return (<span>ポップアップ </span>);
    }
    return (<span></span>);

}
DisplayAreaField.defaultProps = {label: 'ステータス'};


export const PostList = (props) => (
    <List {...props} perPage={20} title="トップページ">
        <Datagrid rowStyle={rowStyle}>
            <TextField source="display_title" label="タイトル"
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
            <DateField source="updated_at" showTime label="編集日時を"/>
            <DateField source="start_date" showTime label="公開日時"/>
            <DateField source="end_date" showTime label="終了日時"/>
            <EditCustomButton style={{padding: 0}} label={'customNotification.button.edit'} />
            <DeleteCustomButton style={{padding: 0}} label={'customNotification.button.delete'} />

        </Datagrid>
    </List>
);

export const PostCreate = (props) => (
    <Create actions={<PostCreateEditActions/>} {...props}>
        <SimpleForm toolbar={<PostCreateEditToolbar/>}>
            <LongTextInput source="display_title" label="管理タイトル" validate={required}/>
            <BooleanInput source="is_cld" label="クラウド" defaultValue={true}/>
            <BooleanInput source="is_clt" label="クライアント" defaultValue={true}/>
            <BooleanInput source="is_bind11" label="BiND11" defaultValue={true}/>
            <BooleanInput source="is_bind11T" label="BiND11 体験版" defaultValue={true}/>
            <BooleanInput source="is_bind10" label="BiND10" defaultValue={true}/>
            <BooleanInput source="is_bind10T" label="BiND10 体験版" defaultValue={true}/>
            <BooleanInput source="is_bind9" label="BiND9" defaultValue={true}/>
            <BooleanInput source="is_bind9T" label="BiND9 体験版" defaultValue={true}/>
            <SelectInput source="display_area" label="通知エリア" defaultValue={1} choices={[
                {id: 1, name: 'サイド'},
                {id: 2, name: 'モーダル'},
                {id: 3, name: 'ポップアップ'},
            ]}
                         validate={required}
            />
            <TextField source="xxxxxx" label="掲載情報" style={{font: 'italic bold 50px/30px Georgia, serif'}}/>

            <DateInput source="date" label="日付" locales="ja-jp"/>
            <DependentInput dependsOn="display_area" resolve={checkNew}>
                <ReferenceInput source="parent_id" reference="categories" label='カテゴリ' defaultValue={3}>
                    <SelectInput optionText="name"/>
                </ReferenceInput>
            </DependentInput>
            <LongTextInput source="sub_title" label="タイトル" validate={required}/>
            <ImageInput source="pictures" label="画像" accept="image/*" placeholder={<p>こちらにファイルを入れてください。</p>}>
                <ImageField source="src" title="title"/>
            </ImageInput>

            <ImageField source="image_url" title="old image"/>
            <LongTextInput source="content" label="本文"/>
            {/*<LongTextInput source="content_button" label="ボタンテキスト"/>*/}
            <LongTextInput source="url" label="リンク URL" validate={[required, validateUrl]}/>
            <DependentInput dependsOn="display_area" resolve={checkPopup}>
                <SelectInput source="limit" label="表示回数" defaultValue={3} choices={choicesLimit}/>
            </DependentInput>
        </SimpleForm>
    </Create>
);
const choicesLimit = [
    {id: 1, name: '1 回'},
    {id: 2, name: '2 回'},
    {id: 3, name: '3 回'},
    {id: 4, name: '4 回'},
    {id: 5, name: '5 回'},
    {id: 6, name: '6 回'},
    {id: 7, name: '7 回'},
    {id: 8, name: '8 回'},
    {id: 9, name: '9 回'},
    {id: 10, name: '10 回'}];
const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};
const regexURL = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
const validateUrl = regex(regexURL, 'URLでなければなりません。');
const checkPopup = (value) => value === 3 ? true : false;
const checkNew = (value) => (value === 1 || value === 2) ? true : false;
const PostCreateEditActions = ({basePath, data}) => (
    <CardActions style={cardActionStyle}>
        <CardActionCreateEditComponent/>
    </CardActions>
);

const PostCreateEditToolbar = ({handleSubmitWithRedirect, record, upload = false}) =>
    <Toolbar handleSubmitWithRedirect={handleSubmitWithRedirect} record = {record} upload={upload}>
        <ToolBarCreateEditComponent upload={upload} record = {record}/>
    </Toolbar>;

export const PostEdit = (props) => (
    <Edit actions={<PostCreateEditActions/>} {...props} record = {props} >
        <SimpleForm toolbar={<PostCreateEditToolbar upload={true} record = {props}/>}>
            <LongTextInput source="display_title" label="管理タイトル" validate={required}/>
            <BooleanInput source="is_cld" label="クラウド"/>
            <BooleanInput source="is_clt" label="クライアント"/>
            <BooleanInput source="is_bind11" label="BiND11"/>
            <BooleanInput source="is_bind11T" label="BiND11 体験版"/>
            <BooleanInput source="is_bind10" label="BiND10"/>
            <BooleanInput source="is_bind10T" label="BiND10 体験版"/>
            <BooleanInput source="is_bind9" label="BiND9"/>
            <BooleanInput source="is_bind9T" label="BiND9 体験版"/>

            <SelectInput source="display_area" label="通知エリア" choices={[
                {id: 1, name: 'サイド'},
                {id: 2, name: 'モーダル'},
                {id: 3, name: 'ポップアップ'},
            ]}
                         validate={required}
            />
            <TextField source="xxxxxx" label="掲載情報" style={{font: 'italic bold 50px/30px Georgia, serif'}}/>

            <DateInput source="date" label="日付" locales="ja-jp"/>
            <DependentInput dependsOn="display_area" resolve={checkNew}>
                <ReferenceInput source="parent_id" reference="categories" label='カテゴリ'>
                    <SelectInput source="name"/>
                </ReferenceInput>
            </DependentInput>
            <LongTextInput source="sub_title" label="タイトル" validate={required}/>
            <ImageInput source="pictures" label="画像" accept="image/*" placeholder={<p>こちらにファイルを入れてください。</p>}>
                <ImageField source="src" title="title"/>
            </ImageInput>

            <ImageField source="image_url" title="old image"/>
            <LongTextInput source="content" label="本文"/>
            {/*<LongTextInput source="content_button" label="ボタンテキスト"/>*/}
            <LongTextInput source="url" label="リンク URL" validate={[required, validateUrl]}/>
            <DependentInput dependsOn="display_area" resolve={checkPopup}>
                <SelectInput source="limit" label="表示回数" defaultValue={3} choices={choicesLimit}/>
            </DependentInput>
        </SimpleForm>
    </Edit>
);

// const showDisplayArea = (record) => {
//     if (record.display_area === 0) return 'サイド';
//     if (record.display_area === 1) return 'モーダル';
//     if (record.display_area === 2) return 'ポップアップ';
//     return '';
// }
//
// const showLimit = (record) => {
//     return `${record.limit} 回`
// }
// const showBindVersionApply = (record) => {
//     var textReturn = '';
//     if (record.is_cld) { // noinspection JSAnnotator
//         textReturn += 'クラウド';
//     }
//     if (record.is_clt) { // noinspection JSAnnotator
//         textReturn += '        クライアント';
//     }
//     if (record.is_bind11) { // noinspection JSAnnotator
//         textReturn += '        BiND11';
//     }
//     if (record.is_bind11T) { // noinspection JSAnnotator
//         textReturn += '        BiND11 体験版';
//     }
//     if (record.is_bind10) { // noinspection JSAnnotator
//         textReturn += '        BiND10';
//     }
//     if (record.is_bind10T) { // noinspection JSAnnotator
//         textReturn += '        BiND10 体験版';
//     }
//     if (record.is_bind9) { // noinspection JSAnnotator
//         textReturn += '        BiND9';
//     }
//     if (record.is_bind9T) { // noinspection JSAnnotator
//         textReturn += '        BiND9 体験版';
//     }
//
//     return textReturn;
// }
// export const PostShow = (props) => (
//     <Show actions={<PostCreateEditActions/>} {...props}>
//         <SimpleShowLayout >
//             <TextField source="display_title" label="管理タイトル" validate={required}/>
//             {/*<BooleanField source="is_cld" label="Cld"/>*/}
//             {/*<BooleanField source="is_clt" label="Clt"/>*/}
//             {/*<BooleanField source="is_bind11" label="11"/>*/}
//             {/*<BooleanField source="is_bind11T" label="11t"/>*/}
//             {/*<BooleanField source="is_bind10" label="10"/>*/}
//             {/*<BooleanField source="is_bind10T" label="10t"/>*/}
//             {/*<BooleanField source="is_bind9" label="9"/>*/}
//             {/*<BooleanField source="is_bind9T" label="9t"/>*/}
//
//             <FunctionField label="通知対象" render={showBindVersionApply}/>
//
//             <FunctionField label="通知エリア" render={showDisplayArea}/>
//
//             <TextField source="xxxxxx" label="掲載情報" style={{font: 'italic bold 50px/30px Georgia, serif'}}/>
//
//             <DateField source="date" label="日付" locales="ja-jp"/>
//
//             <ReferenceField source="parent_id" reference="categories" label='カテゴリ' linkType={false}>
//                 <TextField source="name"/>
//             </ReferenceField>
//
//             <TextField source="sub_title" label="タイトル"/>
//
//             {/*<ImageField source="src"  label="title"/>*/}
//
//             <ImageField source="image_url" title="画像"/>
//             <TextField source="content" label="本文"/>
//
//             {/*<LongTextInput source="content_button" label="ボタンテキスト"/>*/}
//             <TextField source="url" label="リンク URL"/>
//             <DependentInput dependsOn="display_area" resolve={checkPopup}>
//                 <FunctionField label="表示回数" render={showLimit}/>
//             </DependentInput>
//             <ConfirmComponent/>
//         </SimpleShowLayout>
//     </Show>
// );