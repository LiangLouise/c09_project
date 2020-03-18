db = db.getSiblingDB('moment');

print('===== Starting to Clear MongoDB =====');
print(db.getCollectionNames());

print('drop users posts images collections');
db.users.drop();
db.posts.drop();
db.images.drop();

print('Work Finished!');