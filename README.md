# iSpotify
Hello everyone, this is iSpotify, which has unlocked some of Spotify's premium features. The purpose of this project is not to crack Spotify, but to learn the interaction between swift and javascript.


## Features

- skip previous
- unlimited skip next
- seek
- show track list
- disable shuffle


## How it works
After a Spotify account is logged in on multiple devices, you can remotely control the playback of other devices, and Spotify provides some premium features on the computer browser. Therefore, iSpotify creates two WKWebViews as browser containers, one is used to render the mobile webpage, and the other is used to load the computer webpage. When the loading is completed, the mobile webpage can link to the computer webpage, control playback, and obtain some premium features. And the tracks are still played on the local device.

<img width="502" alt="Screenshot 2024-01-01 at 13 59 22" src="https://github.com/somedaysomeone/iSpotify/assets/99853345/2a7414fb-54a6-4ff8-8c70-3ea0f76f7db2">

## Requirements

- Deployment target: iOS 14.2
- Xcode 15.0.1


## Usage/Examples
Tap now playing bar, then tap devices button on the corner, and select Premium

![usage](https://github.com/somedaysomeone/iSpotify/assets/99853345/cf98eb1d-e832-42d8-8bf7-dd09243e8195)








## License

[MIT](https://choosealicense.com/licenses/mit/)

