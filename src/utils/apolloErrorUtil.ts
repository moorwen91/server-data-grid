import { ApolloError } from '@apollo/client';

export default function getFormattedErrorMessage(
  apolloError: ApolloError,
  rawServerError = false
) {
  const { graphQLErrors, networkError } = apolloError;
  if (networkError) {
    return networkError;
  }

  const errorTail = `Please try again and feel free to contact us if the problem persists.`;
  if (graphQLErrors?.length > 0) {
    let text = graphQLErrors.reduce((acc, curr) => {
      let text = curr.message;
      if (curr.message.includes('. ')) {
        text = curr.message.substr(0, curr.message.indexOf('. ') + 1);
      }
      return `${acc}${text}\n`;
    }, '');
    text = text.endsWith('.\n') ? text : text + '.';
    return rawServerError ? text : `${text} ${errorTail}`;
  }
  return `An unexpected error has happened. ${errorTail}`;
}
