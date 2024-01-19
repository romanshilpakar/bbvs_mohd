import moment from 'moment';

export function convertToHumanReadable(params: any) {
    return moment(params).format("MMM Do YYYY, h:mm a");
}