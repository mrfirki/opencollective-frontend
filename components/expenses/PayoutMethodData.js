import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { PayoutMethodType } from '../../lib/constants/payout-method';
import { FormattedMessage } from 'react-intl';
import { Span } from '../Text';

/**
 * @returns boolean: True if the payout method has displayable data
 */
export const payoutMethodHasData = payoutMethod => {
  switch (payoutMethod.type) {
    case PayoutMethodType.PAYPAL:
      return Boolean(get(payoutMethod, 'data.email'));
    case PayoutMethodType.OTHER:
      return Boolean(get(payoutMethod, 'data.content'));
    default:
      return false;
  }
};

const PrivateFallback = () => (
  <Span color="black.500" fontStyle="italic">
    <FormattedMessage id="Private" defaultMessage="Private" />
  </Span>
);

/**
 * Shows the data of the given payout method
 */
const PayoutMethodData = ({ payoutMethod }) => {
  switch (payoutMethod.type) {
    case PayoutMethodType.PAYPAL:
      return get(payoutMethod, 'data.email') || <PrivateFallback />;
    case PayoutMethodType.OTHER:
      return get(payoutMethod, 'data.content') || <PrivateFallback />;
    default:
      return null;
  }
};

PayoutMethodData.propTypes = {
  payoutMethod: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.oneOf(Object.values(PayoutMethodType)),
    data: PropTypes.object,
  }),
};

// @component
export default PayoutMethodData;
