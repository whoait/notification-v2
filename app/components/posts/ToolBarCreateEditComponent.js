import React, {Component} from 'react';
import {connect} from 'react-redux';
import {SaveButton, ListButton,translate} from 'admin-on-rest';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class ToolBarCreateEditComponent extends Component {
    state = {
        openConfirmList: false,
        openConfirmSave: false,

    };

    handleOpenConfirmLSave = () => {
        this.setState({openConfirmSave: true});
        //console.log(this.props);
    };

    handleCloseConfirmSave = () => {
        this.setState({openConfirmSave: false});
    };

    handleOpenConfirmList = () => {
        this.setState({openConfirmList: true});
    };

    handleCloseConfirmList = () => {
        this.setState({openConfirmList: false});
    };


    render() {
        const style = {
            margin: 12,
        };
        //console.log(this.props);
        const nameButtonSave = this.props.upload === false ? "確認する" : "保存して、公開します。";
        const nameButtonSaveTranslate = this.props.upload === false ? 'customNotification.button.save' : 'customNotification.button.save_and_public';
        const actionsConfirmList = [
            <FlatButton
                label="キャンセル"
                primary={true}
                onClick={this.handleCloseConfirmList}
            />,
            <ListButton label={'customNotification.button.ok'} redirect={false} submitOnEnter={false} raised={false}/>,
        ];


        const actionsConfirmSave = [
            <FlatButton
                label="キャンセル"
                primary={true}
                onClick={this.handleCloseConfirmSave}
            />,
            <SaveButton label={nameButtonSaveTranslate} handleSubmitWithRedirect={this.props.handleSubmitWithRedirect}
                        submitOnEnter={true} redirect = "list"/>,
        ];

        return (
            <div>
                <RaisedButton label="キャンセル" onClick={this.handleOpenConfirmList} primary={true} style={style}/>
                {/*dialog confirm back button*/}
                <Dialog
                    title="通知"
                    actions={actionsConfirmList}
                    modal={false}
                    open={this.state.openConfirmList}
                    onRequestClose={this.handleCloseConfirmList}
                >
                    保存せずに戻ります。
                </Dialog>


                <RaisedButton label={nameButtonSave} onClick={this.handleOpenConfirmLSave} primary={true} style={style}/>
                {/*dialog confirm save button*/}
                <Dialog
                    title="通知"
                    actions={actionsConfirmSave}
                    modal={false}
                    open={this.state.openConfirmSave}
                    onRequestClose={this.handleCloseConfirmSave}
                >
                    <span>この内容で間違いありませんか？</span>
                </Dialog>
            </div>
        );
    }
}

export default ToolBarCreateEditComponent;