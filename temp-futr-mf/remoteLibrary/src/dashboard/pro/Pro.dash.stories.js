import { fn } from "@storybook/test";
import DashPro from "./Pro.dash";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Dashboard/Pro",
  component: DashPro,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    primary: true,
    label: "DashPro",
  },
};

export const Secondary = {
  args: {
    label: "DashPro",
  },
};

export const Large = {
  args: {
    size: "large",
    label: "DashPro",
  },
};

export const Small = {
  args: {
    size: "small",
    label: "DashPro",
  },
};
