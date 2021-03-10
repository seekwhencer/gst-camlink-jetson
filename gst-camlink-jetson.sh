#!/bin/bash

DEBUG=1
VIDEO_DEVICE=0
FORMAT=NV12
WIDTH=3840
HEIGHT=2160
FRAMERATE=25
BITRATE=12000000
NUM_BUFFERS=-1
IO_MODE=2
TARGET=a.mp4
VBV_SIZE=90

echo ""

export GST_DEBUG=$DEBUG
export GST_V4L2_MIN_BUFFERS=7

record() {
  gst-launch-1.0 -v -e \
  v4l2src device=/dev/video${VIDEO_DEVICE} num-buffers=${NUM_BUFFERS} io-mode=${IO_MODE} \
   ! video/x-raw, format=${FORMAT}, width=${WIDTH}, height=${HEIGHT}, framerate=${FRAMERATE}/1 \
   ! queue \
   ! nvvidconv output-buffers=16 \
   ! 'video/x-raw(memory:NVMM)', format=NV12 \
   ! nvv4l2h264enc vbv-size="${VBV_SIZE}" bitrate=${BITRATE} maxperf-enable=1 \
   ! h264parse \
   ! mp4mux \
   ! filesink location=${TARGET}
}

listFormats(){
  v4l2-ctl --list-formats-ext -d /dev/video0
}

listFormats
record

