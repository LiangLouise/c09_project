#!/bin/bash

# Get the token from Travis environment vars and build the bot URL:
BOT_URL="https://sc.ftqq.com/${MESSAGE_KEY}.send"

if ! [ -x "$(command -v rsync)" ]; then
  echo 'Error: rsync is not installed.' >&2
  exit 1
fi

# Use built-in Travis variables to check if all previous steps passed:
if [ $TRAVIS_TEST_RESULT -ne 0 ]; then
    build_status="failed"
else
    build_status="succeeded"
fi

# Define send message function
send_msg () {
    curl -s -X POST ${BOT_URL} \
        -d text="$1" \
        -d desp="$2"
}

echo 'scp installed' >&2

# Deploy frontend files
rsync -a -P --delete ${TRAVIS_BUILD_DIR}/frontend/build/* root@${SERVER_HOST}:/var/www/moment.ninja
# Deploy backend files
rsync -a -P --delete --exclude '.git*' ${TRAVIS_BUILD_DIR}/backend/* root@${SERVER_HOST}:/var/www/moment.ninja.backend
# Run Express in production mode
ssh root@${SERVER_HOST} "NODE_ENV=production node /var/www/moment.ninja.backend/app.js &"

send_msg "${TRAVIS_REPO_SLUG} Build Log No.${TRAVIS_BUILD_NUMBER}" \
"
-------------------------------------
Travis build *${build_status}!*
\`Repository:  ${TRAVIS_REPO_SLUG}\`
\`Branch:      ${TRAVIS_BRANCH}\`
*Commit Msg:*
${TRAVIS_COMMIT_MESSAGE}
[Job Log Here](${TRAVIS_JOB_WEB_URL})
--------------------------------------
"