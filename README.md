# Chat Application Template

This is a simple chat application developed using Next.js and OpenAI API. The basic UI and initial codebase were generated by v0.dev.

## Features

- Users can input text messages
- Display chat history
- Support for conversations between users and an AI assistant
- AI responses support Markdown formatting
- "Thinking..." animation while waiting for AI response
- Keyboard shortcuts:
  - Enter: Send message
  - Ctrl+Enter or Shift+Enter: New line in input box
- Image upload functionality:
  - Users can upload images as part of their prompts
  - Uploaded images are displayed in the chat
- Image display in chat messages
- Markdown rendering for messages, including code blocks and lists
- Multilingual support: AI responds in the same language as the user

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file and add your OpenAI API key:
   ```bash
   OPENAI_API_KEY=your_openai_api_key
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.



## TODO

- [ ] Add Docker configuration
- [x] Add a sophisticated sidebar for comprehensive user management


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)


