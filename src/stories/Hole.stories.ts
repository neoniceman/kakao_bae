import Hole from "./Hole.vue";

export default {
	title: "Example/component",
	component: Hole,
};

const Template = (args: any) => ({
	components: {
		Hole,
	},
	setup() {
		return {
			args,
		};
	},
	template: '<hole v-bind="args" />',
});

export const HoleItem = Template.bind({});
HoleItem.args = {
	isUp: false,
};
