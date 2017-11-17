import React, {Component} from 'react';
import {connect} from 'react-redux';
import {EditButton, ListButton} from 'admin-on-rest';

class ConfirmComponent extends Component {
    render() {
        const {record} = this.props;
        const basePath = this.props.basePath;
        const confirmStyle = {fontSize: 22, textAlign: 'center', fontWeight: 'bold'};
        return (

            <div style={confirmStyle}>
                <div style={confirmStyle}>
                    <span>この内容で間違いありませんか？</span>
                </div>
                <EditButton basePath={basePath}
                            record={record} style={{padding: 0}} label="修正する"/>
                <ListButton label="保存する" redirect={false} submitOnEnter={false} raised={false}/>
            </div>

        );

    }
}

export default ConfirmComponent;