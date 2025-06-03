import moment from "moment";
import { convert } from "./currencyConvertion";
import dayDifferenceHelper from "./dayDifferenceHelper";

const billDetailsHelpers = ({
    serviceFees, monthlyDiscount, weeklyDiscount, startDate, delivery,
    endDate, startTime, endTime, basePrice, specialPricing, base, rates,
    discountForMonth, discountForWeek, currency, securityDeposit
}) => {

    let dayDifference, stayedNights = [], isSpecialPriceAssigned = false, bookingSpecialPricing = [];
    let priceForDays = 0, discount = 0, discountType = null, total = 0, isAverage = 0, isDayTotal = 0;
    let currentDay, totalWithoutServiceFee = 0, serviceFee = 0, hostServiceFee = 0;

    if (startDate && endDate) {
        dayDifference = dayDifferenceHelper({ startTime, endTime, startDate, endDate });

        if (dayDifference > 0) {
            /* Find stayed nights. */
            for (let i = 0; i < dayDifference; i++) {
                let currentDate = moment(startDate).add(i, 'day');
                stayedNights.push(currentDate);
            };

            if (stayedNights && stayedNights.length > 0) {
                stayedNights.map((item) => {
                    let isSpecialPricing;
                    if (item) {
                        let pricingRow, currentPrice;
                        currentDay = (moment(item).format('dddd').toLowerCase());
                        isSpecialPricing = specialPricing.find(o => moment(item).format('MM/DD/YYYY') == moment(o.blockedDates).format('MM/DD/YYYY'));

                        if (isSpecialPricing && isSpecialPricing.isSpecialPrice) {
                            isSpecialPriceAssigned = true;
                            currentPrice = Number(isSpecialPricing.isSpecialPrice);
                        } else {
                            currentPrice = Number(basePrice);
                        }
                        // Price object
                        pricingRow = {
                            blockedDates: item,
                            isSpecialPrice: currentPrice,
                        };
                        bookingSpecialPricing.push(pricingRow);
                    }
                });
            };
        }

        if (isSpecialPriceAssigned) {
            bookingSpecialPricing.map((item) => {
                priceForDays = priceForDays + Number(item.isSpecialPrice);
            });
        } else {
            bookingSpecialPricing.map((item) => {
                priceForDays = priceForDays + Number(item.isSpecialPrice);
            });
        };
    };

    isAverage = Number(priceForDays) / Number(dayDifference);
    isDayTotal = isAverage.toFixed(2) * dayDifference;
    priceForDays = isDayTotal;

    if (dayDifference >= 7) {
        if (monthlyDiscount > 0 && dayDifference >= 28) {
            discount = (Number(priceForDays) * Number(monthlyDiscount)) / 100;
            discountType = monthlyDiscount + "% " + discountForMonth;
        } else {
            discount = (Number(priceForDays) * Number(weeklyDiscount)) / 100;
            discountType = weeklyDiscount + "% " + discountForWeek;
        }
    };

    totalWithoutServiceFee = (isDayTotal + delivery) - discount;

    if (serviceFees) {
        if (serviceFees?.guest?.type === 'percentage') {
            serviceFee = totalWithoutServiceFee * (Number(serviceFees?.guest?.value) / 100);
        } else {
            serviceFee = convert(base, rates, serviceFees?.guest?.value, serviceFees?.guest?.currency, currency);
        }

        if (serviceFees?.host?.type === 'percentage') {
            hostServiceFee = totalWithoutServiceFee * (Number(serviceFees?.host?.value) / 100);
        } else {
            hostServiceFee = convert(base, rates, serviceFees?.host?.value, serviceFees?.host?.currency, currency);
        }
    }
    total = (priceForDays + serviceFee + delivery + securityDeposit) - discount;

    return {
        isAverage, isDayTotal, discount, discountType, priceForDays,
        serviceFee, hostServiceFee, total, dayDifference, isSpecialPriceAssigned, bookingSpecialPricing
    }
};

export default billDetailsHelpers;