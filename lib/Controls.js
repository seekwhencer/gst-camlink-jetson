import * as Routes from './Routes/index.js';
import Events from './Events.js';
import http from 'http';
import Express from 'express';

export default class Controls extends Events {
    constructor() {
        super();

        this.label = 'CONTROLS';
        this.port = 8081;
        this.rootURLPath = '';

        this.engine = new Express();
        this.server = false;

        // CORS
        this.engine.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        });

        this.on('record', value => {
            LOG(this.label, 'RECORD:', value);

            switch(value){
                case 'on':
                    WEBCAM.record();
                    break;

                case 'off':
                    WEBCAM.stop();
                    break;
            }
        });

        this.registerRoutes();
        this.start();
    }

    start() {
        return new Promise((resolve, reject) => {
            this.server = http.Server(this.engine);
            this.server.listen(this.port, () => {
                LOG(this.label, 'WEBSERVER IS UP ON PORT:', this.port);
                resolve(this);
                this.emit('listen');
            });
        });
    }

    registerRoutes() {
        Object.keys(Routes).forEach(route => this.engine.use(`/${this.rootURLPath}`, new Routes[route](this)));
    }
}