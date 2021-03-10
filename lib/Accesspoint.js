import {spawn} from 'child_process';
import Events from './Events.js';

export default class Accesspoint extends Events {
    constructor() {
        super();
        this.label = 'ACCESSPOINT';
        this.verbose = 1;

        this.startHostapd();
        this.startDnsmasq();
    }

    startHostapd() {
        const processOptions = ['-d', './config/hostapd.conf'];
        LOG(this.label, 'STARTING WITH OPTIONS', JSON.stringify(processOptions));

        // the key is the emitted event
        const events = {
            ready: new RegExp('Setup of interface done'),
        };

        this.hostapd = spawn('/usr/sbin/hostapd', processOptions);
        this.hostapd.stdout.setEncoding('utf8');
        this.hostapd.stderr.setEncoding('utf8');
        this.hostapd.stderr.on('data', data => this.listenTTY('stderr HOSTAPD:', data, events));
        this.hostapd.stdout.on('data', data => this.listenTTY('stdout HOSTAPD:', data, events));
    }

    startDnsmasq() {
        const processOptions = ['-C', './config/dnsmasq.conf', '--no-daemon'];
        LOG(this.label, 'STARTING WITH OPTIONS', JSON.stringify(processOptions));

        const events = {
            ready: new RegExp('Cache geleert'),
        };

        this.dnsmasq = spawn('/usr/sbin/dnsmasq', processOptions);
        this.dnsmasq.stderr.setEncoding('utf8');
        this.dnsmasq.stdout.setEncoding('utf8');
        this.dnsmasq.stderr.on('data', data => this.listenTTY('stderr DNSMASQ:', data, events));
        this.dnsmasq.stdout.on('data', data => this.listenTTY('stdout DNSMASQ:', data, events));
    }
}
