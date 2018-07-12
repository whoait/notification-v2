import React, {Component} from 'react';
import {connect} from 'react-redux';
import {EditButton, ListButton} from 'admin-on-rest';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class ButtonBackToEditComponent extends Component {
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    render() {
        const {record} = this.props;
        const basePath = this.props.basePath;
        const actions = [
            <FlatButton
                label="キャンセル"
                primary={true}
                onClick={this.handleClose}
            />,
            <EditButton basePath={basePath}
                        record={record} style={{padding: 0}} label="修正する"/>,
        ];


        return (
            <div>
                <RaisedButton label="一覧へもどる" onClick={this.handleOpen}/>
                <ListButton label="保存する" redirect={false} submitOnEnter={false} raised={false}/>
                <Dialog
                    title="通知"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    保存せずに戻ります。
                </Dialog>
            </div>
        );
    }
}

export default ButtonBackToEditComponent;