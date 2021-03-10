import {EventEmitter} from 'events';

export default class Events {
    constructor() {
        this.event = new EventEmitter();
    }

    on() {
        this.event.on.apply(this.event, Array.from(arguments));
    }

    emit() {
        this.event.emit.apply(this.event, Array.from(arguments));
    }

    removeListener() {
        this.event.removeListener.apply(this.event, Array.from(arguments));
    }

    removeAllListeners() {
        this.event.removeAllListeners.apply(this.event, Array.from(arguments));
    }

    listenTTY(con, data, match) {
        if (this.verbose === 2)
            LOG(this.label, con, ':', data);

        data = data.replace(new RegExp('\n\n', 'gi'), '\n');
        const rows = data.split('\n');
        rows.forEach(row => {
            if (this.verbose === 1)
                LOG(this.label, con, ':', row.trim());

            Object.keys(match).forEach(event => {
                const matches = row.match(match[event]);
                matches ? this.emit(event, this) : null;
            });
        });
    }
}
