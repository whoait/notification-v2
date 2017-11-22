import React, {Component} from 'react';
import {connect} from 'react-redux';
import {SaveButton, ListButton} from 'admin-on-rest';
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
            <ListButton label="OK"  redirect={false} submitOnEnter={false} raised={false}/>,
        ];


        return (
            <div>
                <RaisedButton label="一覧へもどる" onClick={this.handleOpen} />
                <Dialog
                    title="通知"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    The actions in this window were passed in as an array of React objects.
                </Dialog>
            </div>
        );
    }
}

export default CardActionCreateEditComponent;