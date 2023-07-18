import { Alert } from 'react-bootstrap';

function Instructions() {
    return (
        <>
            <Alert variant="info" style={{ marginTop: '1em' }}>
                <Alert.Heading>Instructions for Exporting ChatGPT Chats</Alert.Heading>
                <p>As of April 11, 2023, ChatGPT users on either free or plus plans can get an export of their ChatGPT prompt/response history and data by doing the following:</p>
                <ol>
                    <li>Sign in to ChatGPT at <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer">https://chat.openai.com</a></li>
                    <li>In the bottom left of the page click on Settings</li>
                    <li>For "Data Controls" click "Show"</li>
                    <li>In the Data Controls menu which appears click on Export data</li>
                    <li>In the confirmation modal click Confirm export</li>
                    <li>You should get an email with your data (Note: The link in the email expires after 24 hours)</li>
                    <li>Click Download data export to download a .zip file. This will include a "conversations.json" file with your chat history.</li>
                </ol>
            </Alert>
            <Alert variant="primary" style={{ marginTop: '1em' }}>
                <Alert.Heading>How Your Data Is Used</Alert.Heading>
                <p>After uploading, your data only manipulated on your local machine and then stored in your browser's IndexedDB and is not sent or stored anywhere else. It is used solely for the purpose of displaying your chat history in this application.</p>
            </Alert>
            <Alert variant="light" style={{ position: 'fixed', bottom: '1em' }}>
                <p>This application is not associated with ChatGPT or OpenAI.</p>
            </Alert>
        </>
    );
}

export default Instructions;