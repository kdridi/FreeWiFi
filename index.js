#!/usr/bin/env node

require("babel-polyfill")

import request from 'request-promise'
import assert from 'assert'
import cheerio from 'cheerio'
import minimist from 'minimist'

const main = async function(form)
{
	while(true)
	{
		const message = await request
		(
			{	uri						: 'https://wifi.free.fr/Auth'
			,	form					:
				{	login				: form.login
				,	password			: form.password
				,	submit				: 'Valider'
				}
			,	headers					:
				{	'User-Agent'		: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:42.0) Gecko/20100101 Firefox/42.0'
				,	'Accept'			: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
				,	'Accept-Language'	: 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3'
				,	'Referer'			: 'https://wifi.free.fr/'
				,	'Cookie'			: 'route=0'
				}
			,	json					: false
			,	simple					: false
			,	resolveWithFullResponse	: true
			,	transform				: function(body, response)
										{
											assert.ok(response instanceof Object, 'Unexpected error')
											assert.equal(response.statusCode, 200, 'Bad credentials')
											const $ = cheerio.load(body)
											return $('p.red').text().trim()
										}
		})
		const prefix = 'Site accessible uniquement à partir d\'une Freebox: '
		if (typeof(message) === 'string' && message.startsWith(prefix) === true)
			return message.substr(prefix.length).trim()
	}
}

main(minimist(process.argv.slice(2))).then
( res => console.log(res)
, err => console.log(err)
)