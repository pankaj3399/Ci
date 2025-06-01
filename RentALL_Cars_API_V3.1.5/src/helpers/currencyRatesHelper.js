import { CurrencyRates, Currencies } from '../data/models';

const getCurrencyRates = async () => {
    let rates = {};
    const currencyRatesData = await CurrencyRates.findAll({
        attributes: ['currencyCode', 'rate', 'isBase'],
        raw: true
    });
    const base = await Currencies.findOne({ where: { isBaseCurrency: true } });
    currencyRatesData.map((item) => { rates[item.currencyCode] = item.rate });

    return {
        base,
        rates
    };
}

export default getCurrencyRates;