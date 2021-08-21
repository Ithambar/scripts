module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	env: {
		browser: true,
		node: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier", "plugin:prettier/recommended"],
	plugins: ["prettier", "@typescript-eslint"],
	// add your custom rules here
	rules: {
		"no-console": "off",
		"no-debug": "off",
		"vue/comment-directive": "off",
	},
	ignorePatterns: ["dist/"],
};
