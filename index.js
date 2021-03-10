/*
    Record from Camlink 4K with gst-launch
    Matthias Kallenbach, 2021
 */

import './lib/Global.js';
import Network from "./lib/Network.js";
import Accesspoint from "./lib/Accesspoint.js";
import Controls from "./lib/Controls.js";
import Webcam from "./lib/Webcam.js";

global.NETWORK = new Network();
global.CONTROLS = new Controls();
global.ACCESSPOINT = new Accesspoint();
global.WEBCAM = new Webcam();
