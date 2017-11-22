import React, {Component} from 'react';
import {connect} from 'react-redux';
import {EditButton, ListButton} from 'admin-on-rest';
import ButtonBackToEditComponent from './ButtonBackToEditComponent';

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
                <ButtonBackToEditComponent record = {record} basePath = {basePath}/>

            </div>

        );

    }
}

export default ConfirmComponent;