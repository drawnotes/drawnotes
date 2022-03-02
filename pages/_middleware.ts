import { NextRequest, NextResponse } from "next/server";

/*
NextRequest

cookies - Has the cookies from the Request
nextUrl - Includes an extended, parsed, URL object
  that gives you access to Next.js specific properties
  such as pathname, basePath, trailingSlash and i18n
geo - Has the geo location from the Request
geo.country - The country code
geo.region - The region code
geo.city - The city
geo.latitude - The latitude
geo.longitude - The longitude
ip - Has the IP address of the Request
ua - Has the user agent

NextFetchEvent

 waitUntil() method can be used to prolong the execution
 of the function, after the response has been sent.
In practice this means that you can send a response,
then continue the function execution if you have other
background work to make.
*/

export async function middleware(req: NextRequest) {
  const { nextUrl: url, geo } = req;
  const country = geo!.country || "US";
  const region = geo!.region || "CA";
  const city = geo!.city || "San Francisco";

  // const countryInfo = countries.find((x) => x.cca2 === country);

  const lat = geo!.latitude;
  const long = geo!.longitude;
  const ip = req.ip;
  const ua = JSON.stringify(req.ua);

  url.searchParams.set("country", country);
  url.searchParams.set("region", region);
  url.searchParams.set("city", city);
  url.searchParams.set("lat", lat!);
  url.searchParams.set("long", long!);
  url.searchParams.set("ip", ip!);
  url.searchParams.set("ua", ua);

  return NextResponse.rewrite(url);
}
