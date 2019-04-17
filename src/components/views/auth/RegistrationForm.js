'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {_t} from 'matrix-react-sdk/lib/languageHandler';

export default class RegistrationForm extends React.PureComponent {
    static propTypes = {
        submitRegistration: PropTypes.func.isRequired,
    };

    state = {
        formError: null,
        inputErrors: {},
        processing: false,
    };

    submit = (e) => {
        e.preventDefault();

        const username = e.target.username.value;
        const password = e.target.password.value;
        const confirm = e.target.confirm.value;
        const token = e.target.token.value;

        if (username === '') {
            this.setState({
                formError: _t('A username is required'),
            });
            return;
        }
        if (password === '') {
            this.setState({
                formError: _t('A password is required'),
            });
            return;
        }
        if (password !== confirm) {
            this.setState({
                formError: _t('The passwords does not match'),
            });
            return;
        }
        if (token === '') {
            this.setState({
                formError: _t('A token is required'),
            });
            return;
        }

        this.setState({
            processing: true,
        });

        const { submitRegistration } = this.props;
        submitRegistration({
            username,
            password,
            confirm,
            token,
        })
            .catch((e) => {
                const newState = {
                    processing: false,
                };

                if (e) {
                    if (typeof e === 'string') { // simple string
                        newState.formError = e;
                    } else if (e.inputs) { // input errors
                        newState.inputErrors = e.inputs;
                    } else if (e.message) { // Error object
                        newState.formError = e.message;
                    }
                } else {
                    newState.formError = _t('A unknown error occurred');
                }

                this.setState(newState);
            });
    };

    renderFormError() {
        const { formError } = this.state;

        if (!formError) {
            return null;
        }

        return (
            <div className="mx_Login_error">
                {formError}
            </div>
        );
    }

    renderInputError(name) {
        const { inputErrors } = this.state;

        if (name in inputErrors) {
            return <span className="mx_Login_error">{inputErrors[name].join('. ')}</span>;
        }

        return null;
    }

    render() {
        const { processing } = this.state;
        return (
            <div>
                {this.renderFormError()}
                <form method="post" onSubmit={this.submit}>
                    <input
                        type="text"
                        name="username"
                        className="mx_Login_field"
                        placeholder={_t('Your username')}
                        pattern="^@?[a-zA-Z_\-=\.\/0-9]+$"
                        minLength={1}
                        maxLength={200}
                    />
                    {this.renderInputError('username')}
                    <input
                        type="password"
                        name="password"
                        className="mx_Login_field"
                        minLength={10}
                        maxLength={128}
                        placeholder={_t('Your password')}
                    />
                    {this.renderInputError('password')}
                    <input
                        type="password"
                        name="confirm"
                        className="mx_Login_field"
                        minLength={10}
                        maxLength={128}
                        placeholder={_t('Repeat your password')}
                    />
                    {this.renderInputError('confirm')}
                    <input
                        type="text"
                        name="token"
                        className="mx_Login_field"
                        pattern="^[A-Za-z]+$"
                        placeholder={_t('Your invite token')}
                    />
                    {this.renderInputError('token')}
                    <br />
                    <input
                        type="submit"
                        className="mx_Login_submit"
                        value={_t('Register')}
                        disabled={processing}
                    />
                </form>
            </div>
        );
    }
}

