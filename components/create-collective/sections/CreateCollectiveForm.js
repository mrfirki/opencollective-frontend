import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Flex, Box } from '@rebass/grid';
import { assign, get } from 'lodash';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import themeGet from '@styled-system/theme-get';
import styled from 'styled-components';

import { H1, P } from '../../Text';
import Container from '../../Container';
import Illustration from '../../home/HomeIllustration';
import StyledCheckbox from '../../StyledCheckbox';
import StyledInput from '../../StyledInput';
import StyledInputField from '../../StyledInputField';
import StyledInputGroup from '../../StyledInputGroup';
import StyledButton from '../../StyledButton';
import MessageBox from '../../MessageBox';
import Link from '../../Link';
import ExternalLink from '../../ExternalLink';

const BackLink = styled(Link)`
  color: ${themeGet('colors.black.600')};
  font-size: ${themeGet('fontSizes.Paragraph')}px;
`;

class CreateCollectiveForm extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    host: PropTypes.object,
    query: PropTypes.object,
    collective: PropTypes.object,
    loading: PropTypes.bool,
    onSubmit: PropTypes.func,
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    const collective = { ...props.collective }; // {}

    this.state = {
      collective,
      tosChecked: false,
      hostTosChecked: false,
    };

    this.messages = defineMessages({
      introduceSubtitle: {
        id: 'createCollective.subtitle.introduce',
        defaultMessage: 'Introduce your Collective to the community.',
      },
      back: {
        id: 'Back',
        defaultMessage: 'Back',
      },
      header: { id: 'home.create', defaultMessage: 'Create a Collective' },
      nameLabel: { id: 'createCollective.form.nameLabel', defaultMessage: "What's the name of your collective?" },
      slugLabel: { id: 'createCollective.form.slugLabel', defaultMessage: 'What URL would you like?' },
      descriptionLabel: {
        id: 'createCollective.form.descriptionLabel',
        defaultMessage: 'What does your collective do?',
      },
      createButton: {
        id: 'collective.create.button',
        defaultMessage: 'Create Collective',
      },
    });
  }

  handleChange(fieldname, value) {
    this.setState(state => ({
      ...state,
      collective: {
        ...state.collective,
        [fieldname]: value,
      },
    }));
  }

  render() {
    const { intl, error, query, host } = this.props;

    const initialValues = {
      name: '',
      description: '',
      slug: '',
    };

    const validate = values => {
      const errors = {};

      if (values.name.length > 50) {
        errors.name = 'Please use fewer than 50 characters';
      }

      if (values.slug.length > 30) {
        errors.slug = 'Please use fewer than 30 characters';
      }

      if (values.description.length > 160) {
        errors.description = 'Please use fewer than 160 characters';
      }

      return errors;
    };

    const submit = values => {
      const { description, name, slug } = values;
      const collective = {
        name,
        description,
        slug,
      };
      assign(collective, this.state.collective);
      this.props.onSubmit(collective);
    };

    return (
      <Flex flexDirection="column" m={[3, 0]}>
        <Flex flexDirection="column" my={[2, 4]}>
          <Box textAlign="left" minHeight={['32px']} width={[null, 832, 950, 1024]}>
            <BackLink
              route="new-create-collective"
              params={{ hostCollectiveSlug: query.hostCollectiveSlug, verb: query.verb }}
            >
              ←&nbsp;{intl.formatMessage(this.messages.back)}
            </BackLink>
          </Box>
          <Box mb={[2, 3]}>
            <H1
              fontSize={['H5', 'H3']}
              lineHeight={['H5', 'H3']}
              fontWeight="bold"
              textAlign="center"
              color="black.900"
            >
              {intl.formatMessage(this.messages.header)}
            </H1>
          </Box>
          <Box textAlign="center" minHeight={['24px']}>
            <P fontSize="LeadParagraph" color="black.600" mb={2}>
              {intl.formatMessage(this.messages.introduceSubtitle)}
            </P>
          </Box>
        </Flex>
        {error && (
          <Flex alignItems="center" justifyContent="center">
            <MessageBox type="error" withIcon mb={[1, 3]}>
              {error.replace('GraphQL error: ', 'Error: ')}
            </MessageBox>
          </Flex>
        )}
        <Flex alignItems="center" justifyContent="center">
          <Container
            mb={[1, 5]}
            width={[320, 512, 576]}
            border={['none', '1px solid #E6E8EB']}
            borderRadius={['none', '8px']}
            px={[1, 4]}
          >
            <Formik validate={validate} initialValues={initialValues} onSubmit={submit} validateOnChange={true}>
              {formik => {
                const { values, handleSubmit, errors, touched } = formik;

                return (
                  <Form>
                    <StyledInputField
                      name="name"
                      htmlFor="name"
                      error={touched.name && errors.name}
                      label={intl.formatMessage(this.messages.nameLabel)}
                      value={values.name}
                      required
                      my={4}
                    >
                      {inputProps => <Field as={StyledInput} {...inputProps} placeholder="Agora Collective" />}
                    </StyledInputField>
                    <StyledInputField
                      name="slug"
                      htmlFor="slug"
                      error={touched.slug && errors.slug}
                      label={intl.formatMessage(this.messages.slugLabel)}
                      value={values.slug}
                      required
                      my={4}
                    >
                      {inputProps => (
                        <Field as={StyledInputGroup} {...inputProps} prepend="opencollective.com" placeholder="agora" />
                      )}
                    </StyledInputField>
                    <StyledInputField
                      name="description"
                      htmlFor="description"
                      error={touched.description && errors.description}
                      label={intl.formatMessage(this.messages.descriptionLabel)}
                      value={values.description}
                      required
                      my={4}
                    >
                      {inputProps => (
                        <Field as={StyledInput} {...inputProps} placeholder="Making the world a better place" />
                      )}
                    </StyledInputField>

                    <Box mx={1} my={4}>
                      <StyledCheckbox
                        name="tos"
                        label={
                          <FormattedMessage
                            id="createcollective.tos.label"
                            defaultMessage="I agree with the {toslink} of Open Collective."
                            values={{
                              toslink: (
                                <ExternalLink href="/tos" openInNewTab>
                                  <FormattedMessage id="tos" defaultMessage="terms of service" />
                                </ExternalLink>
                              ),
                            }}
                          />
                        }
                        size={['Caption', 'Paragraph']}
                        required
                        checked={this.state.tosChecked}
                        onChange={({ checked }) => {
                          this.handleChange('tos', checked);
                          this.setState({ tosChecked: checked });
                        }}
                      />
                      {get(host, 'settings.tos') && (
                        <StyledCheckbox
                          name="hostTos"
                          label={
                            <FormattedMessage
                              id="createcollective.hosttos.label"
                              defaultMessage="I agree with the the {hosttoslink} of the host that will collect money on behalf of our collective."
                              values={{
                                hosttoslink: (
                                  <ExternalLink href={get(host, 'settings.tos')} openInNewTab>
                                    <FormattedMessage id="fiscaltos" defaultMessage="terms of fiscal sponsorship" />
                                  </ExternalLink>
                                ),
                              }}
                            />
                          }
                          size={['Caption', 'Paragraph']}
                          required
                          checked={this.state.hostTosChecked}
                          onChange={({ checked }) => {
                            this.handleChange('hostTos', checked);
                            this.setState({ hostTosChecked: checked });
                          }}
                        />
                      )}
                    </Box>

                    <Flex justifyContent={['center', 'left']} mb={4}>
                      <StyledButton
                        fontSize="13px"
                        height="36px"
                        width="148px"
                        buttonStyle="primary"
                        type="submit"
                        onSubmit={handleSubmit}
                      >
                        {intl.formatMessage(this.messages.createButton)}
                      </StyledButton>
                    </Flex>
                  </Form>
                );
              }}
            </Formik>
            <Flex justifyContent="center" mb={4} display={['flex', 'none']}>
              <Illustration
                display={['block', 'none']}
                src="/static/images/createcollective-mobile-form.png"
                width="320px"
                height="200px"
              />
            </Flex>
          </Container>
        </Flex>
      </Flex>
    );
  }
}

export default injectIntl(CreateCollectiveForm);
