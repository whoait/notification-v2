import React, {Component} from 'react';
import {connect} from 'react-redux';
import {TextField, DeleteButton} from 'admin-on-rest';


class StatusButton extends Component {

    render() {
        const {record} = this.props;
        const basePath = this.props.basePath;
        var nameStatusButton = "下書き";
        if (record.status === 0) {
            nameStatusButton = "下書き";
        }
        ;
        if (record.status === 1) {
            nameStatusButton = "公開中";
        }
        ;
        if (record.status === 2) {
            nameStatusButton = "公開終了";
        }
        ;

        return (
            <DeleteButton
                basePath={basePath}
                record={record}
                label  = {nameStatusButton}
            />
        );

    }
}

export default StatusButton;
