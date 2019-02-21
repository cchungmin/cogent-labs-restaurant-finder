/* @flow */

import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';

const CARD_STYLES = {
  card: {
    maxWidth: 345,
    margin: '20px auto 30px',
  },
  actions: {
    justifyContent: 'center',
  },
};

type CtaProps = {
  phone: number,
  mapUrl?: string,
};

const CtaContainer = ({ phone, mapUrl }: CtaProps) => (
  <Grid className="cta-container">
    {
      typeof phone !== 'undefined' ?
        <PhoneCta phone={phone} /> : null
    }
    <Button
      color="primary"
      target="_blank"
      rel="noopener noreferrer"
      href={mapUrl}
    >
      Show Me the Map
    </Button>
  </Grid>
);

CtaContainer.defaultProps = {
  mapUrl: '',
};

type PhoneCtaProps = {
  phone: number,
};

const PhoneCta = ({ phone }: PhoneCtaProps) => (
  <span>
    <Button
      href={`tel:${phone}`}
      rel="noopener noreferrer"
    >
      Call Now
    </Button>
    &nbsp; or &nbsp;
  </span>
);


export default withStyles(CARD_STYLES)(
  ({ pickedVenue, pickedVenueMapUrl, classes: { card, actions } }) => (
    <Card className={card}>
      <CardActionArea>
        <CardMedia>
          { typeof pickedVenue.bestPhoto !== 'undefined' ?
            (
              <img
                src={`${pickedVenue.bestPhoto.prefix}width300${pickedVenue.bestPhoto.suffix}`}
                alt={pickedVenue.name}
              />
            ) : null
          }
        </CardMedia>
        <CardContent>
          <Typography>
            <h5>{ pickedVenue.name }</h5>
            <h4>{ pickedVenue.rating || 'N/A' }</h4>
            <p>
              {
                typeof pickedVenue.hours !== 'undefined' ?
                  `In service. ${pickedVenue.hours.status}` : 'Out of service'
              }
            </p>
          </Typography>
          <Typography>
            {
              typeof pickedVenue.categories !== 'undefined' ?
                pickedVenue.categories.map(item => (
                  <span key={item.id}>
                    <img
                      className="picked-venue-icon"
                      src={`${item.icon.prefix}64${item.icon.suffix}`}
                      alt={item.icon.name}
                    />
                  </span>
                )) : null
            }
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={actions}>
        {
          typeof pickedVenue.contact !== 'undefined' ?
            (
              <CtaContainer
                phone={pickedVenue.contact.phone}
                mapUrl={pickedVenueMapUrl}
              />
            ) : null
        }
      </CardActions>
    </Card>
  ),
);
