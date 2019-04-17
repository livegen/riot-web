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
            return <div className="mx_Login_error" style={{paddingBottom: '10px'}}>{inputErrors[name].join('. ')}</div>;
        }

        return null;
    }

    render() {
        const { processing } = this.state;
        return (
            <div>
                {this.renderFormError()}
                <form method="post" onSubmit={this.submit}>
                    <div className="mx_AuthBody_fieldRow">
                        <div className="mx_Field mx_Field_input">
                            <input
                                type="text"
                                name="username"
                                id="mx_RegistrationForm_username"
                                placeholder={_t('Your username')}
                                pattern="^@?[a-zA-Z_\-=\.\/0-9]+$"
                                minLength={1}
                                maxLength={200}
                            />
                            <label htmlFor="mx_RegistrationForm_username">{_t('Your username')}</label>
                        </div>
                    </div>
                    {this.renderInputError('username')}

                    <div className="mx_AuthBody_fieldRow">
                        <div className="mx_Field mx_Field_input">
                            <input
                                type="password"
                                name="password"
                                id="mx_RegistrationForm_password"
                                minLength={10}
                                maxLength={128}
                                placeholder={_t('Your password')}
                            />
                            <label htmlFor="mx_RegistrationForm_password">{_t('Your password')}</label>
                        </div>
                        <div className="mx_Field mx_Field_input">
                            <input
                                type="password"
                                name="confirm"
                                id="mx_RegistrationForm_passwordConfirm"
                                minLength={10}
                                maxLength={128}
                                placeholder={_t('Confirm')}
                            />
                            <label htmlFor="mx_RegistrationForm_passwordConfirm">{_t('Confirm')}</label>
                        </div>
                    </div>
                    {this.renderInputError('password')}
                    {this.renderInputError('confirm')}

                    <div className="mx_AuthBody_fieldRow">
                        <div className="mx_Field mx_Field_input">
                            <input
                                type="text"
                                name="token"
                                id="mx_RegistrationForm_token"
                                pattern="^[A-Za-z]+$"
                                placeholder={_t('Your invite token')}
                            />
                            <label htmlFor="mx_RegistrationForm_token">{_t('Your invite token')}</label>
                        </div>
                    </div>
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

