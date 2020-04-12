

# Project

## Project Title

**Moment**

## Team Members

| First Name | Last Name |Student Number |
|------------|-----------|---------------|
| Jiasong    | Liang     | 1004203337    |
| Cheng      | Gao       | 1004231057    |
| Tianhao    | Yao       | 1003404728    |

## Production App

[https://moment.ninja/](https://moment.ninja/)

## API Documentation

[RestAPI Documentation](https://utscc09.github.io/project-team_random_star/)

## Build Status

[![Node.js CI & Deploy](https://github.com/UTSCC09/project-team_random_star/workflows/Node.js%20CI%20&%20Deploy/badge.svg)](https://github.com/UTSCC09/project-team_random_star/actions?query=workflow%3A%22Node.js+CI+%26+Deploy%22)

[![Update Project API Doc Page](https://github.com/UTSCC09/project-team_random_star/workflows/Update%20Project%20API%20Doc%20Page/badge.svg)](https://github.com/UTSCC09/project-team_random_star/actions?query=workflow%3A%22Update+Project+API+Doc+Page%22)

## App Description

A web application that allows user to share images with friend and forge meaning connection with each other through our unique features.

Once each user has registered their account, they will be assign with a very own timeline, whenever they upload an image, it will apear on the timeline. Users can visit others' timeline to share the delight moment they spent with their friends. Each user can comment, like, and share image on other people's timeline.

Each user will also have a map interface where they can see their own and friends' pictures based on the geographical information.

When each user uploads an image on their timeline, they will be asked to mark themselve in the image (if applicable). And our application will try to label everyone in the picture based on store information in database and ask user if the result is correct. User can also turn off this feature if they do not wish their facial information to be shared.

Finally, our app will create a unique annual summary for each user based on their timeline, the summary will include information such as: which place you have been to the most this year, which friend you have been handing out with the most this year, and so on.

This application focus on highlighting user's friendship and provides user a channel to share their happiness with friends and meet new people.


## Features To Release

### Beta Version

* Basic Image Editing: Cropping, Flipping, Image Filter.....
* Images Sharing with Friends Like Instagram
* Basic Posts Flow in intinity scroller

### Final Version

* Face Detect to check who is in the photots
* Display Images in Maps with locations

## Tech Stack

* ReactJS - Frontend Framework
* NodeJS - Backend Server
* Redis - Server Side Cache [doc](./redis_cache_doc.md)
* Mongo - Data Persistence

## Credits

[Credits.md](./Credits.md)

## Top Five Technical Challenges

* precise face detection with A.I;
* image editing features (experimenting with filters, distortion, etc.);
* map with uploaded images' information;
* Integrate backend properly with Redis to do the server side caching;
* Learning and experimenting with new frameworks.
