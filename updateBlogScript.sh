#!/bin/bash

# Usage: When you want to update the blogs
# $ ./updateBlogScript.sh

# the "content" directory is a sym link to my Obsidian Workspace where I have a folder dedicated to my online posts``

# Format the date as YYYY-MM-DD. You can adjust the date format as needed.
TODAYS_DATE=$(date)

npx quartz build -o blog
git add blog
git commit -m "Blog update $TODAYS_DATE"