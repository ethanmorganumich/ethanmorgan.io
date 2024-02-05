#!/bin/bash

# Format the date as YYYY-MM-DD. You can adjust the date format as needed.
TODAYS_DATE=$(date)

npx quartz build -o blog
git add blog
git commit -m "Blog update $TODAYS_DATE"