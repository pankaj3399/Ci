import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import axios from 'axios';
import { googleMapLoader } from '../../../helpers/googleMapLoader';
import debounce from '../../../helpers/debounce';
import messages from '../../../locale/messages';
import { googleMapAPI, autoCompleteURL, placeDetailURL } from '../../../config';

class PlaceGeoSuggest extends Component {

    static propTypes = {
        id: PropTypes.any,
        className: PropTypes.string,
        containerClass: PropTypes.string,
        placeholder: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            googleMapsApiLoaded: false,
            value: null,
            suggestion: []
        }
        this.dropdownRef = createRef();
    }

    async componentDidMount() {
        const { initialValue } = this.props;
        this.setState({ value: initialValue });
        await googleMapLoader('places');
        this.setState({ googleMapsApiLoaded: true });
        const isDocument = typeof document !== undefined;
        if (isDocument) {
            document.addEventListener('mousedown', this.handleClickOutside);
            document.addEventListener('touchstart', this.handleClickOutside);
        }
    }

    componentWillUnmount() {
        const isDocument = typeof document !== undefined;
        if (isDocument) {
            document.addEventListener('mousedown', this.handleClickOutside);
            document.addEventListener('touchstart', this.handleClickOutside);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { initialValue } = nextProps;
        this.setState({ value: initialValue });
    }

    handleClickOutside = (event) => {
        const { id } = this.props;
        if (this.dropdownRef?.current && !this.dropdownRef?.current?.contains(event?.target)) {
            this.setState({ suggestion: [] });
            const parentSection = document.getElementById('safariFailureGeoSuggestionDropDown' + id);
            const childSection = document.getElementById('suggestItem' + id);
            if (parentSection && childSection) {
                parentSection.removeChild(childSection);
            }
        }
    }

    handleAutoComplete = debounce(async (e) => {
        const { onChange } = this.props;
        const value = e?.target?.value;
        onChange && onChange(value);
        if (value?.length > 0) {
            const requestData = {
                input: value
                // locationBias: {
                // 	circle: {
                // 		center: {
                // 			latitude: 37.7937,
                // 			longitude: -122.3965
                // 		},
                // 		radius: 500.0
                // 	}
                // }
            };
            axios.post(
                autoCompleteURL,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Goog-Api-Key': googleMapAPI
                    }
                }
            ).then(response => {
                if (response?.data?.suggestions?.length > 0) {
                    this.setState({
                        suggestion: response?.data?.suggestions
                    });
                }
            }).catch(error => {
                console.error('Error:', error?.response ? error?.response?.data : error?.message);
            });
        }
    }, 100)

    handleSuggest = async ({ placeId, value }) => {
        const { onSuggestSelect } = this.props;
        if (placeId) {
            try {
                const response = await axios.get(`${placeDetailURL}${placeId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Goog-Api-Key': googleMapAPI,
                        'X-Goog-FieldMask': '*'
                    }
                });
                if (response?.data) {
                    onSuggestSelect(response?.data, value);
                    this.setState({ value, suggestion: [] });
                }
            } catch (error) {
                console.error('Place Details Error:', error?.response?.data || error?.message);
            }
        }
    }

    handleGeoSuggestFailure = (e) => {
        const { id } = this.props;
        const { formatMessage } = this.props.intl;
        const suggestionsContainer = document.getElementById('safariFailureGeoSuggestionDropDown' + id);
        suggestionsContainer.style.display = "block";
        let suggestionItem = document.createElement("div");
        suggestionItem.id = 'suggestItem' + id;
        suggestionItem.classList.add('suggestItem')
        suggestionItem.textContent = formatMessage(messages.locationWarning);
        if (e.target.value != "") {
            if (!document.getElementById('suggestItem' + id)) {
                suggestionsContainer.appendChild(suggestionItem);
            }
        } else {
            const parentSection = document.getElementById('safariFailureGeoSuggestionDropDown' + id);
            const childSection = document.getElementById('suggestItem' + id);
            if (parentSection && childSection) {
                parentSection.removeChild(childSection);
            }
        }
    }

    render() {

        const { placeholder, id, containerClassName } = this.props;
        const { googleMapsApiLoaded, value, suggestion } = this.state;

        return (
            <div className={containerClassName} ref={this.dropdownRef}>
                {
                    googleMapsApiLoaded ?
                        <div className='manualGeoSuggestContainer'>
                            <input
                                id={id}
                                type='text'
                                className='manualGeoSuggestInput widthFull'
                                placeholder={placeholder}
                                value={value}
                                autoComplete='off'
                                onChange={(e) => {
                                    this.setState({ value: e?.target?.value });
                                    if (e?.target?.value?.length > 0) {
                                        this.handleAutoComplete(e);
                                    } else {
                                        this.setState({ suggestion: [] });
                                    }
                                }}
                            />
                            {
                                suggestion?.length > 0 && (
                                    <ul className='manualGeoSuggestListWrapper'>
                                        {
                                            suggestion?.map((item, itemIndex) => {
                                                return (
                                                    <li key={itemIndex} className='manualGeoSuggestList'
                                                        onClick={() => this.handleSuggest({ placeId: item?.placePrediction?.placeId, value: item?.placePrediction?.text?.text })}
                                                    >
                                                        {item?.placePrediction?.text?.text}
                                                    </li>
                                                )
                                            })}
                                    </ul>
                                )
                            }
                        </div>
                        :
                        <div className='manualGeoSuggestContainer'>
                            <input
                                type='text'
                                className='manualGeoSuggestInput widthFull'
                                placeholder={placeholder}
                                value={value}
                                autoComplete='off'
                                onChange={(e) => this.handleGeoSuggestFailure(e)}
                            />
                            <div id={'safariFailureGeoSuggestionDropDown' + id} className='safariManualGeoSuggestListWrapper' />
                        </div>
                }
            </div>
        )
    }
}

export default injectIntl(PlaceGeoSuggest);