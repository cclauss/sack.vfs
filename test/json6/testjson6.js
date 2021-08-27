'use strict';
// var JSON6 = require( "./json6.js" );
const sack = require( "../.." );
const JSON6 = sack.JSON6;

describe('JSON streaming', function () {
	it('Parses multiple and split strings', function () {
		let lastval;
		let skip_out = true;
		const results = [];
		const parser = JSON6.begin(function (val) {
			lastval = val;
			if( !skip_out ) {
				results.push(val);
			}
		});

		const complexSplit = [
			"db",
			{
				"_": {
					"#": "db",
					">": {
						"j6bjv": 1502678337047
					}
				},
				"j6bjr5rg": {
					"#": "j6bjzqK"
				}
			}
		];
		const complexSplitString = JSON.stringify(complexSplit);
		const testOut = complexSplitString;

		for( let n = 1; n < complexSplitString.length; n++ ) {
			const a = complexSplitString.substr( 0, n );
			const b = complexSplitString.substr( n );
			// console.log( "parse:\n", JSON.stringify( a ), "\n", JSON.stringify(b));
			if( !a || !b ) continue;
			parser.write( a );
			parser.write( b );
			if( JSON.stringify( lastval ) != testOut ) {
				expect(
					false,
					"FAILED REASSEMBLY AT " + n +
					'\n got:\n' + JSON.stringify( lastval ) +
					'\n Original:\n' + testOut
				).to.be.true;
			}
			// console.log( "Tested:", JSON.stringify(a), JSON.stringify(b));
		}

		skip_out = false;

		parser.write( '[]' );
		parser.write( '[,]' );
		parser.write( '[,,]' );

		const obj = [
			"db",
			{
				"_": {
					"#": "db",
					">": {
						"j6bjv": 1502678337047
					}
				},
				"j6bjr5rg": {
					"#": "j6bjzqK"
				}
			}
		];
		const str = JSON.stringify(obj);
		const pos = str.indexOf('5rg');


		parser.write(str.slice(0, pos));
		parser.write(str.slice(pos));


		parser.write( "123" );

		parser.write( "[\n   null,\n   null\n]" );

		parser.write( '"Hello ' );   // a broken simple value string, results as 'Hello World!'
		parser.write( 'World!"' );
		parser.write( '{ first: 1,' );   // a broken structure
		parser.write( ' second : 2 }' );
		parser.write( '[1234,12');  // a broken array across a value
		parser.write( '34,1234]');
		parser.write( '1234 456 789 123 523');  // multiple single simple values that are numbers
		parser.write( '{a:1} {b:2} {c:3}');  // multiple objects

		parser.write( '1234' );  // this won't return immediately, there might be more numeric data.
		parser.write( '' ); // flush any pending numbers; if an object or array or string was split, throws an error; missing close.

		parser.write( '1234' );
		parser.write( '5678 ' );  // at this point, the space will flush the number value '12345678'
		expect(results).to.deep.equal([
			[],
			/* eslint-disable no-sparse-arrays */
			[,],
			[,,],
			/* eslint-enable no-sparse-arrays */
			obj,
			123,
			[null, null],
			'Hello World!',
			{ first: 1, second : 2 },
			[1234, 1234, 1234],
			1234, 456, 789, 123, 523,
			{a: 1},
			{b: 2},
			{c: 3},
			1234,
			12345678
		]);
	});
});
