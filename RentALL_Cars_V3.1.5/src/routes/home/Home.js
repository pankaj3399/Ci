import React from 'react';
import { compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Loader from '../../components/Loader';
import RecommendListing from '../../components/Home/RecommendListing';
import MostViewedListing from '../../components/Home/MostViewedListing';
import PopularLocation from '../../components/Home/PopularLocation';
import ImageBanner from '../../components/Home/ImageBanner';
import StaticInfoBlock from '../../components/Home/StaticInfoBlock';
import HomeBanner from '../../components/Home/HomeBanner';

import { closeWishListModal } from '../../actions/WishList/modalActions';
import s from './Home.css';
import l from '../../components/Skeleton/Skeleton.css';

// Skeleton Loader
class Homepage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sliderArray: [1, 2, 3, 4]
    };
  }

  componentDidMount() {
    this.setState({ isLoad: false });
    let isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    }
  }

  componentWillUnmount() {
    const { closeWishListModal } = this.props;
    let isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      window.removeEventListener('resize', this.handleResize);
    }
    closeWishListModal();
  }

  handleResize = (e) => {
    let isBrowser, tabView;
    isBrowser = typeof window !== 'undefined';
    tabView = isBrowser ? window.matchMedia('(max-width: 1200px)').matches : false;
    this.setState({
      sliderArray: tabView ? [1, 2, 3] : [1, 2, 3, 4],
    });
  }

  render() {
    const { layoutType } = this.props;
    const { wholeData } = this.props;
    if (!wholeData) return <Loader type="text" />;
    return (
      <div className={s.root}>
        <HomeBanner layoutType={layoutType} wholeData={wholeData} />
        <RecommendListing skeletonArray={this.state.sliderArray} />
        <MostViewedListing skeletonArray={this.state.sliderArray} />
        <PopularLocation />
        <ImageBanner />
        <StaticInfoBlock />
      </div>
    );
  }
}
const mapState = (state) => ({

});

const mapDispatch = {
  closeWishListModal
};

export default compose(
  injectIntl,
  withStyles(s, l),
  connect(mapState, mapDispatch)
)(Homepage);
