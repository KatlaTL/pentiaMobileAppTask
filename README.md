
# Pentia mobile chat app
This project has been developed as a solution to a case given by Pentia Mobile. \
A link to the case description can be found below.

Pentia mobile app case - [Link to case description](app/assets/development_task_2024.1.pdf)


## Table of Contents

<ol>
    <li>
        <a href="#about-the-case">About the case</a>
    </li>
    <li>
        <a href="#tech-stack">Tech Stack</a>
    </li>
    <li>
        <a href="#run-the-project">Run the project</a>
        <ul>
            <li><a href="#prerequisites">Prerequisites</a></li>
            <li><a href="#deployment">Deployment</a></li>
        </ul>
    </li>
    <li><a href="#project-structure">Project Structure</a></li>
</ol>
<br />



## About the case
All of the tasks in the [case](app/assets/development_task_2024.1.pdf) has been completed, except for:

Task 5. **Push functionality** 
- Acceptance test 2. \
    "Every time someone writes a message in the room, a push message is sent to me". 

Support for sending FCM with the previous REST api has been deprecated and removed as of June 2024. The new FCM HTTP v1 REST api has a new form for authorization. It requires an access token to be sent with header of the request. However this access token is, for security reasons, only accessible through a backend. I have therefore skipped that particular step as it seems to be out of scope of the case to develop my own backend just for the sake of generating an access token.

Links to the Firebase documentation about the new API:
- https://firebase.google.com/docs/cloud-messaging/send-message
- https://firebase.google.com/docs/cloud-messaging/migrate-v1

<br />

To test the Push Notification Deep Links for IOS use the **`payload.apns`** file found in the projects root directory. Simply drag and drop it onto the IOS Simulator while the app is in the background to trigger the notification.

<p align="right">(<a href="#pentia-mobile-chat-app">back to top</a>)</p>


## Tech Stack
The project are developed in React Native (without Expo) and Typescript. \
Google Firebase are used to handle all backend related tasks: Authentication, Database, Storage and Push notifications (FCM)

## Run the project
Follow these steps to run app

### Prerequisites
Before running the app make sure you have following setup and installed:
- Setup a [React Native](https://reactnative.dev/docs/0.74/set-up-your-environment) environments for Android and IOS
- [Node](https://nodejs.org/en)


### Deployment
1. Clone the repository
    ```
    git clone https://github.com/KatlaTL/pentiaMobileAppTask.git
    ```
2. Change the working directory to the project:
    ```
    cd pentiaMobileAppTask
    ```
3. Install dependencies:
    * NPM:
    ```
    npm install
    ```
    * Yarn:
    ```
    yarn install
    ```
4. (Optional) If you want to run it on the IOS Simulator to see the current error message:
    ```
    cd ios && pod install --repo-update && cd ..
    ```
5. Run the application:
    - Start the metro bundler
        * NPM
        ```
        npm run start
        ```
        * Yarn
        ```
        yarn run start
        ````
    - Run the app on Android
        * NPM
        ```
        npm run android
        ```
        * Yarn
        ```
        yarn run android
        ````
    - Run the app on IOS
        * NPM
        ```
        npm run ios
        ```
        * Yarn
        ```
        yarn run ios
        ````

<p align="right">(<a href="#pentia-mobile-chat-app">back to top</a>)</p>

## Project Structure
The project structure for the Pentia Mobile Chat app is organized as following:
```
app
│
├── App.tsx
├── assets
│   ├── development_task_2024.1.pdf
│   ├── img
│   │   └── comment.svg
│   └── styles
│       ├── colors.ts
│       ├── global.ts
│       ├── roomStyle.ts
│       └── signInStyle.ts
├── constants
│   └── errorMessages.json
├── contexts
│   ├── loading.context.tsx
│   └── notification.context.tsx
├── hooks
│   ├── useAuth.ts
│   └── useNotification.ts
├── navigators
│   ├── app.navigator.tsx
│   ├── auth.navigator.tsx
│   └── root.navigator.tsx
├── redux
│   ├── reducers
│   │   ├── chatRoomListSlice.ts
│   │   ├── messageSlice.ts
│   │   └── userSlice.ts
│   └── store
│       └── store.ts
├── screens
│   ├── chat
│   │   ├── _components
│   │   │   ├── chat-bubble.tsx
│   │   │   ├── chat-button.tsx
│   │   │   ├── chat-presentation.tsx
│   │   │   └── message.tsx
│   │   └── chat.screen.tsx
│   ├── chat-rooms
│   │   ├── _components
│   │   │   ├── chat-rooms-presentation.tsx
│   │   │   ├── item-section.tsx
│   │   │   └── list-item.tsx
│   │   └── chat-rooms.screen.tsx
│   ├── signin
│   │   ├── _components
│   │   │   └── login-button.tsx
│   │   └── signin.screen.tsx
│   └── splash
│       └── splash.screen.tsx
├── services
│   ├── AuthService.ts
│   ├── ChatRoomService.ts
│   ├── ImageService.ts
│   └── NotificationService.ts
└── utils
    ├── dialogues.ts
    └── helpers.ts
```

1. **`App.tsx` File**
    This is the root file of the app
2. **`assets` Directory**
    Directory for all assets and styles
    - **`img`** Contains images and icons
    - **`styles`** Contains global and screen specific styles
2. **`constants` Directory**
    Directory for constant files suchs error messages
3. **`contexts` Directory**
    Directory for contexts files
4. **`hooks` Directory**
    Directory for custom hooks
5. **`navigators` Directory**
    Directory for the apps navigators: Root navigator, App navigator and Auth navigator
6. **`redux` Directory**
    Directory for all Redux Store related files
    - **`reducers`** The Redux Stores reducers
    - **`store`** The Redux Store
7. **`screens` Directory**
    Directory for the different screens used across the app
    - **`chat`** Chat screen
        - **`_components_`** Components used in the chat screen
    - **`chat-rooms`** Chat room screen
        - **`_components_`** Components used in the chat rooms screen
    - **`signin`** Sign in screen
        - **`_components_`** Components used in the sign in screen
    - **`splash`** Splash screen
8. **`services`Directory**
    Directory for all services files, primarily used to talk with the Firebase backend
9. **`utils` Directory**
    Directory for all files containing utility functions

<p align="right">(<a href="#pentia-mobile-chat-app">back to top</a>)</p>
