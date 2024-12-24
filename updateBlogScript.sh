#!/bin/bash

# Usage: When you want to update the blogs
# $ ./updateBlogScript.sh

# the "content" directory is a sym link to my Obsidian Workspace where I have a folder dedicated to my online posts``

# Format the date as YYYY-MM-DD. You can adjust the date format as needed.
TODAYS_DATE=$(date)

# cd into the correct folder
cd /Users/emorgan/Documents/PersonalWebsite/ethanmorgan.io

# move into the quartz folder
cd ../quartz
# build the blog
npx quartz build -o blog

# go back into website
cd ../ethanmorgan.io
# remove old blog
rm -rf blog
# move in new blog
mv ../quartz/blog .

git add blog
git commit -m "Blog update $TODAYS_DATE"