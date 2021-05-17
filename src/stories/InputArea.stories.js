import InputArea from "./InputArea.vue";

export default {
    title: "Example/component",
    component: InputArea,
};

const Template = (args) => ({
    // Components used in your story `template` are defined in the `components` object
    components: {
        InputArea,
    },
    // The story's `args` need to be mapped into the template through the `setup()` method
    setup() {
        // Story args can be mapped to keys in the returned object
        return {
            args,
        };
    },
    // Then, those values can be accessed directly in the template
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