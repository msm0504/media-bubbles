// eslint-disable-next-line @typescript-eslint/no-var-requires
const { loadEnvConfig } = require('@next/env');

module.exports = async () => {
	loadEnvConfig(process.env.PWD || process.cwd());
};
