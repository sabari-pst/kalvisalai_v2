import React, { useState, useEffect, useContext, useCallback } from 'react';
import $ from 'jquery';
import { useHistory, withRouter, Link } from 'react-router-dom';

import PsContext from '../../../context';
import { Button } from 'react-bootstrap';
import PsModalWindow from '../../../utils/PsModalWindow';
import EditBatch from './editBatch';
import SemesterSetup from './semesterSetup';
import ModuleAccess from '../../../context/moduleAccess';


const BatchListCard = (props) => {

    const context = useContext(PsContext);
    const history = useHistory();

    const [showEdit, setShowEdit] = useState(false);
    const [viewData, setViewData] = useState([]);

    const [activeId, setActiveId] = useState('');

    const handleEdit=(item)=>{
        setViewData(item);
        setShowEdit(true);
    }

   return (
        <>
            <div className='table-responsive'>
                <div className='tableFixHead bg-white '>
                    <table>
                        <thead>
                            <tr>
                                <th>Batch</th>
                                <th width="120">No.of Semesters</th>
                                <th width="80">#</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.dataSource.map((item,i)=>{
                                return <tr key={i} >
                                    <td>{item.batch}
                                    
                                    <a className="float-end" onClick={e => {
                                        setActiveId(activeId==item.id ? '' : item.id);
                                    }} >
                                        Set Semester Dates
                                        {activeId==item.id && (<i className="ms-2 fa-solid fa-chevron-down"></i>)}
                                        {activeId!=item.id && (<i className="ms-2 fa-solid fa-chevron-up"></i>)}
                                    </a>

                                    {activeId==item.id && (<SemesterSetup
                                        dataSource={item}    
                                    />)}
                                    </td>
                                    <td align="center">{item.no_of_semesters}</td>
                                    <td align="center">
                                        <ModuleAccess module="settings_batch_semester" action="action_update" >
                                            <Button size="sm" variant="transparent" title="Edit Group" onClick={e => handleEdit(item)}>
                                                <i className='fa-solid fa-pen fs-6'></i>
                                            </Button>
                                        </ModuleAccess>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
     
            <PsModalWindow title="Edit Batch" onHide={e => setShowEdit(false)} show={showEdit} >
                <EditBatch dataSource={viewData} onSuccess={e => props.onSuccess()} />
            </PsModalWindow>
        

        </>
    );
};

export default withRouter(BatchListCard);