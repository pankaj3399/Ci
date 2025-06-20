import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BannerCaption.css';
import cx from 'classnames';
import Loader from '../../Loader';

class BannerCaption extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,
      getBanner: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        content: PropTypes.string,
      }),
    }),
  };

  render() {
    const { data: { loading, getBanner } } = this.props;

    if (loading || !getBanner) {
      return <Loader type={"text"} />
    } else {
      return (

        <div className={cx(s.bannerCaptionContainer)}>
          {/* <h1 className={cx(s.noMargin, s.bannerCaptionText)}>
            {getBanner.title}
            {' '} {getBanner.content}
          </h1> */}
        </div>
      );
    }
  }
}

export default withStyles(s)(BannerCaption);