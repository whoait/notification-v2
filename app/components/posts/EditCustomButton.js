import React, {Component} from 'react';
import {EditButton} from 'admin-on-rest';


class EditCustomButton extends Component {

    render() {
        const {record} = this.props;
        const basePath = this.props.basePath;
        const label = this.props.label;
        if (record.status === 2) {
            return (<div></div>);
        } else {
            return (
                <EditButton
                    basePath={basePath}
                    record={record}
                    label={label}
                />
            );
        }

    }
}

export default EditCustomButton;
