import React from 'React';
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
    FileInput,
    FileField,
} from 'admin-on-rest';


export const UploadList = (props) => (
    <List {...props} perPage={25} title="トップページ">
        <Datagrid >
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


export const UploadCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <SelectInput source="bindVersion" label="通知対象" choices={[
                {id: 'is_cld', name: 'クラウド'},
                {id: 'is_clt', name: 'クライアント'},
                {id: 'is_bind11', name: 'BiND11'},
                {id: 'is_bind11T', name: 'BiND11 体験版'},
                {id: 'is_bind10', name: 'BiND10'},
                {id: 'is_bind10T', name: 'BiND10 体験版'},
                {id: 'is_bind9', name: 'BiND9'},
                {id: 'is_bind9T', name: 'BiND9 体験版'},
            ]}/>

            <FileInput source="files" label="Related files"  placeholder={<p>こちらにファイルを入れてください。</p>}>
                <FileField source="src" title="title" />
            </FileInput>
        </SimpleForm>
    </Create>
);