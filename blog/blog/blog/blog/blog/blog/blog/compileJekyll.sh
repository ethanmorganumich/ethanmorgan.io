docker start elated_mcclintock
docker exec bf309d47ce5334fba515606730782cfcd28b62776b76a90b23af2c027a907929 /bin/sh -c "cd /workspaces/blog; JEKYLL_ENV=production bundle exec jekyll b;";
docker stop elated_mcclintock 
rm -rf /Users/emorgan/Documents/PersonalWebsite/blog/blog
mv _site blog;
rm -rf /Users/emorgan/Documents/PersonalWebsite/ethanmorgan.io/blog
cp -r /Users/emorgan/Documents/PersonalWebsite/blog/blog /Users/emorgan/Documents/PersonalWebsite/ethanmorgan.io/
