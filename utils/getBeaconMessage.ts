interface Location {
  country: string;
  region: string;
  city: string;
  lat: string;
  long: string;
  ip: string;
  ua: string;
}

export const getBeaconMessage = ({
  country,
  region,
  city,
  lat,
  long,
  ip,
  ua,
}: Location) => {
  const decodedCity = decodeURIComponent(city);
  const decodedUa = decodeURIComponent(ua);
  const location = {
    city: decodedCity,
    region: region,
    country: country,
    lat: lat,
    long: long,
    ip: ip,
    ua: JSON.parse(decodedUa),
  };
  let device = "";
  if (location.ua.device.vendor && location.ua.device.model) {
    device = `\n${location.ua.device.vendor} ${location.ua.device.model}`;
  }
  const blocks = {
    text: `New user from ${location.city}, ${location.region} ${location.country}${device}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${location.city}, ${location.region} ${location.country}${device}
  ${location.ua.os.name} ${location.ua.os.version}
  ${location.ua.browser.name} ${location.ua.browser.version}
  ${location.ip}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Google Map",
            },
            url: `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.long}`,
          },
        ],
      },
    ],
  };
  return blocks;
};
