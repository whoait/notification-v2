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
    ReferenceField,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
} from 'admin-on-rest';

export const PostList = (props) => (
    <List {...props} perPage={25}>
        <Datagrid>
            <TextField source="id" />
            <DateField source="date" />
            <TextField source="title" />
        </Datagrid>
    </List>
);