import React from 'react';
import PropTypes from 'prop-types';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';

import Field from 'redux-form/lib/Field';
import reduxForm from 'redux-form/lib/reduxForm';

import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import CommonFormComponent from '../../CommonField/CommonFormComponent';

import submit from './submit'
import validate from './validate';
import messages from '../../../locale/messages';

import cp from '../../commonStyle.css';
import s from './ConfigSettingsForm.css';
class ConfigSettingsForm extends React.Component {

  static propTypes = {
    initialValues: PropTypes.object,
    title: PropTypes.string.isRequired,
  };


  render() {
    const { error, handleSubmit, submitting } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div className={cx(s.pagecontentWrapper, 'pagecontentAR')}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <h1 className={s.headerTitle}><FormattedMessage {...messages.manageSiteConfig} /></h1>
            <form onSubmit={handleSubmit(submit)}>
              {error && <strong>{error}</strong>}

              <h5 className={cx(s.headingMobile, 'headingMobileRTL')}>{formatMessage(messages.stripeSettings)}</h5>
              <div className={s.girdOne}>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.stripePublishableKey} />
                  </ControlLabel>
                  <Field name="stripePublishableKey" type="text" component={CommonFormComponent} label={formatMessage(messages.stripePublishableKey)} inputClass={cx(cp.formControlInput)} />
                </FormGroup>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.maxUploadLabel} />
                  </ControlLabel>
                  <Field name="maxUploadSize" type="text" component={CommonFormComponent} label={formatMessage(messages.maxUploadLabel)} inputClass={cx(cp.formControlInput)} />
                </FormGroup>
              </div>
              <hr className={s.divider} />
              <h5 className={cx(s.headingMobile, 'headingMobileRTL')}>{formatMessage(messages.smtpSettings)}</h5>
              <div className={s.girdTwo}>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.smtpHost} />
                  </ControlLabel>
                  <Field name="smtpHost" type="text" component={CommonFormComponent} label={formatMessage(messages.smtpHost)} inputClass={cx(cp.formControlInput)} />
                </FormGroup>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.smtpPort} />
                  </ControlLabel>
                  <Field name="smtpPort" type="text" component={CommonFormComponent} label={formatMessage(messages.smtpPort)} inputClass={cx(cp.formControlInput)} />
                </FormGroup>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.smptEmail} />
                  </ControlLabel>
                  <Field name="smptEmail" type="text" component={CommonFormComponent} label={formatMessage(messages.smptEmail)} inputClass={cx(cp.formControlInput)} />
                </FormGroup>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.smtpSender} />
                  </ControlLabel>
                  <Field name="smtpSender" type="text" component={CommonFormComponent} label={formatMessage(messages.smtpSender)} inputClass={cx(cp.formControlInput)} />
                </FormGroup>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.smtpSenderEmail} />
                  </ControlLabel>
                  <Field name="smtpSenderEmail" type="text" component={CommonFormComponent} label={formatMessage(messages.smtpSenderEmail)} inputClass={cx(cp.formControlInput)} />
                </FormGroup>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.smtpPassWord} />
                  </ControlLabel>
                  <Field name="smtpPassWord" type="text" component={CommonFormComponent} label={formatMessage(messages.smtpPassWord)} inputClass={cx(cp.formControlInput)} />
                </FormGroup>
              </div>
              <hr className={s.divider} />
              <h5 className={cx(s.headingMobile, 'headingMobileRTL')}>{formatMessage(messages.twillioSettings)}</h5>
              <div className={s.girdTwo}>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.twillioAccountSid} />
                  </ControlLabel>
                  <Field name="twillioAccountSid" type="text" component={CommonFormComponent} label={formatMessage(messages.twillioAccountSid)} inputClass={cx(cp.formControlInput)} />
                </FormGroup>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.twillioAuthToken} />
                  </ControlLabel>
                  <Field name="twillioAuthToken" type="text" component={CommonFormComponent} label={formatMessage(messages.twillioAuthToken)} inputClass={cx(cp.formControlInput)} />
                </FormGroup>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.twillioPhone} />
                  </ControlLabel>
                  <Field name="twillioPhone" type="text" component={CommonFormComponent} label={formatMessage(messages.twillioPhone)} inputClass={cx(cp.formControlInput)} />
                </FormGroup>
              </div>
              <hr className={s.divider} />
              <h5 className={cx(s.headingMobile, 'headingMobileRTL')}>{formatMessage(messages.paypalSettings)}</h5>
              <div className={s.girdTwo}>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.paypalClientId} />
                  </ControlLabel>
                  <Field name="paypalClientId" type="text" component={CommonFormComponent} label={formatMessage(messages.paypalClientId)} inputClass={cx(cp.formControlInput)} />
                </FormGroup>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.paypalSecret} />
                  </ControlLabel>
                  <Field name="paypalSecret" type="text" component={CommonFormComponent} label={formatMessage(messages.paypalSecret)} inputClass={cx(cp.formControlInput)} />
                </FormGroup>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.paypalHost} />
                  </ControlLabel>
                  <Field name="paypalHost" type="text" component={CommonFormComponent} label={formatMessage(messages.paypalHost)} inputClass={cx(cp.formControlInput)} />
                </FormGroup>
              </div>
              <hr className={s.divider} />
              <h5 className={cx(s.headingMobile, 'headingMobileRTL')}>{formatMessage(messages.googleSettings)}</h5>
              <div className={s.girdOne}>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.googleClientId} />
                  </ControlLabel>
                  <Field name="googleClientId" type="text" component={CommonFormComponent} label={formatMessage(messages.googleClientId)} inputClass={cx(cp.formControlInput)} />
                </FormGroup>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.googleSecretId} />
                  </ControlLabel>
                  <Field name="googleSecretId" type="text" component={CommonFormComponent} label={formatMessage(messages.googleSecretId)} inputClass={cx(cp.formControlInput)} />
                </FormGroup>
              </div>
              <hr className={s.divider} />
              <h5 className={cx(s.headingMobile, 'headingMobileRTL')}>{formatMessage(messages.deepLinkSettings)}</h5>
              <div className={s.girdOne}>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.deepLinkBundleId} />
                  </ControlLabel>
                  <Field name="deepLinkBundleId" type="text" component={CommonFormComponent} label={formatMessage(messages.deepLinkBundleId)} inputClass={cx(cp.formControlInput)} />
                </FormGroup>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.deepLinkContent} />
                  </ControlLabel>
                  <Field
                    className={s.textArea}
                    name="deepLinkContent"
                    component={CommonFormComponent}
                    label={formatMessage(messages.deepLinkContent)}
                    componentClass={"textarea"}
                  />
                </FormGroup>
              </div>
              <hr className={s.divider} />
              <h5 className={cx(s.headingMobile, 'headingMobileRTL')}>{formatMessage(messages.pushNotificationSettings)}</h5>
              <div className={s.girdOne}>
                <FormGroup className={s.space3}>
                  <ControlLabel className={cp.labelTextNew}>
                    <FormattedMessage {...messages.fcmPushNotificationKey} />
                  </ControlLabel>
                  <Field name="fcmPushNotificationKey" component={CommonFormComponent} label={formatMessage(messages.fcmPushNotificationKey)} className={s.textArea} componentClass={"textarea"} />
                </FormGroup>
              </div>
              <div xs={12} sm={12} md={12} lg={12} className={cx(cp.textAlignRight, 'textAlignLeftRtl')}>
                <Button className={cx(cp.btnPrimary, cp.btnLarge)} type="submit" disabled={submitting} >
                  <FormattedMessage {...messages.save} />
                </Button>
              </div>
            </form>
          </Col>
        </Row>
      </div >
    );
  }
}

ConfigSettingsForm = reduxForm({
  form: 'ConfigSettingsForm', // a unique name for this form
  validate
})(ConfigSettingsForm);

export default injectIntl(withStyles(s, cp)(ConfigSettingsForm));

