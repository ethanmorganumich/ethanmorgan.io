docker exec bf309d47ce5334fba515606730782cfcd28b62776b76a90b23af2c027a907929 /bin/sh -c "cd /workspaces/blog; JEKYLL_ENV=production bundle exec jekyll b;";
mkdir blog;
cp _site/* blog/;
mv -f ./blog /Users/emorgan/Documents/PersonalWebsite/ethanmorgan.io/
