import React, { Component } from 'react';
import Scroll from 'react-scroll'; // Imports all Mixins
// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './WhyHostBanner.css';
import cs from '../../components/commonStyle.css';
import {
    Row, Col, Button
} from 'react-bootstrap';
import cx from 'classnames';
// Translation
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

// Locale
import messages from '../../locale/messages';
// History
import history from '../../core/history';

// Actions
import { openSignupModal } from '../../actions/modalActions';
import { photosShow } from '../../helpers/photosShow';
import { homebanneruploadDir } from '../../config';

//Image
import icon from '/public/SiteIcons/bikeIconLight.svg';
import whyhostbanner from '/public/SiteImages/whyhostbanner.png';
import learnIcon from '/public/SiteIcons/learnIcon.png';


// Or Access Link,Element,etc as follows
let Link = Scroll.Link;
class WhyHostBanner extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const { isAuthenticated } = this.props;
        if (isAuthenticated) {
            history.push('/become-a-owner?mode=new');
        } else {
            history.push('/login?refer=/become-a-owner?mode=new');
        }
    }

    render() {
        const { data } = this.props;
        let path = photosShow(homebanneruploadDir);

        return (
            <div className={s.container}>
                <div className={cx(s.Banner, cs.dFlex, s.noflex)} style={{ backgroundImage: `url(${path}${data && data.hostBannerImage1})` }}>
                    <Row className={cx(cs.dFlex, s.noflex, s.minWidthBanner)}>
                        <Col lg={6} md={7} sm={12} xs={12}>
                            <div className={s.tip}>{data && data.hostBannerContent2}</div>
                            <h1 className={s.mainText}>
                                {data && data.hostBannerTitle1}
                            </h1>
                            <p className={s.listText}>
                                {data && data.hostBannerContent1}
                            </p>
                            <div className={cx(s.whyHostdoubleButton, cs.spaceBottom4)}>
                                <Button
                                    className={cx(s.listButton, cs.btnPrimary)}
                                    onClick={this.handleClick}
                                >
                                    <img src={icon} className='imgIconRight' />
                                    <span>{data?.buttonLabel} </span>
                                </Button>
                                <Link
                                    to="scrollSection"
                                    spy={true}
                                    smooth={true}
                                    offset={1} duration={500}
                                    className={cx(cs.btnSecondary, s.whyHostLearMoreBtn)}
                                >
                                    <img src={learnIcon} className={cx('imgIconRight', s.learnIconCss)} />
                                    <span>{data?.buttonLabel2} </span>
                                </Link>
                            </div>
                        </Col>
                        <Col lg={6} md={5} sm={12} xs={12}>
                            <img src={whyhostbanner} className={s.leftImageCss} />
                        </Col>
                    </Row>
                </div>
            </div >

        );
    }
}

const mapState = (state) => ({
    isAuthenticated: state.runtime.isAuthenticated
});

const mapDispatch = {
    openSignupModal
};

export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(WhyHostBanner)));
