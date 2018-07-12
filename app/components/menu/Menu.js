import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import LabelIcon from 'material-ui/svg-icons/action/label';
import { translate, DashboardMenuItem, MenuItemLink } from 'admin-on-rest';


const items = [
    { name: 'uploadNotificationFile', jpName: '通知ファイルをアップロード'},
];

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: '100%',
    },
};

const Menu = ({ onMenuTap, translate, logout }) => (
    <div style={styles.main}>
        <DashboardMenuItem onClick={onMenuTap} />
        {items.map(item => (
            <MenuItemLink
                key={item.name}
                to={`/${item.name}`}
                primaryText={item.jpName}
                onClick={onMenuTap}
            />
        ))}
    </div>
);

const enhance = compose(
    connect(state => ({
        theme: state.theme,
        locale: state.locale,
    })),
    translate,
);

export default enhance(Menu);
