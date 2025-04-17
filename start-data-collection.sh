#!/bin/bash

nohup ./data-service/collect_data > sensor.log 2>&1 &
echo $! > sensor.pid
