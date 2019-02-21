/* @flow */

import fetch from 'isomorphic-fetch';

export default (urlString: string) => (
  new Promise<void>((resolve, reject) => {
    fetch(urlString)
      .then(response => response.json())
      .then(response => resolve(response))
      .catch((error) => {
        reject(error);
      });
  })
);
