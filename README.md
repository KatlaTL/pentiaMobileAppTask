
# Pentia mobile chat app
This project has been developed as a solution to a case given by Pentia Mobile. \
A link to the case description can be found below.

Pentia mobile app case - [Link to case description](app/assets/development_task_2024.1.pdf)


## Tech Stack
The project are developed in React Native (without Expo) and Typescript. \
Google Firebase are used to handle all backend related tasks: Authentication, Database, Storage and Push notifications (FCM)


## Current concerns and challenges
The app has been created by using the CLI on a Windows computer and therefore only been tested on an Android Emulator. \
Further development has since been done on a MacBook Pro with Xcode, however the project is unable to run on an Iphone simulator. 

After a succesfull build the following error is shown on the simulator:

- Invariant Violation: "simpleReactNativeChattingApp" has not been registered. This can happen if:
    * Metro (the local dev server) is run from the wrong folder. Check if Metro is running, stop it and restart it in the current project.
    * A module failed to load due to an error and `AppRegistry.registerComponent` wasn't called., js engine: hermes

I have tried few things such as clearing all caches and updating different dependencies, without luck. It is must likely due to some missing configuration for IOS after the project was created on a Windows computer. I have therefore decided that my time is better spent moving forward with other projects.

For that reason the app only works on android.


## Setup and run the project
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
        yarn start
        ````
    - Run the app on Android
        * NPM
        ```
        npm run android
        ```
        * Yarn
        ```
        yarn android
        ````
    - Run the app on IOS
        * NPM
        ```
        npm run ios
        ```
        * Yarn
        ```
        yarn ios
        ````

## Project Structure
The project structure for the Pentia Mobile Chat app is organized as following:
```

```
