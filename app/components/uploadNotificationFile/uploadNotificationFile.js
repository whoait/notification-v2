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