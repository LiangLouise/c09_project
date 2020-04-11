# Redis Cache

Redis caches following types of objects in this project.

## Session

Managed by Express-Session.

## [Search User](./backend/controllers/searchController.js)

- Default Expire: `60`
- Read from Redis:
    * searchUser:
        1. `search/{query_username}/{page}`: cache search result by query username and page number

## [Post](./backend/controllers/postController.js)

- Default Expire: `120`

- Read from Redis: 
    * Post Picture - Each picture has two pairs:
      1. `{session_username}/post/{post_id}/images/{image_index}`: The image file in base64 format, need to convert back buffer.
      2. `{session_username}/post/{post_id}/images/{image_index}/mimetype`: The image file mimetype, used to set `Content-Type`.
      
    * getPostById - When User visits via method `getPostById`, one pair only:
      1. `{session_username}/post/{post_id}`: stringified JSON Post object.
      
    * getPostsByUser - When User visits via method `getPostsByUser` (Usually used when visiting homepage of some user):
      1. `{session_username}/posts/{tagret_username}/{page}`: stringified Array of Post JSON objects.
      
    * getPostOfFollowing - TODO (Prob no good way to cache)

- Update Redis:
    * Create new Post `createPost`, deleting keys in format:
      1. `*/posts/{session_username}/*"`: force to get new posts.
    
    * Delete Post By $post_id, deleting keys in format:
      1. `*/post/$post_id/*`: remove all image caches.
      2. `"*/posts/$session_username/*`: remove all caches storing $$session_username's posts.
      

## [Profile](./backend/controllers/profileController.js)

- Default Expire: `120`
 
- Read From Redis:
    * Get Avatar:
        1. `{session_username}/avatar`: Buffer of the avatar file
        2. `{session_username}/avatar/mime`: `Content-Type` for response
    
- Update Redis:
    * Update Avatar, delete following keys:
        1. `{session_username}/avatar`
        2. `{session_username}/avatar/mime`