const rowStyle = (record) => {
    if (record.status === 2) return { backgroundColor: '#fdd'   };
    return {};
};

export default rowStyle;
