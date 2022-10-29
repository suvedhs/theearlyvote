import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useState, useEffect, useRef } from 'react';
import countyPollingLocations from '../public/locations.json'

var axios = require('axios');

export default function Home() {
  const [value, setValue] = useState(null);
  
  let autocompleteRef = useRef()

  let infoRef = useRef<HTMLElement>(null)
  let countyNameRef = useRef<HTMLElement>(null)
  let mapRef = useRef<HTMLIFrameElement>(null)
  let closestRef = useRef<HTMLAnchorElement>(null)
  let searchRef = useRef<HTMLAnchorElement>(null)
  // let countySiteRef = useRef<HTMLAnchorElement>(null)
  // let pdfRef = useRef<HTMLAnchorElement>(null)
  let mapsScriptSrc = 'https://maps.googleapis.com/maps/api/js?key=' + process.env.maps + '&libraries=places'
  
  let placeid
  let mapsUrl

  const getCountyInfo = (county) => {
    let locs = countyPollingLocations
    county = county.substring(0, county.length - 7).toUpperCase()
    if(locs[county]) {
      console.log(locs[county])
      return locs[county]
    }
    else {
      console.log("Looks like we don't have your county's polling locations")
    }
  }

  const getCounty = (placeInfo) => {
    console.log(placeInfo)
    let county = ''
    let zip = ''
    placeInfo.forEach(element => {
      let isCounty = false
      let isZip = false
      element.types.forEach(type => {
        if(type == "administrative_area_level_2") {
          isCounty = true
        } else if (type == "postal_code") {
          isZip = true
        }
      })
      if(isCounty) {
        county = element.long_name
      } else if (isZip) {
        zip = element.long_name
      }
    })

    if(county.length != 0) {
      return county
    } else if (zip.length != 0) {
      // return getCountyByZip(zip)
      console.log(zip)
    } else {
      console.error(
        "didn't find zip or county"
      )
    }
  }

  const getAddressInfo = () => {
    var config = {
      method: 'get',
      url: 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + placeid +'&fields=address_component&key=' + process.env.maps,
    };
    return axios(config)
    .then(function (response) {
      console.log(response.data.result.address_components)
      return response.data.result.address_components
    })
    .catch(function (error) {
      console.log(error);
      return error
    });
  }

  const getBestof20 = async (locList) => {
    let addresses = ""
    console.log(locList)
    let num = 0
    locList.forEach(element => {
      if(num < 20)
        addresses += encodeURI(element.slice(0,-1)) + '|'
      num++
    });
    addresses.slice(0,-1)
    addresses = addresses.replaceAll('#', '')
    
    let g20url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:' + placeid + '&destinations=' + addresses + '&key=' + process.env.maps
    console.log(g20url)

    var config = {
      method: 'get',
      url: g20url,
      headers: { }
    };
    return await axios(config)
    .then(function (response) {
      console.log(response.data);
      console.log(response.data.rows[0].elements);
      let count = 0
      let ind = 0
      let min = 0
      response.data.rows[0].elements.forEach(element => {
        if(count == 0) {
          ind = 0
          min = element.duration.value
        }
        else if(min > element.duration.value) {
          ind = count
          min = element.duration.value
        }
        count++
      })
      return response.data.destination_addresses[ind]
    })
    .catch(function (error) {
      console.log(error);
      return error
    });
  }

  const getDist = async (locList) => {
    console.log(placeid)
    locList = locList.filter(loc => loc['POLLING PLACE TYPE'] == 'EARLY VOTING').map( loc => {
      return loc['ADDRESS']
    })
    console.log(locList)
    let closest
    while(locList.size > 20) {
      closest = await getBestof20(locList)
      locList.splice(0,20)
      locList.append(closest)
    }
    closest = await getBestof20(locList)
    
    mapsUrl = "https://www.google.com/maps/embed/v1/place?key=" + process.env.maps + "&q=" + encodeURI(closest)
    if(mapRef.current) {
      mapRef.current.src = mapsUrl
    }

    if(closestRef.current) {
      closestRef.current.innerHTML = closest
      closestRef.current.href = 'https://maps.google.com/?q=' + encodeURI(closest)
    }
  }
  
  const getPoll = async (place) => {
    placeid = place.place_id
    
    getAddressInfo().then(function(placeInfo) {
      const county = getCounty(placeInfo)
      console.log(county)
      const countyInfo = getCountyInfo(county)
      if(countyInfo) {
        console.log(countyInfo)
        if(countyNameRef.current) {
          countyNameRef.current.innerHTML = county
        }
        if(searchRef.current) {
          let search = 'Early voting in ' + county
          searchRef.current.href = 'https://www.google.com/search?q=' + encodeURI(search)
          searchRef.current.innerHTML = 'Early voting in ' + county
        }
        getDist(countyInfo)
        // if(countySiteRef.current) {
        //   countySiteRef.current.innerHTML = countyInfo["county-page"]
        //   countySiteRef.current.href = countyInfo["county-page"]
        // }
        // if(pdfRef.current) {
        //   pdfRef.current.innerHTML = countyInfo.pdf
        //   pdfRef.current.href = countyInfo.pdf
        // }
        if(infoRef.current) {
          infoRef.current.classList.remove('hidden')
        }
      }
    })
  }

  useEffect(() => {
    if(value) {
      console.log(value.value)
      getPoll(value.value)
    }
  })

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
        <script src={mapsScriptSrc}></script>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Live in Texas? Enter your address or zip code and find your nearest polling locations for early voting.</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
      <GooglePlacesAutocomplete
        apiKey= {process.env.maps}
        ref={autocompleteRef}
        autocompletionRequest={{
            bounds: [
              { lat: 30, lng: -100},
              { lat: 37, lng: -93}
            ],
            componentRestrictions: {
              country: ['us']
            },
        }}
        selectProps={{
          value,
          onChange: setValue,
          styles: {
            input: (provided) => ({
              ...provided,
              placeholder: 'Address'
            })
          }
        }}
      />
      </section>
      <section className='hidden' ref={infoRef}>
        <p>Looks like you live in <span className="bold" ref={countyNameRef}></span>.</p>
        {/* <p>Here's a link to the county's early voting page:<br />
        <a ref={countySiteRef} href=''></a></p>
        <p>Here's a PDF of all of the county's early voting locations:<br />
        <a ref={pdfRef} href=''></a></p> */}
        <p>Your closest polling location is:<br />
          <a className="bold" ref={closestRef}></a>
        </p>
        <p>For more information on locations and times, search <a target= '_blank' ref={searchRef}></a>.</p>
        <iframe
          id="mapId"
          ref={mapRef}
          // width="600"
          // height="400"
          frameBorder="0"
          style= {{ border:0 }}
          referrerPolicy="no-referrer-when-downgrade">
        </iframe>
      </section>
    </Layout>
  )
}