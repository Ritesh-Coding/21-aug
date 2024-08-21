import React from "react";
import { useDispatch, UseDispatch } from "react-redux";
import { navbarTitle } from "../../../reducers/authReducer";
const Maps = () => {
const dispatch = useDispatch()
 dispatch( navbarTitle({navTitle: "Map"}));
  return (
    <div style={{width: `100%`,marginLeft:`260px`}}>
      <iframe
        width="100%"
        height="600"        
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1001%20-%201009%2010th%20floor%20City%20Center%202,%20Near%20Heer%20Party%20Plot,%20Sukan%20Mall%20Cross%20Road,%20Science%20City%20Rd,%20Sola,%20Ahmedabad,%20Gujarat%20380060+(My%20Business%20Name)&amp;t=k&amp;z=13&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
      >
        <a href="https://www.gps.ie/">gps trackers</a>
      </iframe>
    </div>
  );
};

export default Maps;
