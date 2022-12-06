docker start elated_mcclintock;
docker exec bf309d47ce5334fba515606730782cfcd28b62776b76a90b23af2c027a907929 /bin/sh -c "cd /workspaces/blog; JEKYLL_ENV=production bundle exec jekyll b;";
docker stop elated_mcclintock;
open http://127.0.0.1:8080/blog/;
http-server;
