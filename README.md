# React Native App with WebView and AsyncStorage

This is a React Native application that utilizes a WebView component to display a web page and AsyncStorage for storing data persistently. The app also includes functionality to clear app data and cache upon reopening when it was completely closed.

## Features

- WebView integration to display a web page within the app.
- Use of AsyncStorage for storing data persistently.
- Automatic detection of internet connectivity status using NetInfo.
- Ability to refresh the WebView content.
- Handling of hardware back button to navigate back within the WebView.
- Clearing app data and cache upon reopening when it was completely closed.

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js
- npm or Yarn
- React Native development environment setup
- Android Studio (for Android development) or Xcode (for iOS development)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

## Additional Configuration

### AsyncStorage

The app uses AsyncStorage for storing data persistently. Ensure that AsyncStorage is properly configured and that data is stored and retrieved correctly.

### WebView

The WebView component is used to display a web page within the app. Make sure the URI provided in the source prop of the WebView component is accessible and loads correctly.

### Clearing App Data

The app includes functionality to clear app data and cache upon reopening when it was completely closed. This is implemented in the clearAppData function in the code. Customize this function as needed for your specific requirements.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
