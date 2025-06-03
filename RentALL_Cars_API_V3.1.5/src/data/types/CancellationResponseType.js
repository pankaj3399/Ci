import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';
import ReservationCancelType from './ReservationCancelType';

const CancellationResponseType = new ObjectType({
    name: 'CancellationResponse',
    fields: {
        results: { 
            type: ReservationCancelType
        },
        status: { 
            type: IntType 
        },
        errorMessage: { 
            type: StringType 
        }
    }
});

export default CancellationResponseType;
