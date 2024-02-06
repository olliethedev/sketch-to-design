# sketch-to-design

Sketch To Design is a Figma AI widget that seamlessly converts your doodles into beautiful Figma designs. This widget leverages the power of AI to interpret sketches and translate them into high-fidelity design components, making it an invaluable tool for designers looking to streamline their workflow.

## Features

- **AI-Powered Design Translation**: Automatically converts sketches into design components.
- **Seamless Figma Integration**: Designed to work natively within Figma for a smooth design experience.

## Getting Started

To get started with Sketch-to-Design, follow these steps:

1. Clone the repository to your local machine.
2. Install the dependencies by running `npm install`.
3. Build the project using `npm run build`.
4. Load the widget in Figma by navigating to `Plugins > Development > New Plugin...` and selecting the `manifest.json` file from the project directory.

## Development

This project is set up with a React frontend for the UI and a Figma widget backend. Tailwind CSS is used for styling, and Webpack for bundling the project.

- **UI Development**: Navigate to `ui-src` for UI development. Use `npm run build` to compile your changes.
- **Widget Development**: Widget code is located in `widget-src`. Make sure to rebuild the project after making changes to see them reflected in Figma.

## Dependencies

- React & React DOM
- DaisyUI
- Tailwind CSS
- Webpack
- TypeScript
- And more, see `package.json` for a full list.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

