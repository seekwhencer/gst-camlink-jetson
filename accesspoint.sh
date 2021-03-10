#!/bin/bash

killall hostapd > /dev/null
killall dnsmasq > /dev/null

/usr/sbin/hostapd -d ./hostapd.conf &
/usr/sbin/dnsmasq -C ./dnsmasq.conf --no-daemon

