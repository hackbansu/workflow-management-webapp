import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './index.scss';

export class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
        };

        const { onSubmit } = this.props;

        this.submitForm = (email, password) => ev => {
            ev.preventDefault();
            onSubmit(email, password);
        };
    }

    componentDidMount() {}

    render() {
        const { email, password } = this.state;

        return (
            <div className="login-form-cover">
                <form method="post" onSubmit={this.submitForm(email, password)}>
                    <label>
                        email:
                        <input
                            type="email"
                            name="username"
                            placeholder="eg. user@example.com"
                            onChange={e => this.setState({ email: e.target.value })}
                        />
                    </label>
                    <br />
                    <label>
                        password:
                        <input
                            type="password"
                            name="password"
                            onChange={e => this.setState({ password: e.target.value })}
                        />
                    </label>
                    <br />
                    <input type="submit" value="log in" />
                </form>
            </div>
        );
    }
}

LoginForm.propTypes = {};

LoginForm.defaultProps = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);
