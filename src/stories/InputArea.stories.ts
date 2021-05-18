import InputArea from "./InputArea.vue";

export default {
	title: "Example/component",
	component: InputArea,
};

const Template = (args: any) => ({
	components: {
		InputArea,
	},
	setup() {
		return {
			args,
		};
	},
	template: '<input-area v-bind="args" />',
});

export const InputNumberArea = Template.bind({});
InputNumberArea.args = {
	label: "열",
	placeholder: "열을 입력해 주세요.",
	max: 6,
	min: 2,
	maxlength: 1,
	value: 0,
	name: "name",
	validMessage: "입력해 주세요.",
	validShow: false,
};
