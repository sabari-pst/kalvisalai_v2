import React from 'react';
import { useHistory, Link } from 'react-router-dom';

import IMG_NODATA from '../../../../assets/images/nodata.png';

const NoDataFound=(props)=>{

    const history = useHistory();

   
    return(
        <>
            <center>
                <img src={IMG_NODATA} 
                    style={{
                        width: '100px',
                        opacity: '0.5',
                    }}
                    {...props}
                />
            </center>
        </>
    );
};
export default NoDataFound;