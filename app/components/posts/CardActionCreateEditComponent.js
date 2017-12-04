import React, {Component} from 'react';
import {connect} from 'react-redux';
import {SaveButton, ListButton, translate} from 'admin-on-rest';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class CardActionCreateEditComponent extends Component {
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

        const actions = [
            <FlatButton
                label="キャンセル"
                primary={true}
                onClick={this.handleClose}
            />,
            <ListButton label={'customNotification.button.ok'} redirect={false} submitOnEnter={false} raised={false}/>,
        ];


        return (
            <div>
                <RaisedButton label="一覧へもどる" onClick={this.handleOpen}/>
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

export default CardActionCreateEditComponent;