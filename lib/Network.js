import {spawn} from 'child_process';
import Events from './Events.js';
import Config from '../config/network.json';

export default class Network extends Events {
    constructor() {
        super();
        this.label = 'NETWORK';
        this.config = Config;
        this.initDevice();
    }

    initDevice() {
        const processOptions = [this.config.device, this.config.ip];
        LOG(this.label, 'SET DEVICE:', JSON.stringify(processOptions));
        spawn('/sbin/ifconfig', processOptions);
    }
}