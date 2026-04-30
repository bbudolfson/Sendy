import type { Preview } from '@storybook/nextjs-vite'
import React from "react";
import { PocSessionProvider } from "../src/context/poc-session";
import "../src/app/globals.css";
import "../src/styles/tokens.css";

const preview: Preview = {
  decorators: [
    (Story) =>
      React.createElement(
        PocSessionProvider,
        null,
        React.createElement(
          "div",
          { style: { padding: "1rem" } },
          React.createElement(Story),
        ),
      ),
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;