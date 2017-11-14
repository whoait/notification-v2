import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {connect} from 'react-redux';
import {TextField, DeleteButton} from 'admin-on-rest';
import { ChangeStatusSubmit as changeStatusSubmitAction } from './ChangeStatusAction';


class StatusButton extends Component {
    state = {
        open: false,
        disable: true,
    };
    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({disable: true, open: false});
    };
    handleSubmit = () => {
        const valueChoise =  this.refs.valueStatus.getSelectedValue();

        const { ChangeStatusSubmit, record } = this.props;
        ChangeStatusSubmit(record.id, record, valueChoise);
        console.log(valueChoise);
        console.log(this.props);


        this.setState({ disable: !this.state.disable, open: false});
    }

    handleChooseStatus = () => {
        this.setState({disable: false, });
    }

    render() {
        const styles = {
            radioButton: {
                marginTop: 16,
            },
        };
        const {record} = this.props;
        const basePath = this.props.basePath;
        var nameStatusButton = "下書き";
        var labelRadio = [];
        var valueRadio = [];
        const radios = [];

        if (record.status === 0) {
            nameStatusButton = "下書き";
            labelRadio = ["公開中", "公開終了"];
            valueRadio = [1,2];
        }
        ;
        if (record.status === 1) {
            nameStatusButton = "公開中";
            labelRadio = ["下書き", "公開終了"];
            valueRadio = [0,2];
        }
        ;
        if (record.status === 2) {
            nameStatusButton = "公開終了";
            labelRadio = ["下書き", "公開中"];
            valueRadio = [0,1];
        }
        ;

        for (let i = 0; i < labelRadio.length; i++) {
            radios.push(
                <RadioButton
                    key={i}
                    value={valueRadio[i]}
                    label={labelRadio[i]}
                    style={styles.radioButton}
                />
            );
        }
        const actions = [
            <FlatButton
                label="キャンセル"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="提出する"
                primary={true}
                disabled = {this.state.disable}
                keyboardFocused={true}
                onClick={this.handleSubmit}
            />,
        ];

        return (
            <div>
                <RaisedButton primary={true} basepath={basePath}
                              record={record} label={nameStatusButton} onClick={this.handleOpen}/>
                <Dialog
                    title="ステータス変更"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                >
                    <RadioButtonGroup name="valueStatus" ref="valueStatus" onChange={this.handleChooseStatus}>
                        {radios}
                    </RadioButtonGroup>
                </Dialog>
            </div>
        );

    }
}

StatusButton.propTypes = {
    record: PropTypes.object,
    valueChoise: PropTypes.object,
    ChangeStatusSubmit: PropTypes.func,

};

export default connect(null, {
    ChangeStatusSubmit: changeStatusSubmitAction,
})(StatusButton);

