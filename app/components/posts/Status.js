import React from 'react';
import { ReferenceField, TextField } from 'admin-on-rest';

const Status = (props) => (
    <ReferenceField label="ステータス" source="status_id" reference="status" {...props}>
        <TextField source="reference" />
    </ReferenceField>
)
Status.defaultProps = {
    source: 'status_id',
    addLabel: true,
};

export default Status;
