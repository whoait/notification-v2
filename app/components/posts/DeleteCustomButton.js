import React, {Component} from 'react';
import {connect} from 'react-redux';
import {DeleteButton} from 'admin-on-rest';


class DeleteCustomButton extends Component {

    render() {
        const {record} = this.props;
        const basePath = this.props.basePath;
        if (record.status === 2) {
            return (
                <DeleteButton
                    basePath={basePath}
                    record={record}
                />
            );
        } else {
            return (<div></div>);
        }

    }
}

export default DeleteCustomButton;
