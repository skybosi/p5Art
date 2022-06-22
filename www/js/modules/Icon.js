function Icon (icon, action) {
    return tag('span', {
        className: 'icon ' + icon,
        attr: {
            action,
        },
    });
}