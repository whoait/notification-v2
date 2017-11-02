const rowStyle = (record) => {
    if (record.uuid === 1) return { backgroundColor: '#dfd' };
    if (record.uuid === 2) return { backgroundColor: '#ffd' };
    if (record.uuid === 3) return { backgroundColor: '#fdd' };
    return {};
};

export default rowStyle;
