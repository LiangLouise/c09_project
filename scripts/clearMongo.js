db = db.getSiblingDB('moment');

print('===== Starting to Clear MongoDB =====');
print(db.getCollectionNames());

print('drop users posts comments collections');
db.users.drop();
db.posts.drop();
db.comments.drop();
db.facedata.drop();

print('Work Finished!');