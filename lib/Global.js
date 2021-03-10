import dateFormat from 'dateformat';

global.DEBUG = true;

global.LOG = function() {
    if (DEBUG === false) {
        return false;
    }
    let output = [
        '[',
        dateFormat(new Date(), "H:MM:ss - d.m.yyyy"),
        ']'
    ].concat(Array.from(arguments));
    console.log.apply(console, output);
}
