import React from "react";
import { FcFlashOn } from "react-icons/fc";
import { FormattedMessage, injectIntl } from "react-intl";
import cx from 'classnames';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import { connect } from "react-redux";

import CurrencyConverter from "../../CurrencyConverter/CurrencyConverter";
import ListCoverPhoto from "../../ListCoverPhoto/ListCoverPhoto";
import WishListIcon from "../../WishListIcon/WishListIcon";

import messages from "../../../locale/messages";
import { formatURL } from "../../../helpers/formatURL";

import startIcon from '/public/SiteIcons/star.svg';
import arrowIcon from '/public/SiteIcons/rentNowArrow.svg';
import bikeIcon from '/public/SiteIcons/bikeIcon.svg';

import s from '../../Home/HomeSlider/HomeSlider.css';
import cs from '../../../components/commonStyle.css';

class CommonListingItems extends React.Component {

    render() {
        const { key, id, wishListStatus, basePrice, currency, bookingType, title, carType, transmissionLabel, starRatingValue } = this.props;
        const { account, userId, reviewsStarRating, coverPhoto, listPhotos, isListingSwiper, isEditWishList, transmission } = this.props;
        const { formatMessage } = this.props.intl;
        let currentUser = account?.userId, isWhisListIcon = false;

        if (userId == currentUser) {
            isWhisListIcon = true;
        }

        return (
            <div>
                <div>
                    {
                        !isWhisListIcon && <WishListIcon listId={id} key={key} isChecked={wishListStatus} isEditWishList={isEditWishList} />
                    }
                    <a href={"/cars/" + formatURL(title) + '-' + id} target={'_blank'} className={cs.textDecorationNone}>
                        <div className={s.boxShadow}>
                            <ListCoverPhoto
                                className={s.HRCar}
                                listPhotos={listPhotos}
                                coverPhoto={coverPhoto}
                                photoType={"x_medium"}
                                bgImage
                            />
                            <div className={s.PerDayWrap}>

                            </div>
                            <div className={s.sliderbackground}>
                                <div className={cx(s.HRDetails, 'HRDetailsRTL')}>
                                    <div className={cx(s.trip, s.hiddentextSlider, 'hiddentextSliderRTL')}>
                                        <img src={bikeIcon} className={cx(s.carType, 'carTypeIconRTL')} />
                                        <span className='carTypeRTL'>{carType}</span>
                                        <span className={s.dotCss}></span>
                                        {/* <span className={s.textFlow}>{transmissionLabel}</span> */}
                                    </div>
                                </div>
                                <div className={cx(s.PerDay)}>
                                    {
                                        bookingType === "instant" && <span><FcFlashOn className={s.instantIcon} /></span>
                                    }
                                    <CurrencyConverter
                                        amount={basePrice}
                                        from={currency}
                                    />
                                    <span className={cx(s.perNightCss, 'PerDayRTL')}>{' '}{formatMessage(messages.perNight)}</span>
                                </div>
                                <h3 className={s.titleCss}>{title}</h3>
                                <div className={s.HRRight}>
                                    {starRatingValue > 0 && <div className={cx(s.reviewCss, 'reviewCssSliderRTL')}>
                                        <img src={startIcon} className={cx(s.reviewCssImg, 'reviewCssImgRTL')} /><span>{starRatingValue}</span>
                                    </div>}
                                    <a className={cx(s.btn, cs.textDecorationNone)} href={"/cars/" + formatURL(title) + '-' + id} target={'_blank'}>
                                        <span className={cs.vtrMiddle}><FormattedMessage {...messages.rentNowText} /></span>
                                        <img src={arrowIcon} className={cx(s.arrowIconCss, 'sliderArrowRTL')} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        )
    }

}

const mapState = (state) => ({
    account: state?.account?.data
});

const mapDispatch = {};

export default injectIntl(withStyles(s, cs)(connect(mapState, mapDispatch)(CommonListingItems)));