import {spawn} from 'child_process';
import dateFormat from 'dateformat';
import Events from './Events.js';
import Config from '../config/gst.json';
import fs from 'fs-extra';


export default class Webcam extends Events {
    constructor() {
        super();
        this.label = "WEBCAM";
        this.config = Config;
        this.preset = fs.readJSONSync(`./config/preset/${this.config.preset}.json`);
        this.verbose = 1;
    }

    record() {
        LOG(this.label, 'RECORDING...');

        const processOptions = [
            '-v', '-e',
            'v4l2src', `device=${this.preset.device}`, `num-buffers=${this.preset.num_buffers}`, `io-mode=${this.preset.io_mode}`,
            '!', `video/x-raw, format=${this.preset.format}, width=${this.preset.width}, height=${this.preset.height}, framerate=${this.preset.framerate}/1`,
            '!', 'queue',
            '!', 'nvvidconv', 'output-buffers=16',
            '!', `video/x-raw(memory:NVMM), format=${this.preset.format}`,
            '!', 'nvv4l2h264enc',
            `vbv-size=${this.preset.vbv_size}`,
            `bitrate=${this.preset.bitrate}`,
            'maxperf-enable=1',
            `preset_level=${this.preset.preset_level}`,
            `iframeinterval=${this.preset.iframeinterval}`,
            `control-rate=${this.preset.control_rate}`,
            `EnableTwopassCBR=${this.preset.EnableTwopassCBR}`,
            '!', 'h264parse',
            '!', 'mp4mux',
            '!', 'filesink', `location=${this.target}`
        ];

        this.gst = spawn('/usr/bin/gst-launch-1.0', processOptions, {
            env: {
                'GST_DEBUG': 2
            }
        });

        //@TODO
        const events = {
            ready: new RegExp('Setup of interface done'),
        };

        this.gst.stdout.setEncoding('utf8');
        this.gst.stderr.setEncoding('utf8');
        this.gst.stderr.on('data', data => this.listenTTY('stderr:', data, events));
        this.gst.stdout.on('data', data => this.listenTTY('stdout:', data, events));
    }

    stop() {
        LOG(this.label, 'STOP RECORDING');
        this.gst.kill('SIGINT');
    }

    get target() {
        return `${this.preset.target_path}/${dateFormat(new Date(), "yyyy-m-d_H-MM-ss")}.mp4`;
    }

    set target(value) {
        //
    }

}