# cogent-labs-restaurant-finder

## Project Brief
This project is designed for the employees in Cogent Labs, an AI company in Tokyo, Japan, to help them to find restaurants quickly and efficiently. The solution was conducted by a react-based front-end app, with Masonry library and Material design library.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Contribution
In your favorite terminal, type:

```
npm install
```

Start development server by typing:

```
npm start
```

Once your development is finished, please write tests if necessary. Proper tests are required for core functions. Test can be run by typing:

```
npm test
```

Finally, please make sure it passes production build. You can verify it by typing:

```
npm build
```

## Reasoning Behind Technical Choices
React is assigned for this project, so create-react-app component is decided after a little bit research. It is well-designed with WebPack and ES6 minification, and it is very suitable for quick prototyping. For production level works, some integrations are needed. Masonry is decided for more interactive experience and dynamic layout. Redux was considered but finally was not chosen since the app tree is not super complicated and asynchronous calls were not heavily used. Since this task is very front-end focused, backend architecture is not implemented. Foursquare provides very reliable API service, so it is chosen for getting restaurant information. Material design library is chosen for advanced styles, since Material design is recommended, and I also have experience.


## Trade-offs
Foursquare provides an official adaptor for React, but it has some problems during complications, since the code is not published as an ES5 standard package, so the compiler would complain about it. It might be a little bit too much to publish a new version to NPM for now, so I wrote a small version, and it passed the complication. However, if any new API would be added, developers should  write solutions, or should fire an issue on [the official repository](https://github.com/foursquare/react-foursquare).

A map view is mandatory in this project, and an embedded map was considered at the beginning. Foursquare officially works with OpenStreetMap and it has good data integration, but it is abandoned because the use case of this app is supposed for mobile users. I believe that providing a map link, which directly launch after a click, would be a more appropriate way for most of users instead of an embedded map.

By default, mobile number is presented as the main CTA, and map CTA would be the secondary CTA. Nonetheless, some restaurants don't have mobile number information. In that case, the map CTA would be the main CTA.

In search bar, requests would be sent frequently if inputs are too many. Dynamically requests might not be very ideal. Throttle or debounce could be applied if necessary.

Icons are provided for better and quick understanding of the selected restaurant. In the search result panel, if a restaurant got more visits, it will be displayed larger. There are 3 different size for the results, which indicate that the restaurant is popular, or very popular.

## Tests
Tests might not be verycomprehensive. Since this app uses [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) but Node.js doesn't support it, some polyfills are installed and defined in **src/setupTests** file before actual tests. Enzyme and sinon are used for React test utilities, to help simulate DOM activities like brower events.

## Contact
If you have any questions or you are simply interested in my profile, please send [a mail](mailto:min427@gmail.com) or let's connect on [LinkedIn](https://www.linkedin.com/in/chungmincheng/). I am always enthusiastic in new front-end technologies.
