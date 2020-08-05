'use strict';

import React from 'react';
import Matrix from 'matrix-js-sdk';
import * as sdk from 'matrix-react-sdk';
import dispatcher from 'matrix-react-sdk/src/dispatcher/dispatcher';
import { _t } from 'matrix-react-sdk/lib/languageHandler';
import RegistrationForm from "./RegistrationForm";

export default class VectorAuthRegistration extends React.PureComponent {
    static replaces = 'structures.auth.Registration';

    state = {
        success: false,
    };

    onLoginClick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this.props.onLoginClick();
    };

    submitRegistration = (data) => {
        return new Promise((resolve, reject) => {
            const { serverConfig } = this.props;

            const request = Matrix.getRequest();
            const opts = {
                uri: `${serverConfig.hsUrl}/register`,
                method: 'POST',
                form: data,
                json: false,
            };

            request(opts, (err, response, body) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (response.statusCode >= 200 && response.statusCode < 300) {
                    resolve();
                    this.setState({
                        success: true,
                    }, () => setTimeout(() => dispatcher.dispatch({ action: 'start_login' }), 3000));
                    return;
                }

                if (!body) {
                    reject(_t('No response received'));
                    return;
                }

                try {
                    const json = JSON.parse(body);
                    if (!json) {
                        reject(_t('Invalid response received'));
                        return;
                    }

                    if (json.errcode === 'MR_BAD_USER_REQUEST') {
                        reject({ inputs: json.error });
                        return;
                    }

                    reject(json.errcode);
                } catch (e) {
                    reject(response.statusText);
                }
            });
        });
    };

    renderContent() {
        const { success } = this.state;

        if (success) {
            return (
                <div>
                    {_t('Account created with success')}
                    <br />
                    {_t('You will be redirected soon to login page')}
                    <br />
                    <br />
                </div>
            );
        }

        return <RegistrationForm submitRegistration={this.submitRegistration} />;
    }

    render() {
        const AuthHeader = sdk.getComponent('auth.AuthHeader');
        const AuthBody = sdk.getComponent("auth.AuthBody");
        const AuthPage = sdk.getComponent('auth.AuthPage');

        return (
            <AuthPage>
                <AuthHeader />
                <AuthBody>
                    <h2>{ _t('Create your account') }</h2>


                    {this.renderContent()}

                    <a className="mx_AuthBody_changeFlow" onClick={this.onLoginClick} href="#">
                        { _t('Sign in instead') }
                    </a>
                </AuthBody>
            </AuthPage>
        );
    }
}

