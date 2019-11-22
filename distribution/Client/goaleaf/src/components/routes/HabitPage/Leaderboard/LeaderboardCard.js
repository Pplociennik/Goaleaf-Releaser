import React from 'react'
import TempPic from './../../../../assets/default-profile-pic.png'

function LeaderboardCard(props) {

        return (
            <li className="collection-item" style={{fontSize: '0.6em', display: 'flex'}}>
                <span style={{width: '10%',fontSize: '3em', textAlign: 'center'}}>{props.position}.</span>
                <div style={{width: '20%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <img src={TempPic} alt="User avatar" title="User avatar" style={{width: '40px', height: '40px'}} />
        <span style={{fontSize: '1.4em', marginTop: '4px'}}>{props.userLogin}</span> 
                </div> 
                <div style={{width: '70%', display: 'flex', flexDirection: 'column'}}> 
                    <span style={{fontSize: '2.2em', alignSelf: 'flex-end', marginBottom: '5px'}} >{props.points} pts</span>
                    <div className="progress" style={{width: '100%'}}>
                        <div className="determinate" style={{width: `${props.scorePercentage}%`}}></div>
                    </div>
                </div>
                
            </li>
        )

}

export default LeaderboardCard;