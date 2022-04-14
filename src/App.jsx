import React from 'react';
import './App.css';

const OPR = new Set(['+', '-', '/', '*']);
// const precedence = "-+*/";

class Operators extends React.Component {
	render() {
		return (
			<div className={'Operators'}>
				<button id="add" onClick={() => this.props.hC('+')}>
					+
				</button>
				<button id="subtract" onClick={() => this.props.hC('-')}>
					-
				</button>
				<button id="multiply" onClick={() => this.props.hC('*')}>
					X
				</button>
				<button id="divide" onClick={() => this.props.hC('/')}>
					/
				</button>
				<button id="equals" onClick={this.props.equals}>
					=
				</button>
				<button id="clear" onClick={this.props.clear}>
					AC
				</button>
			</div>
		);
	}
}

class Numbers extends React.Component {
	render() {
		return (
			<div className={'Numbers'}>
				<button id="one" onClick={() => this.props.hC(1)}>
					1
				</button>
				<button id="two" onClick={() => this.props.hC(2)}>
					2
				</button>
				<button id="three" onClick={() => this.props.hC(3)}>
					3
				</button>
				<button id="four" onClick={() => this.props.hC(4)}>
					4
				</button>
				<button id="five" onClick={() => this.props.hC(5)}>
					5
				</button>
				<button id="six" onClick={() => this.props.hC(6)}>
					6
				</button>
				<button id="seven" onClick={() => this.props.hC(7)}>
					7
				</button>
				<button id="eight" onClick={() => this.props.hC(8)}>
					8
				</button>
				<button id="nine" onClick={() => this.props.hC(9)}>
					9
				</button>
				<button id="zero" onClick={() => this.props.hC(0)}>
					0
				</button>
				<button id="decimal" onClick={() => this.props.hC('.')}>
					.
				</button>
			</div>
		);
	}
}

const INITIAL_STATE = {
	display_expr: '0',
	display_clicked: '0',
	isDotClicked: false
};
class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = INITIAL_STATE;

		this.handleClicks = this.handleClicks.bind(this);
		this.evaluation = this.evaluation.bind(this);
		this.clear = this.clear.bind(this);
		this.operators = this.operators.bind(this);
	}

	clear() {
		this.setState(() => INITIAL_STATE);
		this.forceUpdate();
	}

	evaluation() {
		this.setState(prev => {
			try {
				let evaluated = eval(prev.display_expr);
				return {
					...prev,
					display_clicked: evaluated,
					display_expr: evaluated,
					isDotClicked: false
				};
			} catch (e) {
				console.log('e' + e);
				console.log('current expression ' + prev.display_expr);
				console.log('current val on display ' + prev.display_clicked);
			}
		});

		this.forceUpdate();
	}

	handleClicks(val) {
		//should not use display expression
		val = '' + val;
		this.setState(prev => {
			let lenExpr = prev.display_clicked.length;
			let last = prev.display_clicked[lenExpr - 1];
			let isLast = OPR.has(last);
			if (val === '.') {
				//if the dotClicked is true return empty( /do nothing )
				if (prev.isDotClicked) return {};
				else if (isLast) {
					return {
						...prev,
						display_expr: prev.display_expr + '0.',
						display_clicked: '0.',
						isDotClicked: true
					};
				} else {
					return {
						...prev,
						display_expr: prev.display_expr + '.',
						display_clicked: prev.display_clicked + '.',
						isDotClicked: true
					};
				}
			}
			// put dot to false in every state after this

			if (prev.display_clicked === '0' && val === '0') {
				return {};
			} else if (prev.display_clicked === '0') {
				return { ...prev, display_clicked: '' + val, display_expr: '' + val };
			} else {
				if (isLast) {
					return {
						...prev,
						display_clicked: val,
						display_expr: prev.display_expr + val
					};
				}

				return {
					...prev,
					display_clicked: prev.display_clicked + val,
					display_expr: prev.display_expr + val
				};
			}
		});

		this.forceUpdate();
	}

	operators(val) {
		this.setState(prev => {
			if (prev.display_clicked === '0') {
				if (val === '+' && val === '-') {
					return {
						...prev,
						display_clicked: val,
						display_expr: val,
						isDotClicked: false
					};
				} else return {};
			} else if (val === '-') {
				return {
					...prev,
					display_clicked: val,
					display_expr: prev.display_expr + val,
					isDotClicked: false
				};
			} else {
				let len = prev.display_expr.length;
        let i=1;
				let last = prev.display_expr[len - i];
				if (OPR.has(last)) {
					let expr,display = prev.display_expr;
          while(OPR.has(last)){
             expr = display.slice(0, len - i);
              len = expr.length;
              last = expr[len - i];
              display= expr;
          }
            expr = expr +val;
          
					return {
						...prev,
						display_clicked: val,
						display_expr: expr,
						isDotClicked: false
					};
				} else {
					return {
						...prev,
						display_clicked: val,
						display_expr: prev.display_expr + val,
						isDotClicked: false
					};
				}
			}
		});
		this.forceUpdate();
	}

	render() {
		return (
			<div id="myCalculator">
				<div id={'display_expr'}>
					{this.state.display_expr}
				</div>
				<div id={'display'}>{this.state.display_clicked}</div>
				<Numbers hC={this.handleClicks} />
				<Operators
					hC={this.operators}
					equals={this.evaluation}
					clear={this.clear}
				/>
			</div>
		);
	}
}

export default App;
