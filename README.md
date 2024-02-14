# sketch-to-design

Sketch To Design is a Figma AI widget that seamlessly converts your doodles into beautiful Figma designs. This widget leverages the power of AI to interpret sketches and translate them into high-fidelity design components, making it an invaluable tool for designers looking to streamline their workflow.

Inspired by the following projects:
- [screenshot-to-code](https://github.com/abi/screenshot-to-code)
- [draw-a-ui](https://github.com/SawyerHood/draw-a-ui)
- [build-it-figma-ai](https://github.com/jordansinger/build-it-figma-ai)

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

This project is set up with a React for the iFrame UI and a Figma widget/plugin API for the widget. Tailwind CSS is used for styling in the iFrame, and Webpack for bundling the project.

| dir / path               | description                          |
| ------------------------ | ------------------------------------ |
| ui-src/                  | This is where the iframe code lives  |
| ui-src/index.html        | Main entry point for the iframe code |
| ui-src/tsconfig.json     | tsconfig for the iframe code         |
| widget-src/              | This is where the widget code lives  |
| widget-src/code.tsx      | Main entry point for the widget code |
| widget-src/tsconfig.json | tsconfig for the widget code         |
| dist/                    | Built output goes here               |

## Dependencies

- React & React DOM
- html-to-figma-lib
- DaisyUI
- Tailwind CSS
- Webpack
- TypeScript
- And more, see `package.json` for a full list.

## Contributing

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details.

