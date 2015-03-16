require('react-tap-event-plugin')();
require('gh-pages/less/material-ui.less');

var React = require('react');
var Router = require('react-router-component');
var Locations = React.createFactory(Router.Locations);
var Location = React.createFactory(Router.Location);
var MainPage = require('./MainPage');
var mui = require('material-ui');

var Root = React.createClass({
	render () {
		return (
			<Locations>
				<Location path={'*/index.html'} handler={MainPage}/>
			</Locations>
		);
	}
});

React.render(<Root/>, document.getElementById('root'));
