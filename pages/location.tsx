import { Box, Text } from "@primer/react";
import type { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useMemo } from "react";
import ColorModeSwitcher from "../components/ColorModeSwitcher";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    return {
      props: ctx.query,
    };
  } catch (error) {
    console.log(error);
  }
};

interface Props {
  country: string;
  region: string;
  city: string;
  lat: string;
  long: string;
  ip: string;
  ua: string;
}

const Location: NextPage<Props> = (props: Props) => {
  const message = useMemo(() => {
    const { country, region, city, lat, long, ip, ua } = props;
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
  }, [props]);

  useEffect(() => {
    async function sendBeacon(msg: string) {
      await fetch("/api/beacon", {
        method: "POST",
        body: msg,
      });
    }
    if (typeof window !== "undefined") {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/beacon", JSON.stringify(message));
      } else {
        sendBeacon(JSON.stringify(message));
      }
    }
  }, [message]);

  return (
    <Box
      height="100vh"
      bg="canvas.default"
      color="fg.default"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <ColorModeSwitcher />
      {props.ip !== "undefined" ? (
        <Box>
          <pre>{JSON.stringify(message, null, 2)}</pre>
        </Box>
      ) : (
        <Box>
          <Box>
            <Text>No location information in dev mode</Text>
          </Box>
          <Box>
            <pre>
              {JSON.stringify(
                JSON.parse(decodeURIComponent(props.ua)),
                null,
                2
              )}
            </pre>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Location;
