#!/bin/bash

if [ "$1" == 'production' ]; then
	echo 'Clear Server uploads files and mongoDB'

	imagesUploads="/var/www/moment.ninja.uploads/*"
	avatarUploads="/var/www/moment.ninja.avatars/*"
	mongoScript="~/scripts/clearMongo.js"

	echo "Start to clear Redis Session Store"
  echo FLUSHALL | redis-cli
else
	echo 'clear dev uploads files and mongoDB'

	imagesUploads="../backend/uploads/*"
	avatarUploads="../backend/uploads/*"
  mongoScript="./clearMongo.js"

fi

echo "Start to delete images uploaded"
rm -f $imagesUploads

echo "Start tp delete avatars uploaded"
rm -f $avatarUploads

echo "Start to clear MongoDB"
mongo $mongoScript

echo "Done!"
exit 0