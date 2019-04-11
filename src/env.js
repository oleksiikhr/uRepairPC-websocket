'use strict'

module.exports = {

	/** @var boolean */
	isProd: !['dev', 'development'].includes(process.env.NODE_ENV),

	/** @var string */
	server: process.env.APP_SERVER || 'http://localhost/',

	/** @var number */
	port: +process.env.APP_PORT || 3000

}
