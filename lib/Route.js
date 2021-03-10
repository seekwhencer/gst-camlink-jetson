import Express from 'express';

export default class Route {
    constructor(parent, options) {
        this.router = Express.Router();
    }

    nicePath(path) {
        return decodeURI(path).replace(/^\//, '').replace(/\/$/, '');
    }

    extractPath(path, subtract) {
        return this.nicePath(path).replace(new RegExp(`${subtract}`, ''), '').split('/');
    }
}
