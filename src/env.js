'use strict'

/**
 * Remove last slash if exists
 * @param input
 * @return {string}
 */
const withoutLastSlash = (input) => {
	if (!input) {
		return ''
	}

	if (input.slice(-1) === '/') {
		return input.slice(0, input.length - 1)
	}

	return input
}

module.exports = {

	/** @var boolean */
	isProd: !['dev', 'development'].includes(process.env.NODE_ENV),

	/** @var string */
	laravelServer: withoutLastSlash(process.env.LARAVEL_SERVER) || 'http://localhost',

	/** @var number */
	port: +process.env.APP_PORT || 3000

}
