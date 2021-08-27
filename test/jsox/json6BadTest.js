'use strict';
const SACK=require("../.." );
const JSOX = SACK.JSOX;
const parse = JSOX.parse;
let o;

describe('Bad tests', function () {

	it('unqouted partial keyword "tr "', function () {
		o = parse( "tr " );
		expect(o).to.equal("tr");
	} );

	it('unqouted partial keyword "[tr ]"', function () {
		o = parse( "[tr ]" );
		expect(o).to.deep.equal(["tr"]);
	} );
		
	it('unqouted partial keyword "{a:tr }"', function () {
			o = parse( "{a:tr }" );
		expect(o).to.deep.equal({a:"tr"});
	} );


	it('Unquoted space in identifier', function () {
		expect(function () {
			o = parse( "{ a b:1 }" );
		}).to.throw(Error);
	});

	it('Missing colon array?', function () {
		expect(function () {
			o = parse( "{ a[3], b:1 }" );
		}).to.throw(Error);
	});

	it('Missing colon object?', function () {
		expect(function () {
			o = parse( "{ a{c:3}, b:1 }" );
		}).to.throw(Error);
	});

	it('String unquoted?', function () {
		expect(function () {
			o = parse( "{ a  : no quote }" );
		}).to.throw(Error);
	});

	it('Throws with colon in array', function () {
		expect(function () {
			parse( "[:]" );
		}).to.throw(Error);
	});

	/* JSOX ':' at this level allows redefinition of classes 
	it('Throws with colon outside objects', function () {
		expect(function () {
			parse( ":" );
		}).to.throw(Error);
	});
	*/

	it('Throws with comma outside objects', function () {
		expect(function () {
			parse( "," );
		}).to.throw(Error, /bad context; fault while parsing/);
	});

	it('Throws with curly bracket outside objects', function () {
		expect(function () {
			parse( "}" );
		}).to.throw(Error);
	});

/*
  TODO 
  this is sort of an error, if 'no quote' isn't defined; but right now the parser accepts it until the reviver... (becomes classname in value)
	it('Array after string?', function () {
		expect(function () {
			o = parse( "{ a  : 'no quote' [1] }" );
			console.log( "got back:", o );
		}).to.throw(Error);
	});
*/        

	it('comma after object field and : ', function () {
		expect(function () {
			o = parse( "{a:,}" );
		}).to.throw(Error);
	});

	it('object close after object field and : ', function () {
		expect(function () {
			o = parse( "{a:}" );
		}).to.throw(Error);
	});

	it('bad hex escape : ', function () {
		expect(function () {
			o = parse( "'\\x1Z'" );
		}).to.throw(Error);
	});

	it('bad unicode escape : ', function () {
		expect(function () {
			o = parse( "'\\u01Zz'" );
		}).to.throw(Error);
	});


	it('throws with quoted field name after no comma : ', function () {
		expect(function () {
			o = parse( '{ "a": { "a": 5 }   "abc": { "a": 5  } }' );
		}).to.throw(Error,/outside any object, got colon out of string/);
	});

	it('throws with unquoted field name after no comma: ', function () {
		expect(function () {
			o = parse( '{ "a": { "a": 5 }   abc: { "a": 5  } }' );
		}).to.throw(Error,/outside any object, got colon out of string/);
	});



});
