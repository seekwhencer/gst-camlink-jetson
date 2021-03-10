import Route from '../Route.js';

export default class ImageRoutes extends Route {
    constructor(parent, options) {
        super(parent, options);
        this.controls = parent;

        this.router.get('/trigger', (req, res) => {
            res.json({});
            this.controls.emit('trigger');
        });

        this.router.get(/(.+\/)?trigger\/(.+)/i, (req, res) => {
            let pathCommand = this.extractPath(req.path, 'trigger/');
            const action = pathCommand[0];
            const value =  pathCommand[1];
            res.json({});
            this.controls.emit(action, value);
        });

        return this.router;
    }
}
