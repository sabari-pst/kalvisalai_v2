import React from 'react';
import { useHistory, Link } from 'react-router-dom';

import { Row, Col, Card, Button } from 'react-bootstrap';
import breadCrumpData from '../../breadcrumb';

const BreadCrumbs=(props)=>{

    const history = useHistory();

    const subLinks=(items)=>{
        let m = items.map( item => <li class="breadcrumb-item">
            <Link to={item.path} >{item.name}</Link>
        </li>)
        return m;
    };

    const innerLinks=(item)=>{

        return <>
            {item.child && item.child.length>0 && (subLinks(item.child))}
            
            <li class="breadcrumb-item active" aria-current="page">{item.name}</li>
        </>;
    };

    const links=()=>{
        let dt = breadCrumpData.find(item=> item.path.indexOf(history.location.pathname)>-1);
        
        return <ol class="breadcrumb">
            <li class="breadcrumb-item"><Link to="/app" >Home</Link></li>
            {dt && dt.path && (innerLinks(dt))}
        </ol>;
    };
    return(
        <Card className="ps__breadcrumb border-0 shadow-sm rounded-0" >
            <Row>
                <Col md={4} className="d-flex align-items-center" >
                    <nav aria-label="breadcrumb" style={{height: '20px'}}>
                            {links()}
                    </nav>
                </Col>
                <Col md={8}>
                    <div className="text-end">
                        {props.children}
                    </div>
                </Col>
            </Row>
        </Card>
    );
};
export default BreadCrumbs;