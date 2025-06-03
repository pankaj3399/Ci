import React, { Component } from 'react';

// Translation
import { injectIntl } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

//Components
import SearchForm from './SearchForm/SearchForm';

import c from './HeaderLocationSearch.css';

class HeaderLocationSearch extends Component {

    render() {

        return (
            <div className={'headerSearch'}>
               <SearchForm/>
            </div>
        )
    }
}



export default injectIntl(withStyles(c)((HeaderLocationSearch)));