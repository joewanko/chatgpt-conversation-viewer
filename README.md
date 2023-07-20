
# ChatGPT Conversation Viewer

## Description

ChatGPT Conversation Viewer is a web application that allows users to view, search, and sort OpenAI's ChatGPT conversations. It's built using React and Firebase, and utilizes IndexedDB for storing the conversations.

## Getting Started

Clone this repository to your local machine, then install the dependencies:

```
git clone https://github.com/joewanko/chatgpt-conversation-viewer.git
cd chatgpt-conversation-viewer
npm install
```

To start the development server:

```
npm start
```

The application will be available at `http://localhost:3000`.

## Usage

### Exporting ChatGPT Chats

To use this application, you will need to export your ChatGPT chats from the OpenAI website. Here are the steps to do so:

1. Sign in to ChatGPT at [https://chat.openai.com](https://chat.openai.com).
2. In the bottom left of the page click on Settings.
3. For "Data Controls" click "Show".
4. In the Data Controls menu which appears click on Export data.
5. In the confirmation modal click Confirm export.
6. You should get an email with your data (Note: The link in the email expires after 24 hours).
7. Click Download data export to download a .zip file. This will include a "conversations.json" file with your chat history.

### Using the Application

Once the server is running, visit `http://localhost:3000` in your web browser. You will be asked to upload your conversations.json file. The conversations are loaded from the JSON file and stored in your browser's IndexedDB for quick retrieval. You can search through the conversations using the search bar, and sort the conversations based on different criteria.

## Contributing

If you'd like to contribute, please fork the repository and create a new branch, then submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for more details.

## Acknowledgments

Thanks to OpenAI for providing the ChatGPT model that makes this application possible.
