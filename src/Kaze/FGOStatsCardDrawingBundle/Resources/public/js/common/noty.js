define(['jquery', 'noty'], ($, noty) => {
    return (msg, type, delay) => {
        $.noty.closeAll();
        noty({
            layout: 'center',
            theme: 'relax',
            type: type == null ? 'alert' : type,
            text: msg,
            timeout: delay == null ? false : delay
        });
    }
});
