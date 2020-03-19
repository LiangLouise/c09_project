#!/bin/bash

if [ "$1" == 'production' ]; then
	echo 'Clear Server uploads files'

	imagesUploads="/var/www/moment.ninja.uploads/*"
	avatarUploads="/var/www/moment.ninja.avatars/*"

	echo "Start to clear Redis Session Store"
  echo FLUSHALL | redis-cli
else
	echo 'clear dev uploads files'

	imagesUploads="../backend/uploads/*"
	avatarUploads="../backend/uploads/*"
fi

echo "Start to delete images uploaded"
rm -f $imagesUploads

echo "Start tp delete avatars uploaded"
rm -f $avatarUploads

echo "Start to clear MongoDB"
mongo ~/scripts/clearMongo.js

echo "Done!"
exit 0