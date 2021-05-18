import MyButton from "./Button.vue";

export default {
	title: "Example/Button",
	component: MyButton,
	argTypes: {
		backgroundColor: { control: "color" },
		size: {
			control: { type: "select", options: ["small", "medium", "large"] },
		},
		onClick: {},
	},
};

const Template = (args: any) => ({
	components: { MyButton },
	// The story's `args` need to be mapped into the template through the `setup()` method
	setup() {
		return { args };
	},
	// And then the `args` are bound to your component with `v-bind="args"`
	template: '<my-button v-bind="args" />',
});

export const Primary = Template.bind({});
Primary.args = {
	primary: true,
	label: "Button",
};

export const Secondary = Template.bind({});
Secondary.args = {
	label: "Button",
};

export const Large = Template.bind({});
Large.args = {
	size: "large",
	label: "Button",
};

export const Small = Template.bind({});
Small.args = {
	size: "small",
	label: "Button",
};
